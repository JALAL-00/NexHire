import { UsersService } from './users.service';
import { RequestWithUser } from 'src/common/types/request-with-user.interface';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findRecommendations(limit: number | undefined, req: RequestWithUser): Promise<import("../auth/entities/user.entity").User[]>;
    findAllCandidates(): Promise<import("../auth/entities/user.entity").User[]>;
    findOneUserProfile(id: number): Promise<import("../auth/entities/user.entity").User>;
}
