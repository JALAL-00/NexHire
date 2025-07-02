// backend/src/posts/posts.service.ts
import { Injectable, NotFoundException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post, PostType } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'src/auth/entities/user.entity';
import * as fs from 'fs'; // Import Node.js file system module
import { join } from 'path'; // Import Node.js path module

// Helper function to determine PostType from the file's MIME type
const getPostTypeFromMime = (mimeType: string): PostType => {
  if (mimeType.startsWith('image/')) return PostType.IMAGE;
  if (mimeType.startsWith('video/')) return PostType.VIDEO;
  // Expand this with more types as needed
  if (mimeType === 'application/pdf') return PostType.FILE;
  // A generic fallback for other documents
  return PostType.FILE;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    user: User,
    file?: Express.Multer.File,
  ): Promise<Post> {
    
    let postType = PostType.TEXT;
    if (file) {
      postType = getPostTypeFromMime(file.mimetype);
    }
    // -----------------------

    const newPost = this.postsRepository.create({
      content: createPostDto.content,
      author: user,
      type: postType, // Use the determined type
      mediaUrl: file ? `posts/${file.filename}` : null,
    });
    
    const savedPost = await this.postsRepository.save(newPost);
    
    const foundPost = await this.postsRepository.findOne({
      where: { id: savedPost.id },
      relations: ['author', 'author.candidateProfile', 'author.recruiterProfile'],
    });

    if (!foundPost) {
      throw new InternalServerErrorException('Could not find the post after creating it.');
    }

    return foundPost;
  }

  async findAll(): Promise<Post[]> {
    return this.postsRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['author', 'author.candidateProfile', 'author.recruiterProfile'],
    });
  }

  async findByUser(userId: number): Promise<Post[]> {
    return this.postsRepository.find({
      where: { author: { id: userId } },
      order: { createdAt: 'DESC' },
      relations: ['author', 'author.candidateProfile', 'author.recruiterProfile'],
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto, user: User): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found.`);
    }
    if (post.author.id !== user.id) {
      throw new UnauthorizedException('You can only edit your own posts.');
    }

    // Update the content
    post.content = updatePostDto.content;
    
    // Save and return the updated post with author relations
    const updatedPost = await this.postsRepository.save(post);
    const foundPost = await this.postsRepository.findOne({
        where: { id: updatedPost.id },
        relations: ['author', 'author.candidateProfile', 'author.recruiterProfile'],
    });
    if (!foundPost) {
      throw new InternalServerErrorException('Could not find the post after updating it.');
    }
    return foundPost;
  }

  // --- THIS IS THE FIX (Part 2) ---
  // Enhanced method to also delete the media file from storage
  async remove(id: number, user: User): Promise<void> {
    const post = await this.postsRepository.findOne({
        where: { id },
        relations: ['author']
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found.`);
    }
    if (post.author.id !== user.id) {
      throw new UnauthorizedException('You can only delete your own posts.');
    }
    
    // If there's a media file, delete it from the server
    if (post.mediaUrl) {
      const filePath = join(process.cwd(), 'uploads', post.mediaUrl);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Failed to delete media file: ${filePath}`, err);
          // Don't throw an error, just log it. The DB record will still be deleted.
        }
      });
    }
    
    await this.postsRepository.delete(id);
  }
}