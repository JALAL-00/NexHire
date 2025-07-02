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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("../entities/user.entity");
let GoogleStrategy = class GoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    configService;
    constructor(configService) {
        super({
            clientID: configService.get('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
            callbackURL: 'http://localhost:3000/auth/google/callback',
            scope: ['email', 'profile'],
            passReqToCallback: true,
            prompt: 'select_account',
        });
        this.configService = configService;
    }
    async validate(req, accessToken, refreshToken, profile, done) {
        const { name, emails } = profile;
        const email = emails?.[0]?.value;
        if (!email) {
            return done(new common_1.UnauthorizedException('Google account must have a verified email.'), false);
        }
        let role = user_entity_1.UserRole.CANDIDATE;
        let action = 'register';
        try {
            if (req.query.state) {
                const decodedState = JSON.parse(Buffer.from(req.query.state, 'base64').toString('ascii'));
                if (decodedState.role === 'recruiter') {
                    role = user_entity_1.UserRole.RECRUITER;
                }
                if (decodedState.action === 'login') {
                    action = 'login';
                }
            }
        }
        catch (e) {
            console.error("Failed to parse state from Google OAuth.", e);
        }
        const user = {
            email: email,
            firstName: name?.givenName || '',
            lastName: name?.familyName || '',
            role: role,
            action: action,
            accessToken,
        };
        done(null, user);
    }
};
exports.GoogleStrategy = GoogleStrategy;
exports.GoogleStrategy = GoogleStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GoogleStrategy);
//# sourceMappingURL=google.strategy.js.map