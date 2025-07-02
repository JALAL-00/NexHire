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
exports.Job = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../auth/entities/user.entity");
const application_entity_1 = require("../../applications/entities/application.entity");
const typeorm_2 = require("typeorm");
let Job = class Job {
    id;
    title;
    description;
    location;
    salary;
    skills;
    experience;
    recruiter;
    applications;
    responsibilities;
    expirationDate;
    jobType;
    jobLevel;
    education;
    createdAt;
    status;
};
exports.Job = Job;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Job.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Job.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "salary", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], Job.prototype, "skills", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "experience", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.jobs),
    __metadata("design:type", user_entity_1.User)
], Job.prototype, "recruiter", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => application_entity_1.Application, (application) => application.job),
    __metadata("design:type", Array)
], Job.prototype, "applications", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "responsibilities", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "expirationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "jobType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "jobLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "education", void 0);
__decorate([
    (0, typeorm_2.CreateDateColumn)(),
    __metadata("design:type", Date)
], Job.prototype, "createdAt", void 0);
exports.Job = Job = __decorate([
    (0, typeorm_1.Entity)()
], Job);
//# sourceMappingURL=job.entity.js.map