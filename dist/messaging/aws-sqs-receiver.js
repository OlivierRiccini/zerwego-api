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
// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
var queueURL = "https://sqs.us-east-1.amazonaws.com/039444674434/NiceQueue";
let AWSSqsReceiver = class AWSSqsReceiver {
    constructor() {
        this.init();
    }
    init() {
        AWS.config.update({ region: 'us-east-1' });
        this.sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
        const params = this.buildParams();
        this.initReceiver(params);
    }
    initReceiver(parameters) {
        this.sqs.receiveMessage(parameters, function (err, data) {
            if (err) {
                console.log("Receive Error", err);
            }
            else if (data.Messages) {
                console.log('----------- RECEIVED ----------');
                console.log(data.Messages[0]);
                var deleteParams = {
                    QueueUrl: queueURL,
                    ReceiptHandle: data.Messages[0].ReceiptHandle
                };
                this.sqs.deleteMessage(deleteParams, function (err, data) {
                    if (err) {
                        console.log("Delete Error", err);
                    }
                    else {
                        console.log("Message Deleted", data);
                    }
                });
            }
        });
    }
    buildParams() {
        return {
            AttributeNames: [
                "SentTimestamp"
            ],
            MaxNumberOfMessages: 1,
            MessageAttributeNames: [
                "All"
            ],
            QueueUrl: queueURL,
            VisibilityTimeout: 20,
            WaitTimeSeconds: 0
        };
    }
};
AWSSqsReceiver = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], AWSSqsReceiver);
exports.AWSSqsReceiver = AWSSqsReceiver;
//# sourceMappingURL=aws-sqs-receiver.js.map