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
exports.CandidateProfile = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../auth/entities/user.entity");
const job_entity_1 = require("../../jobs/entities/job.entity");
let CandidateProfile = class CandidateProfile {
    id;
    user;
    title;
    availability;
    location;
    about;
    services;
    skills;
    experience;
    education;
    resume;
    isVisible;
    profilePicture;
    coverPhoto;
    savedJobs;
};
exports.CandidateProfile = CandidateProfile;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CandidateProfile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, (user) => user.candidateProfile, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], CandidateProfile.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CandidateProfile.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CandidateProfile.prototype, "availability", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CandidateProfile.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CandidateProfile.prototype, "about", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CandidateProfile.prototype, "services", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], CandidateProfile.prototype, "skills", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true, default: [] }),
    __metadata("design:type", Array)
], CandidateProfile.prototype, "experience", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true, default: [] }),
    __metadata("design:type", Array)
], CandidateProfile.prototype, "education", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CandidateProfile.prototype, "resume", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], CandidateProfile.prototype, "isVisible", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CandidateProfile.prototype, "profilePicture", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CandidateProfile.prototype, "coverPhoto", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => job_entity_1.Job),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], CandidateProfile.prototype, "savedJobs", void 0);
exports.CandidateProfile = CandidateProfile = __decorate([
    (0, typeorm_1.Entity)()
], CandidateProfile);
//# sourceMappingURL=candidate-profile.entity.js.map