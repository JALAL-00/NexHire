import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'src/auth/entities/user.entity';
export declare class PostsService {
    private postsRepository;
    constructor(postsRepository: Repository<Post>);
    create(createPostDto: CreatePostDto, user: User, file?: Express.Multer.File): Promise<Post>;
    findAll(): Promise<Post[]>;
    findByUser(userId: number): Promise<Post[]>;
    update(id: number, updatePostDto: UpdatePostDto, user: User): Promise<Post>;
    remove(id: number, user: User): Promise<void>;
}
