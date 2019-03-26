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
const aws_ses_manager_1 = require("./aws-ses-manager");
const { Consumer } = require('sqs-consumer');
const awsSesManager = new aws_ses_manager_1.AwsSESManager();
const app = Consumer.create({
    queueUrl: "https://sqs.us-east-1.amazonaws.com/039444674434/NiceQueue",
    handleMessage: (message) => __awaiter(this, void 0, void 0, function* () {
        console.log(message.Body);
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
//# sourceMappingURL=test.js.map