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
exports.User = exports.UserRole = void 0;
const typeorm_1 = require("typeorm");
const candidate_profile_entity_1 = require("../../candidate/entities/candidate-profile.entity");
const job_entity_1 = require("../../jobs/entities/job.entity");
const application_entity_1 = require("../../applications/entities/application.entity");
const message_entity_1 = require("../../recruiter/entities/message.entity");
const scraped_job_entity_1 = require("../../scraper/entities/scraped-job.entity");
const recruiter_profile_entity_1 = require("../../recruiter/entities/recruiter-profile.entity");
const post_entity_1 = require("../../posts/entities/post.entity");
var UserRole;
(function (UserRole) {
    UserRole["RECRUITER"] = "recruiter";
    UserRole["CANDIDATE"] = "candidate";
})(UserRole || (exports.UserRole = UserRole = {}));
let User = class User {
    id;
    email;
    password;
    firstName;
    lastName;
    companyName;
    phone;
    role;
    resetPasswordToken;
    resetPasswordExpires;
    isPremium;
    resume;
    candidateProfile;
    recruiterProfile;
    jobs;
    applications;
    sentMessages;
    receivedMessages;
    scrapedJobs;
    posts;
    postedJobs;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "companyName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: UserRole }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "resetPasswordToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "resetPasswordExpires", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isPremium", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "resume", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => candidate_profile_entity_1.CandidateProfile, (profile) => profile.user, { cascade: true }),
    __metadata("design:type", candidate_profile_entity_1.CandidateProfile)
], User.prototype, "candidateProfile", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => recruiter_profile_entity_1.RecruiterProfile, (recruiterProfile) => recruiterProfile.user, { cascade: true }),
    __metadata("design:type", recruiter_profile_entity_1.RecruiterProfile)
], User.prototype, "recruiterProfile", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => job_entity_1.Job, (job) => job.recruiter, { cascade: true }),
    __metadata("design:type", Array)
], User.prototype, "jobs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => application_entity_1.Application, (application) => application.candidate, { cascade: true }),
    __metadata("design:type", Array)
], User.prototype, "applications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => message_entity_1.Message, (message) => message.sender, { cascade: true }),
    __metadata("design:type", Array)
], User.prototype, "sentMessages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => message_entity_1.Message, (message) => message.receiver, { cascade: true }),
    __metadata("design:type", Array)
], User.prototype, "receivedMessages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => scraped_job_entity_1.ScrapedJob, (scrapedJob) => scrapedJob.user),
    __metadata("design:type", Array)
], User.prototype, "scrapedJobs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => post_entity_1.Post, (post) => post.author),
    __metadata("design:type", Array)
], User.prototype, "posts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => job_entity_1.Job, (job) => job.recruiter),
    __metadata("design:type", Array)
], User.prototype, "postedJobs", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)()
], User);
//# sourceMappingURL=user.entity.js.map