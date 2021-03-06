"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var AWS = require('aws-sdk');
class AwsSESManager {
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
}
exports.AwsSESManager = AwsSESManager;
//# sourceMappingURL=playground.js.map