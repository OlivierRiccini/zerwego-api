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
const aws_ses_manager_1 = require("./aws-ses-manager");
const typedi_1 = require("typedi");
const { Consumer } = require('sqs-consumer');
let AWSSqsListenner = class AWSSqsListenner {
    constructor() {
        this.awsSesManager = new aws_ses_manager_1.AwsSESManager();
    }
    init() {
        // const awsSesManager = new AwsSESManager();
        const app = Consumer.create({
            queueUrl: "https://sqs.us-east-1.amazonaws.com/039444674434/NiceQueue",
            handleMessage: (message) => __awaiter(this, void 0, void 0, function* () {
                console.log(message.Body);
                yield this.awsSesManager.formatAndSendEmail(message.Body);
                // do some work with `message`
            })
        });
        app.on('error', (err) => {
            console.error(err.message);
        });
        app.on('processing_error', (err) => {
            console.error(err.message);
        });
        app.start();
    }
};
AWSSqsListenner = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], AWSSqsListenner);
exports.AWSSqsListenner = AWSSqsListenner;
//# sourceMappingURL=aws-sqs-listenner.js.map