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
let AwsSESManagerService = class AwsSESManagerService {
    // Load the AWS SDK for Node.js
    // Set the region 
    constructor() {
        this.init();
    }
    formatAndSenEmail(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = yield this.createSendEmailParams(message);
            this.SESService.sendEmail(params)
                .then(data => {
                console.log(data.MessageId);
            })
                .catch(err => {
                console.error(err, err.stack);
            });
        });
    }
    init() {
        AWS.config.update({ region: this.region });
        this.SESService = new AWS.SES({ apiVersion: this.apiVersion });
    }
    createSendEmailParams(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create sendEmail params 
            return {
                Destination: {
                    // CcAddresses: [
                    //   'us-west-2',
                    //   /* more items */
                    // ],
                    ToAddresses: [
                        'info@olivierriccini.com',
                    ]
                },
                Message: {
                    Body: {
                        Html: {
                            Charset: "UTF-8",
                            Data: `<h1>${msg.content.toString()}</h1>`
                        },
                        Text: {
                            Charset: "UTF-8",
                            Data: msg.content.toString()
                        }
                    },
                    Subject: {
                        Charset: 'UTF-8',
                        Data: 'Test email'
                    }
                },
                Source: 'info@olivierriccini.com',
            };
        });
    }
};
AwsSESManagerService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], AwsSESManagerService);
exports.AwsSESManagerService = AwsSESManagerService;
//# sourceMappingURL=aws-ses-manager-service.js.map