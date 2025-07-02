import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsService } from './applications.service';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { User } from '../auth/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailService } from '../common/email.service';
import { NotFoundException } from '@nestjs/common';

describe('ApplicationsService - Update Status', () => {
  let service: ApplicationsService;
  let applicationRepository: Repository<Application>;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        {
          provide: getRepositoryToken(Application),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Job),
          useClass: Repository,
        },
        {
          provide: EmailService,
          useValue: { sendMail: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
    applicationRepository = module.get<Repository<Application>>(getRepositoryToken(Application));
    emailService = module.get<EmailService>(EmailService);
  });

  it('should update application status and send email notification', async () => {
    const applicationId = 1;
    const status = 'accepted';
    const application = {
      id: applicationId,
      status: 'pending',
      candidate: { email: 'candidate@example.com' },
      job: { title: 'Software Engineer' },
    };
    const updatedApplication = { ...application, status };

    jest.spyOn(applicationRepository, 'findOne').mockResolvedValue(application as any);
    jest.spyOn(applicationRepository, 'save').mockResolvedValue(updatedApplication as any);
    jest.spyOn(emailService, 'sendMail').mockResolvedValue(undefined);

    const result = await service.updateStatus(applicationId, status);
    expect(result).toEqual(updatedApplication);
    expect(applicationRepository.save).toHaveBeenCalledWith(expect.objectContaining({ status }));
    expect(emailService.sendMail).toHaveBeenCalledWith(
      'candidate@example.com',
      'Application Status Update for Software Engineer',
      'Your application for "Software Engineer" has been updated to "accepted".',
    );
  });

  it('should throw NotFoundException if application does not exist', async () => {
    const applicationId = 1;
    const status = 'accepted';

    jest.spyOn(applicationRepository, 'findOne').mockResolvedValue(null);

    await expect(service.updateStatus(applicationId, status)).rejects.toThrow(NotFoundException);
  });
});