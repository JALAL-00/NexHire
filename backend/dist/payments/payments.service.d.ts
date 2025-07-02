import { Stripe } from 'stripe';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { AuthService } from '../auth/auth.service';
export declare class PaymentsService {
    private readonly stripeClient;
    private readonly userRepository;
    private readonly authService;
    constructor(stripeClient: Stripe, userRepository: Repository<User>, authService: AuthService);
    createCharge(amount: number, paymentMethodId: string, userId: number): Promise<any>;
}
