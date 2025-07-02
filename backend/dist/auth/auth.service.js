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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const job_entity_1 = require("../jobs/entities/job.entity");
const application_entity_1 = require("../applications/entities/application.entity");
const message_entity_1 = require("../recruiter/entities/message.entity");
const candidate_profile_entity_1 = require("../candidate/entities/candidate-profile.entity");
const recruiter_profile_entity_1 = require("../recruiter/entities/recruiter-profile.entity");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const nodemailer = require("nodemailer");
let AuthService = class AuthService {
    userRepository;
    jobRepository;
    applicationRepository;
    messageRepository;
    candidateProfileRepository;
    recruiterProfileRepository;
    jwtService;
    blockedEmailDomains = [
        'example.com',
        'mailinator.com',
        'tempmail.com',
        'guerrillamail.com',
        '10minutemail.com',
    ];
    constructor(userRepository, jobRepository, applicationRepository, messageRepository, candidateProfileRepository, recruiterProfileRepository, jwtService) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.messageRepository = messageRepository;
        this.candidateProfileRepository = candidateProfileRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.jwtService = jwtService;
    }
    async updateUser(userId, updateUserDto) {
        const { firstName, lastName, phone, ...profileData } = updateUserDto;
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['candidateProfile', 'recruiterProfile'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        const coreUpdates = {};
        if (firstName !== undefined)
            coreUpdates.firstName = firstName;
        if (lastName !== undefined)
            coreUpdates.lastName = lastName;
        if (phone !== undefined)
            coreUpdates.phone = phone;
        if (Object.keys(coreUpdates).length > 0) {
            await this.userRepository.update(userId, coreUpdates);
        }
        const validProfileData = Object.entries(profileData).reduce((acc, [key, value]) => {
            if (value !== undefined) {
                acc[key] = value;
            }
            return acc;
        }, {});
        if (user.role === user_entity_1.UserRole.CANDIDATE && user.candidateProfile) {
            if (Object.keys(validProfileData).length > 0) {
                await this.candidateProfileRepository.update({ id: user.candidateProfile.id }, validProfileData);
            }
        }
        else if (user.role === user_entity_1.UserRole.RECRUITER && user.recruiterProfile) {
            if (Object.keys(validProfileData).length > 0) {
                await this.recruiterProfileRepository.update({ id: user.recruiterProfile.id }, validProfileData);
            }
        }
        return this.getProfile(userId);
    }
    async isUserPremium(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            select: ['isPremium'],
        });
        if (!user) {
            return false;
        }
        return user.isPremium;
    }
    async getProfile(userId) {
        let user = await this.userRepository.findOne({
            where: { id: userId },
            relations: [
                'candidateProfile',
                'recruiterProfile',
                'candidateProfile.savedJobs',
                'applications',
                'applications.job'
            ],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.role === user_entity_1.UserRole.CANDIDATE && !user.candidateProfile) {
            const newProfile = this.candidateProfileRepository.create({ user, experience: [], education: [], savedJobs: [] });
            await this.candidateProfileRepository.save(newProfile);
            user.candidateProfile = newProfile;
        }
        else if (user.role === user_entity_1.UserRole.RECRUITER && !user.recruiterProfile) {
            const newProfile = this.recruiterProfileRepository.create({ user, companyName: user.companyName || 'N/A' });
            await this.recruiterProfileRepository.save(newProfile);
            user.recruiterProfile = newProfile;
        }
        const { password, ...safeUser } = user;
        return safeUser;
    }
    async updateProfileImage(user, imageType, filePath) {
        if (!imageType) {
            throw new common_1.BadRequestException('imageType (profilePicture or coverPhoto) is required.');
        }
        const finalPath = filePath.replace(/\\/g, '/').split('uploads/')[1];
        if (!finalPath) {
            throw new common_1.InternalServerErrorException('Could not determine file path after upload.');
        }
        try {
            if (user.role === user_entity_1.UserRole.CANDIDATE) {
                const profile = await this.candidateProfileRepository.findOneBy({ user: { id: user.id } });
                if (!profile)
                    throw new common_1.NotFoundException('Candidate profile not found.');
                await this.candidateProfileRepository.update({ id: profile.id }, { [imageType]: finalPath });
            }
            else if (user.role === user_entity_1.UserRole.RECRUITER) {
                const profile = await this.recruiterProfileRepository.findOneBy({ user: { id: user.id } });
                if (!profile)
                    throw new common_1.NotFoundException('Recruiter profile not found.');
                await this.recruiterProfileRepository.update({ id: profile.id }, { [imageType]: finalPath });
            }
            else {
                throw new common_1.NotFoundException('User profile type not found.');
            }
            return { message: 'Image uploaded successfully', filePath: finalPath };
        }
        catch (error) {
            console.error("Failed to update profile image path:", error);
            throw new common_1.InternalServerErrorException("Could not update profile image.");
        }
    }
    async handleGoogleAuth(profile) {
        const { email, firstName, lastName, role, action } = profile;
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (action === 'login') {
            if (!existingUser) {
                throw new common_1.BadRequestException('Account not found. Please register first.');
            }
            const jwtPayload = { email: existingUser.email, sub: existingUser.id, role: existingUser.role };
            const token = this.jwtService.sign(jwtPayload);
            return { user: existingUser, token };
        }
        else {
            if (existingUser) {
                const jwtPayload = { email: existingUser.email, sub: existingUser.id, role: existingUser.role };
                const token = this.jwtService.sign(jwtPayload);
                return { user: existingUser, token };
            }
            const newUser = this.userRepository.create({
                email,
                firstName,
                lastName,
                role,
                password: Math.random().toString(36).slice(-16),
            });
            const savedUser = await this.userRepository.save(newUser);
            if (role === user_entity_1.UserRole.CANDIDATE) {
                const candidateProfile = this.candidateProfileRepository.create({ user: savedUser });
                await this.candidateProfileRepository.save(candidateProfile);
            }
            else if (role === user_entity_1.UserRole.RECRUITER) {
                const recruiterProfile = this.recruiterProfileRepository.create({ user: savedUser, companyName: 'N/A' });
                await this.recruiterProfileRepository.save(recruiterProfile);
            }
            const jwtPayload = { email: savedUser.email, sub: savedUser.id, role: savedUser.role };
            const token = this.jwtService.sign(jwtPayload);
            return { user: savedUser, token };
        }
    }
    async register(registerDto) {
        const { email, password, firstName, lastName, companyName } = registerDto;
        const emailDomain = email.split('@')[1].toLowerCase();
        if (this.blockedEmailDomains.includes(emailDomain)) {
            throw new common_1.BadRequestException('Email domain is not allowed');
        }
        const existingUser = await this.userRepository
            .createQueryBuilder('user')
            .where('LOWER(user.email) = LOWER(:email)', { email })
            .getOne();
        if (existingUser) {
            throw new common_1.BadRequestException('Email already exists');
        }
        if (!password || password.trim().length < 8) {
            throw new common_1.BadRequestException('Password must be at least 8 characters');
        }
        const hashedPassword = await bcrypt.hash(password.trim(), 10);
        const role = companyName ? user_entity_1.UserRole.RECRUITER : user_entity_1.UserRole.CANDIDATE;
        const user = this.userRepository.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            companyName,
            role,
        });
        const savedUser = await this.userRepository.save(user);
        if (role === user_entity_1.UserRole.CANDIDATE) {
            const candidateProfile = this.candidateProfileRepository.create({ user: savedUser, isVisible: true });
            await this.candidateProfileRepository.save(candidateProfile);
        }
        else if (role === user_entity_1.UserRole.RECRUITER) {
            const recruiterProfile = this.recruiterProfileRepository.create({
                user: savedUser,
                companyName: savedUser.companyName,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
            });
            await this.recruiterProfileRepository.save(recruiterProfile);
        }
        return savedUser;
    }
    async validateUser(email, password) {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .where('LOWER(user.email) = LOWER(:email)', { email })
            .getOne();
        if (!user)
            return null;
        const isPasswordValid = await bcrypt.compare(password, user.password);
        return isPasswordValid ? user : null;
    }
    async login(user) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return { access_token: this.jwtService.sign(payload) };
    }
    async forgotPassword(forgotPasswordDto) {
        const { email } = forgotPasswordDto;
        const user = await this.userRepository
            .createQueryBuilder('user')
            .where('LOWER(user.email) = LOWER(:email)', { email })
            .getOne();
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const token = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 5 * 60 * 1000);
        user.resetPasswordToken = token;
        user.resetPasswordExpires = expires;
        await this.userRepository.save(user);
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
        });
        try {
            await transporter.sendMail({
                to: email,
                subject: 'NexHire Password Reset OTP',
                text: `Your OTP for password reset is: ${token}. It expires in 5 minutes.`,
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to send OTP. Please try again.');
        }
        return { message: 'OTP sent to your email' };
    }
    async resetPassword(resetPasswordDto) {
        const { token, password } = resetPasswordDto;
        const user = await this.userRepository.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: (0, typeorm_2.MoreThan)(new Date()),
            },
        });
        if (!user)
            throw new common_1.BadRequestException('Invalid or expired token');
        user.password = await bcrypt.hash(password.trim(), 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await this.userRepository.save(user);
        return { message: 'Password reset successfully' };
    }
    async logout(token) {
        return;
    }
    async deleteAccount(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['candidateProfile', 'recruiterProfile', 'jobs', 'applications', 'sentMessages', 'receivedMessages'],
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.applications)
            await this.applicationRepository.delete({ candidate: { id: userId } });
        if (user.jobs)
            await this.jobRepository.delete({ recruiter: { id: userId } });
        if (user.sentMessages)
            await this.messageRepository.delete({ sender: { id: userId } });
        if (user.receivedMessages)
            await this.messageRepository.delete({ receiver: { id: userId } });
        if (user.candidateProfile)
            await this.candidateProfileRepository.delete({ id: user.candidateProfile.id });
        if (user.recruiterProfile)
            await this.recruiterProfileRepository.delete({ id: user.recruiterProfile.id });
        await this.userRepository.delete(userId);
        return { message: 'Account deleted successfully' };
    }
    async validateUserFromPayload(payload) {
        return this.userRepository.findOne({ where: { id: payload.sub } });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __param(2, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __param(3, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(4, (0, typeorm_1.InjectRepository)(candidate_profile_entity_1.CandidateProfile)),
    __param(5, (0, typeorm_1.InjectRepository)(recruiter_profile_entity_1.RecruiterProfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map