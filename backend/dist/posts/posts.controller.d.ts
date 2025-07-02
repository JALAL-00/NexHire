import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { RequestWithUser } from 'src/common/types/request-with-user.interface';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(createPostDto: CreatePostDto, req: RequestWithUser, file: Express.Multer.File): Promise<import("./entities/post.entity").Post>;
    findAll(): Promise<import("./entities/post.entity").Post[]>;
    findByUser(userId: number): Promise<import("./entities/post.entity").Post[]>;
    update(id: number, updatePostDto: UpdatePostDto, req: RequestWithUser): Promise<import("./entities/post.entity").Post>;
    remove(id: number, req: RequestWithUser): Promise<void>;
}
