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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const post_entity_1 = require("./entities/post.entity");
const fs = require("fs");
const path_1 = require("path");
const getPostTypeFromMime = (mimeType) => {
    if (mimeType.startsWith('image/'))
        return post_entity_1.PostType.IMAGE;
    if (mimeType.startsWith('video/'))
        return post_entity_1.PostType.VIDEO;
    if (mimeType === 'application/pdf')
        return post_entity_1.PostType.FILE;
    return post_entity_1.PostType.FILE;
};
let PostsService = class PostsService {
    postsRepository;
    constructor(postsRepository) {
        this.postsRepository = postsRepository;
    }
    async create(createPostDto, user, file) {
        let postType = post_entity_1.PostType.TEXT;
        if (file) {
            postType = getPostTypeFromMime(file.mimetype);
        }
        const newPost = this.postsRepository.create({
            content: createPostDto.content,
            author: user,
            type: postType,
            mediaUrl: file ? `posts/${file.filename}` : null,
        });
        const savedPost = await this.postsRepository.save(newPost);
        const foundPost = await this.postsRepository.findOne({
            where: { id: savedPost.id },
            relations: ['author', 'author.candidateProfile', 'author.recruiterProfile'],
        });
        if (!foundPost) {
            throw new common_1.InternalServerErrorException('Could not find the post after creating it.');
        }
        return foundPost;
    }
    async findAll() {
        return this.postsRepository.find({
            order: { createdAt: 'DESC' },
            relations: ['author', 'author.candidateProfile', 'author.recruiterProfile'],
        });
    }
    async findByUser(userId) {
        return this.postsRepository.find({
            where: { author: { id: userId } },
            order: { createdAt: 'DESC' },
            relations: ['author', 'author.candidateProfile', 'author.recruiterProfile'],
        });
    }
    async update(id, updatePostDto, user) {
        const post = await this.postsRepository.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!post) {
            throw new common_1.NotFoundException(`Post with ID ${id} not found.`);
        }
        if (post.author.id !== user.id) {
            throw new common_1.UnauthorizedException('You can only edit your own posts.');
        }
        post.content = updatePostDto.content;
        const updatedPost = await this.postsRepository.save(post);
        const foundPost = await this.postsRepository.findOne({
            where: { id: updatedPost.id },
            relations: ['author', 'author.candidateProfile', 'author.recruiterProfile'],
        });
        if (!foundPost) {
            throw new common_1.InternalServerErrorException('Could not find the post after updating it.');
        }
        return foundPost;
    }
    async remove(id, user) {
        const post = await this.postsRepository.findOne({
            where: { id },
            relations: ['author']
        });
        if (!post) {
            throw new common_1.NotFoundException(`Post with ID ${id} not found.`);
        }
        if (post.author.id !== user.id) {
            throw new common_1.UnauthorizedException('You can only delete your own posts.');
        }
        if (post.mediaUrl) {
            const filePath = (0, path_1.join)(process.cwd(), 'uploads', post.mediaUrl);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Failed to delete media file: ${filePath}`, err);
                }
            });
        }
        await this.postsRepository.delete(id);
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PostsService);
//# sourceMappingURL=posts.service.js.map