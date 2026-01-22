import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile, StrategyOptionsWithRequest } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserRole } from '../entities/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3001/auth/google/callback',
      scope: ['email', 'profile'],
      passReqToCallback: true,
      state: true,
      prompt: 'select_account',
    } as StrategyOptionsWithRequest & { prompt: string; state: boolean });
  }

  async validate(req: Request, accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any> {
    const { name, emails } = profile;
    const email = emails?.[0]?.value;

    if (!email) {
      return done(new UnauthorizedException('Google account must have a verified email.'), false);
    }


    let role: UserRole = UserRole.CANDIDATE;
    let action: 'login' | 'register' = 'register';

    console.log('🔍 Full request query:', req.query);
    console.log('🔍 Request URL:', req.url);

    try {
      // The state parameter comes back from Google in the callback
      const stateParam = req.query.state as string;

      if (stateParam) {
        console.log('🔍 Raw state parameter:', stateParam);
        const decodedState = JSON.parse(Buffer.from(stateParam, 'base64').toString('ascii'));
        console.log('🔍 Decoded Google OAuth state:', decodedState);

        if (decodedState.role === 'recruiter') {
          role = UserRole.RECRUITER;
        }
        if (decodedState.action === 'login') {
          action = 'login';
        }
        console.log('✅ Final role and action:', { role, action });
      } else {
        console.log('⚠️  No state parameter found in request');
      }
    } catch (e) {
      console.error("❌ Failed to parse state from Google OAuth:", e);
    }


    const user = {
      email: email,
      firstName: name?.givenName || '',
      lastName: name?.familyName || '',
      role: role,
      action: action,
      accessToken,
    };

    console.log('👤 User object being returned:', { email: user.email, role: user.role, action: user.action });
    done(null, user);
  }
}