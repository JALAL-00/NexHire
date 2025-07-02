import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stripe } from 'stripe';
import { InjectStripeClient } from '@golevelup/nestjs-stripe';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { AuthService } from '../auth/auth.service'; // <-- Ensure this is imported

@Injectable()
export class PaymentsService {
  constructor(
    @InjectStripeClient() private readonly stripeClient: Stripe,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly authService: AuthService, // <-- Inject AuthService
  ) {}

  async createCharge(amount: number, paymentMethodId: string, userId: number): Promise<any> {
    try {
      const paymentIntent = await this.stripeClient.paymentIntents.create({
        amount: amount * 100,
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true,
        automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
      });

      let newAccessToken: string | null = null;

      if (paymentIntent.status === 'succeeded') {
        // 1. Update the user in the database
        await this.userRepository.update({ id: userId }, { isPremium: true });

        // 2. Fetch the newly updated user object from the database
        const updatedUser = await this.userRepository.findOneBy({ id: userId });
        
        // 3. If the user is found, create a new JWT for them
        if (updatedUser) {
          const tokenData = await this.authService.login(updatedUser);
          newAccessToken = tokenData.access_token;
        }
      }

      // 4. Return the success status and the new token
      return {
        success: paymentIntent.status === 'succeeded',
        newAccessToken: newAccessToken,
      };

    } catch (error) {
      console.error('Stripe charge error:', error);
      throw new BadRequestException(error.message || 'An unknown payment error occurred.');
    }
  }
}