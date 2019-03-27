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
const typedi_1 = require("typedi");
// import { AmqSender } from "../messaging/send";
const aws_sqs_sender_1 = require("../messaging/aws-sqs-sender");
let EmailService = class EmailService {
    constructor() { }
    sendEmail(message) {
        this.awsSqsSender.sendMessageToQueue(message);
    }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", aws_sqs_sender_1.AWSSqsSender)
], EmailService.prototype, "awsSqsSender", void 0);
EmailService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], EmailService);
exports.EmailService = EmailService;
//# sourceMappingURL=email-service.js.map