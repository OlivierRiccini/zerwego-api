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
const aws_ses_manager_1 = require("./aws-ses-manager");
var amqp = require('amqplib/callback_api');
// Load the AWS SDK for Node.js
// var AWS = require('aws-sdk');
let AmqReceiver = class AmqReceiver {
    // @Inject() private awsSesManager: AwsSESManager;
    constructor() {
        this.awsSesManager = new aws_ses_manager_1.AwsSESManager();
        // console.log(this.awsSesManager);
    }
    init() {
        amqp.connect('amqp://localhost', (err, conn) => {
            conn.createChannel((err, ch) => {
                var q = 'hello';
                ch.assertQueue(q, { durable: false });
                console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
                ch.consume(q, (msg) => __awaiter(this, void 0, void 0, function* () {
                    console.log(" [x] Received %s", msg.content.toString());
                    yield this.awsSesManager.formatAndSenEmail(msg);
                }), { noAck: true });
            });
        });
    }
};
AmqReceiver = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], AmqReceiver);
exports.AmqReceiver = AmqReceiver;
// 'use strict';
// import * as amqplib from 'amqplib/callback_api';
// import * as nodemailer from 'nodemailer';
// const config = process.env;
// // Setup Nodemailer transport
// const transport = nodemailer.createTransport({
//     host: config.server['host'],
//     port: config.server['port'],
//     // we intentionally do not set any authentication
//     // options here as we are going to use message specific
//     // credentials
//     // Security options to disallow using attachments from file or URL
//     disableFileAccess: true,
//     disableUrlAccess: true
// }, {
//     // Default options for the message. Used if specific values are not set
//     from: 'sender@example.com'
// });
// // Create connection to AMQP server
// amqplib.connect(config.amqp, (err, connection) => {
//     if (err) {
//         console.error(err.stack);
//         return process.exit(1);
//     }
//     // Create channel
//     connection.createChannel((err, channel) => {
//         if (err) {
//             console.error(err.stack);
//             return process.exit(1);
//         }
//         // Ensure queue for messages
//         channel.assertQueue(config.queue, {
//             // Ensure that the queue is not deleted when server restarts
//             durable: true
//         }, err => {
//             if (err) {
//                 console.error(err.stack);
//                 return process.exit(1);
//             }
//             // Only request 1 unacked message from queue
//             // This value indicates how many messages we want to process in parallel
//             channel.prefetch(1);
//             // Set up callback to handle messages received from the queue
//             channel.consume(config.queue, data => {
//                 if (data === null) {
//                     return;
//                 }
//                 // Decode message contents
//                 let message = JSON.parse(data.content.toString());
//                 // attach message specific authentication options
//                 // this is needed if you want to send different messages from
//                 // different user accounts
//                 message.auth = {
//                     user: 'testuser',
//                     pass: 'testpass'
//                 };
//                 // Send the message using the previously set up Nodemailer transport
//                 transport.sendMail(message, (err, info) => {
//                     if (err) {
//                         console.error(err.stack);
//                         // put the failed message item back to queue
//                         return channel.nack(data);
//                     }
//                     console.log('Delivered message %s', info.messageId);
//                     // remove message item from the queue
//                     channel.ack(data);
//                 });
//             });
//         });
//     });
// });
//# sourceMappingURL=receive.js.map