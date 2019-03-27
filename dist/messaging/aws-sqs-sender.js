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
// Load the SDK for JavaScript
var AWS = require('aws-sdk');
let AWSSqsSender = class AWSSqsSender {
    constructor() {
        AWS.config.update({ region: 'us-east-1' });
        this.sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
    }
    sendMessageToQueue(message) {
        const params = this.buildParams(message);
        this.sqs.sendMessage(params, function (err, data) {
            if (err) {
                console.log("Error", err);
            }
            else {
                console.log("Success", data.MessageId);
            }
        });
    }
    buildParams(message) {
        return {
            DelaySeconds: 10,
            MessageAttributes: {
                "Title": {
                    DataType: "String",
                    StringValue: "The Whistler"
                },
                "Author": {
                    DataType: "String",
                    StringValue: "John Grisham"
                },
                "WeeksOn": {
                    DataType: "Number",
                    StringValue: "6"
                }
            },
            MessageBody: message,
            QueueUrl: "https://sqs.us-east-1.amazonaws.com/039444674434/NiceQueue"
        };
    }
};
AWSSqsSender = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], AWSSqsSender);
exports.AWSSqsSender = AWSSqsSender;
//# sourceMappingURL=aws-sqs-sender.js.map