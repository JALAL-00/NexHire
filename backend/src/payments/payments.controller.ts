import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import { RequestWithUser } from '../common/types/request-with-user.interface';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('charge')
  async createCharge(
    @Body('amount') amount: number,
    @Body('paymentMethodId') paymentMethodId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.paymentsService.createCharge(amount, paymentMethodId, req.user.id);
  }
}