import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    findRecommendations(limit: number, currentUserId?: number): Promise<User[]>;
    findAllCandidates(): Promise<User[]>;
    findPublicProfileById(id: number): Promise<User>;
}
