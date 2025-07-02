"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../auth/entities/user.entity");
const conversation_entity_1 = require("./entities/conversation.entity");
const message_entity_1 = require("./entities/message.entity");
let ChatService = class ChatService {
    userRepository;
    conversationRepository;
    messageRepository;
    constructor(userRepository, conversationRepository, messageRepository) {
        this.userRepository = userRepository;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
    }
    async getUsersForChat(currentUser) {
        const targetRole = currentUser.role === user_entity_1.UserRole.CANDIDATE ? user_entity_1.UserRole.RECRUITER : user_entity_1.UserRole.CANDIDATE;
        const query = this.userRepository.createQueryBuilder('user')
            .where('user.role = :targetRole', { targetRole });
        if (targetRole === user_entity_1.UserRole.CANDIDATE) {
            query.leftJoinAndSelect('user.candidateProfile', 'candidateProfile');
        }
        else {
            query.leftJoinAndSelect('user.recruiterProfile', 'recruiterProfile');
        }
        const users = await query.getMany();
        return users.map(user => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profilePicture: user.candidateProfile?.profilePicture || user.recruiterProfile?.profilePicture || null,
        }));
    }
    async findOrCreateConversation(user1, user2Id) {
        const user2 = await this.userRepository.findOneBy({ id: user2Id });
        if (!user2)
            throw new common_1.NotFoundException('Recipient user not found');
        const queryBuilder = this.conversationRepository.createQueryBuilder('conversation')
            .leftJoin('conversation.participants', 'participant')
            .where('participant.id IN (:...userIds)', { userIds: [user1.id, user2Id] })
            .groupBy('conversation.id')
            .having('COUNT(conversation.id) = 2');
        let conversation = await queryBuilder.getOne();
        if (!conversation) {
            const newConversation = this.conversationRepository.create({
                participants: [user1, user2],
            });
            conversation = await this.conversationRepository.save(newConversation);
        }
        const fullConversation = await this.conversationRepository.findOne({
            where: { id: conversation.id },
            relations: ['participants', 'participants.candidateProfile', 'participants.recruiterProfile'],
        });
        if (!fullConversation) {
            throw new common_1.InternalServerErrorException('Could not load conversation after finding/creating it.');
        }
        fullConversation.participants = fullConversation.participants.map(p => ({
            ...p,
            profilePicture: p.candidateProfile?.profilePicture || p.recruiterProfile?.profilePicture || null,
        }));
        return fullConversation;
    }
    async getMessages(conversationId) {
        const messages = await this.messageRepository.createQueryBuilder('message')
            .innerJoin('message.conversation', 'conversation')
            .leftJoinAndSelect('message.sender', 'sender')
            .leftJoinAndSelect('sender.candidateProfile', 'candidateProfile')
            .leftJoinAndSelect('sender.recruiterProfile', 'recruiterProfile')
            .where('conversation.id = :conversationId', { conversationId })
            .orderBy('message.createdAt', 'ASC')
            .getMany();
        return messages.map(message => ({
            id: message.id,
            content: message.content,
            createdAt: message.createdAt,
            type: message.type,
            mediaUrl: message.mediaUrl,
            conversation: { id: conversationId },
            sender: {
                id: message.sender.id,
                firstName: message.sender.firstName,
                lastName: message.sender.lastName,
                email: message.sender.email,
                profilePicture: message.sender.candidateProfile?.profilePicture || message.sender.recruiterProfile?.profilePicture || null,
            }
        }));
    }
    async createMessage(sender, conversationId, content, type = message_entity_1.MessageType.TEXT, mediaUrl = null) {
        const conversation = await this.conversationRepository.findOneBy({ id: conversationId });
        if (!conversation)
            throw new common_1.NotFoundException('Conversation not found');
        const message = this.messageRepository.create({
            content,
            sender,
            conversation,
            type,
            mediaUrl,
        });
        const savedMessage = await this.messageRepository.save(message);
        const fullSender = await this.userRepository.findOne({
            where: { id: sender.id },
            relations: ['candidateProfile', 'recruiterProfile'],
        });
        if (!fullSender) {
            throw new common_1.NotFoundException(`Sender with ID ${sender.id} not found.`);
        }
        const finalMessage = {
            id: savedMessage.id,
            content: savedMessage.content,
            type: savedMessage.type,
            mediaUrl: savedMessage.mediaUrl,
            createdAt: savedMessage.createdAt,
            conversation: { id: conversationId },
            sender: {
                id: fullSender.id,
                firstName: fullSender.firstName,
                lastName: fullSender.lastName,
                email: fullSender.email,
                profilePicture: fullSender.candidateProfile?.profilePicture || fullSender.recruiterProfile?.profilePicture || null,
            },
        };
        return finalMessage;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(conversation_entity_1.Conversation)),
    __param(2, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ChatService);
//# sourceMappingURL=chat.service.js.map