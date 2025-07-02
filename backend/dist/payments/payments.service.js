"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const stripe_1 = require("stripe");
const nestjs_stripe_1 = require("@golevelup/nestjs-stripe");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../auth/entities/user.entity");
const auth_service_1 = require("../auth/auth.service");
let PaymentsService = class PaymentsService {
    stripeClient;
    userRepository;
    authService;
    constructor(stripeClient, userRepository, authService) {
        this.stripeClient = stripeClient;
        this.userRepository = userRepository;
        this.authService = authService;
    }
    async createCharge(amount, paymentMethodId, userId) {
        try {
            const paymentIntent = await this.stripeClient.paymentIntents.create({
                amount: amount * 100,
                currency: 'usd',
                payment_method: paymentMethodId,
                confirm: true,
                automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
            });
            let newAccessToken = null;
            if (paymentIntent.status === 'succeeded') {
                await this.userRepository.update({ id: userId }, { isPremium: true });
                const updatedUser = await this.userRepository.findOneBy({ id: userId });
                if (updatedUser) {
                    const tokenData = await this.authService.login(updatedUser);
                    newAccessToken = tokenData.access_token;
                }
            }
            return {
                success: paymentIntent.status === 'succeeded',
                newAccessToken: newAccessToken,
            };
        }
        catch (error) {
            console.error('Stripe charge error:', error);
            throw new common_1.BadRequestException(error.message || 'An unknown payment error occurred.');
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_stripe_1.InjectStripeClient)()),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [stripe_1.Stripe,
        typeorm_2.Repository,
        auth_service_1.AuthService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map