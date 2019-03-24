import { Service } from 'typedi';

var amqp = require('amqplib/callback_api');
// Load the AWS SDK for Node.js
// var AWS = require('aws-sdk');

@Service()
export class AmqSender { 
  constructor() {}

  public sendToMessageToQueue(message) {
    amqp.connect('amqp://localhost', function(err, conn) {
      conn.createChannel(function(err, ch) {
        var q = 'hello';
        var msg = message;
    
        ch.assertQueue(q, {durable: false});
        ch.sendToQueue(q, Buffer.from(msg));
        console.log(" [x] Sent %s", msg);
      });
      setTimeout(function() { conn.close(); process.exit(0) }, 500);
    });
  }

}
// 'use strict';

// var amqplib = require('amqplib/callback_api');
// const config = process.env;

// // Create connection to AMQP server
// amqplib.connect('amqp://localhost', (err, connection) => {
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
//         channel.assertQueue('nodemailer-amqp', {
//             // Ensure that the queue is not deleted when server restarts
//             durable: true
//         }, err => {
//             if (err) {
//                 console.error(err.stack);
//                 return process.exit(1);
//             }

//             // Create a function to send objects to the queue
//             // Javascript opbject is converted to JSON and the into a Buffer
//             let sender = (content, next) => {
//                 let sent = channel.sendToQueue('nodemailer-amqp', Buffer.from(JSON.stringify(content)), {
//                     // Store queued elements on disk
//                     persistent: true,
//                     contentType: 'application/json'
//                 });
//                 if (sent) {
//                     return next();
//                 } else {
//                     channel.once('drain', () => next());
//                 }
//             };

//             // push 100 messages to queue
//             let sent = 0;
//             let sendNext = () => {
//                 if (sent >= 1) {
//                     console.log('All messages sent!');
//                     // Close connection to AMQP server
//                     // We need to call channel.close first, otherwise pending
//                     // messages are not written to the queue
//                     return channel.close(() => connection.close());
//                 }
//                 sent++;
//                 sender({
//                     to: 'info@olivierriccini.com',
//                     subject: 'Test message #' + sent,
//                     text: 'hello world!'
//                 }, sendNext);
//             };

//             sendNext();

//         });
//     });
// });