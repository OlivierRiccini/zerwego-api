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
let AwsSESManager = class AwsSESManager {
    constructor() {
        const apiVersion = '2010-12-01';
        const region = 'us-east-1';
        this.init(apiVersion, region);
    }
    formatAndSendEmail(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = yield this.createSendEmailParams(message);
            this.sendPromise.sendEmail(params).promise()
                .then(function (data) {
                console.log(data.MessageId);
            }).catch(function (err) {
                console.error(err, err.stack);
            });
        });
    }
    init(apiVersion, region) {
        AWS.config.update({ region });
        this.sendPromise = new AWS.SES({ apiVersion });
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
                            Data: `<p>${msg}</p><br><a style="display: block; padding: 10px, 15px; background-color: blue" href="http://localhost:4200/trips/new/overview">Create a trip</a>`
                        },
                        Text: {
                            Charset: "UTF-8",
                            Data: msg
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
AwsSESManager = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], AwsSESManager);
exports.AwsSESManager = AwsSESManager;
//# sourceMappingURL=aws-ses-manager.js.map