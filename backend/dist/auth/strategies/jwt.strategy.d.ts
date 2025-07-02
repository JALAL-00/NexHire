import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { User } from '../entities/user.entity';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    validate(payload: {
        sub: number;
        email: string;
        role: string;
    }): Promise<User>;
}
export {};
