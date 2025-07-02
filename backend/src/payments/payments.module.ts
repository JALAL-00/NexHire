import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeModule } from '@golevelup/nestjs-stripe';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { User } from '../auth/entities/user.entity';
import { AuthModule } from '../auth/auth.module'; // <-- IMPORT THIS

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    StripeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const apiKey = configService.get<string>('STRIPE_SECRET_KEY');
        if (!apiKey) {
          throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
        }
        return {
          apiKey,
          apiVersion: '2025-05-28.basil',
        };
      },
      inject: [ConfigService],
    }),
    AuthModule, // <-- ADD THIS LINE
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}