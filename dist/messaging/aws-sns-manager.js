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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
var AWS = require('aws-sdk');
let AwsSNSManager = class AwsSNSManager {
    constructor() {
        AWS.config.region = 'us-east-1';
        this.sns = new AWS.SNS();
    }
    formatAndSendSMS() {
        return __awaiter(this, void 0, void 0, function* () {
            const params = this.buildParams();
            this.sns.publish(params, function (err, data) {
                if (err)
                    console.log(err, err.stack); // an error occurred
                else
                    console.log(data); // successful response
            });
        });
    }
    buildParams() {
        return {
            Message: 'this is a test message',
            MessageStructure: 'string',
            PhoneNumber: '+14383991332'
        };
    }
};
AwsSNSManager = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], AwsSNSManager);
exports.AwsSNSManager = AwsSNSManager;
//# sourceMappingURL=aws-sns-manager.js.map