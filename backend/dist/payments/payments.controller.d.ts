import { PaymentsService } from './payments.service';
import { RequestWithUser } from '../common/types/request-with-user.interface';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createCharge(amount: number, paymentMethodId: string, req: RequestWithUser): Promise<any>;
}
