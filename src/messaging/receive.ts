
var amqp = require('amqplib/callback_api');
// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'hello';

    ch.assertQueue(q, {durable: false});
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {
      console.log(" [x] Received %s", msg.content.toString());
          
    // Set the region 
    AWS.config.update({region: 'us-east-1'});

    // Create sendEmail params 
    var params = {
      Destination: { /* required */
        // CcAddresses: [
        //   'us-west-2',
        //   /* more items */
        // ],
        ToAddresses: [
          'info@olivierriccini.com',
          /* more items */
        ]
      },
      Message: { /* required */
        Body: { /* required */
          Html: {
          Charset: "UTF-8",
          Data: `<h1>${msg}</h1>`
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
      Source: 'info@olivierriccini.com', /* required */
    //   ReplyToAddresses: [
    //      'EMAIL_ADDRESS',
    //     /* more items */
    //   ],
    };

    // Create the promise and SES service object
    var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

// Handle promise's fulfilled/rejected states
    sendPromise.then(
      function(data) {
        console.log(data.MessageId);
      }).catch(
        function(err) {
        console.error(err, err.stack);
    });
        }, {noAck: true});
      });
});
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