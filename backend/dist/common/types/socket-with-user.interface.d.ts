import { Socket } from 'socket.io';
import { User } from '../../auth/entities/user.entity';
export interface SocketWithUser extends Socket {
    data: {
        user: User;
    };
}
