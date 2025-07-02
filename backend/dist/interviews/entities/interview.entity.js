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
exports.Interview = exports.InterviewType = void 0;
const application_entity_1 = require("../../applications/entities/application.entity");
const typeorm_1 = require("typeorm");
var InterviewType;
(function (InterviewType) {
    InterviewType["VIDEO_CALL"] = "Video Call";
    InterviewType["PHONE_SCREEN"] = "Phone Screen";
    InterviewType["ON_SITE"] = "On-site";
})(InterviewType || (exports.InterviewType = InterviewType = {}));
let Interview = class Interview {
    id;
    title;
    date;
    type;
    locationOrLink;
    notes;
    application;
};
exports.Interview = Interview;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Interview.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Interview.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Interview.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: InterviewType,
        default: InterviewType.VIDEO_CALL,
    }),
    __metadata("design:type", String)
], Interview.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Interview.prototype, "locationOrLink", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Interview.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => application_entity_1.Application, (application) => application.interviews),
    __metadata("design:type", application_entity_1.Application)
], Interview.prototype, "application", void 0);
exports.Interview = Interview = __decorate([
    (0, typeorm_1.Entity)()
], Interview);
//# sourceMappingURL=interview.entity.js.map