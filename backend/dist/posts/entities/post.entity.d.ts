import { User } from '../../auth/entities/user.entity';
export declare enum PostType {
    TEXT = "text",
    IMAGE = "image",
    VIDEO = "video",
    ARTICLE = "article",
    FILE = "file"
}
export declare class Post {
    id: number;
    content: string;
    type: PostType;
    mediaUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    author: User;
}
