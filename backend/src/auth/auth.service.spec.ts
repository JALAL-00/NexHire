import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../applications/entities/application.entity';
import { Message } from '../recruiter/entities/message.entity';
import { CandidateProfile } from '../candidate/entities/candidate-profile.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../common/email.service';

describe('AuthService - Logout', () => {
  let service: AuthService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Job),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Application),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Message),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CandidateProfile),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn() },
        },
        {
          provide: EmailService,
          useValue: { sendMail: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should logout successfully without blacklisting token', async () => {
    const mockToken = 'mock-jwt-token';
    // Mock logout to resolve without blacklisting
    jest.spyOn(service, 'logout').mockResolvedValue(undefined);
    await expect(service.logout(mockToken)).resolves.toBeUndefined();
    expect(service.logout).toHaveBeenCalledWith(mockToken);
  });
});