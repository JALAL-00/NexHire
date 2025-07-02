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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../auth/entities/user.entity");
let UsersService = class UsersService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async findRecommendations(limit, currentUserId) {
        try {
            const queryBuilder = this.userRepository.createQueryBuilder('user')
                .leftJoinAndSelect('user.candidateProfile', 'candidateProfile')
                .leftJoinAndSelect('user.recruiterProfile', 'recruiterProfile')
                .addSelect('RANDOM()', 'random')
                .orderBy('random')
                .take(limit);
            if (currentUserId) {
                queryBuilder.where('user.id != :currentUserId', { currentUserId });
            }
            const users = await queryBuilder.getMany();
            return users.map(user => {
                const { password, resetPasswordToken, resetPasswordExpires, random, ...safeUser } = user;
                return safeUser;
            });
        }
        catch (error) {
            console.error('Error fetching user recommendations:', error);
            throw new common_1.InternalServerErrorException('Could not fetch user recommendations.');
        }
    }
    async findAllCandidates() {
        try {
            const candidates = await this.userRepository.find({
                where: { role: user_entity_1.UserRole.CANDIDATE },
                relations: ['candidateProfile'],
            });
            return candidates.map(user => {
                const { password, resetPasswordToken, resetPasswordExpires, ...safeUser } = user;
                return safeUser;
            });
        }
        catch (error) {
            console.error('Error fetching all candidates:', error);
            throw new common_1.InternalServerErrorException('Could not fetch candidates.');
        }
    }
    async findPublicProfileById(id) {
        try {
            const user = await this.userRepository.findOne({
                where: { id },
                relations: ['candidateProfile', 'recruiterProfile'],
            });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${id} not found.`);
            }
            const { password, resetPasswordToken, resetPasswordExpires, ...safeUser } = user;
            return safeUser;
        }
        catch (error) {
            console.error(`Error fetching profile for user ID ${id}:`, error);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Could not fetch user profile.');
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map