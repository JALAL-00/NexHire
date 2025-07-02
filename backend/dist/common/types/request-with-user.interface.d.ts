import { Request } from 'express';
import { User } from '../../auth/entities/user.entity';
export interface RequestWithUser extends Request {
    user: User;
}
