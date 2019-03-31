// import { Service } from "typedi";
// import { CONSTANTS } from "../persist/constants";

// // Load the AWS SDK for Node.js
// var AWS = require('aws-sdk');
// // Set the region

// @Service()
// export class AWSSqsReceiver {
//   sqs: any;

//   constructor() {
//     this.init();
//   }
//   private init() {

//     AWS.config.update({region: 'us-east-1'});
//     this.sqs = new AWS.SQS({apiVersion: '2012-11-05'});

//     for (const QueueUrl in CONSTANTS.QUEUES) {
//       if (CONSTANTS.QUEUES.hasOwnProperty(QueueUrl)) {
//         this.initReceiver(CONSTANTS.QUEUES[QueueUrl]);
//       }
//     }
//   }

//   private initReceiver(QueueUrl) {
//     const params = this.buildParams(QueueUrl);
//     this.sqs.receiveMessage(params, function(err, data) {
//       console.log('----------- RECEIVED 1 ----------');
//       if (err) {
//         console.log("Receive Error", err);
//       } else if (data.Messages) {
//           console.log('QUEUE');
//           console.log(data);
//           console.log('----------- RECEIVED ----------');
//           console.log(data.Messages[0]);
//         var deleteParams = {
//           QueueUrl: params.QueueUrl,
//           ReceiptHandle: data.Messages[0].ReceiptHandle
//         };
//         this.sqs.deleteMessage(deleteParams, function(err, data) {
//           if (err) {
//             console.log("Delete Error", err);
//           } else {
//             console.log("Message Deleted", data);
//           }
//         });
//       }
//     });
//   }

//   private buildParams(QueueUrl) {
//     return {
//       AttributeNames: [
//           "SentTimestamp"
//       ],
//       MaxNumberOfMessages: 1,
//       MessageAttributeNames: [
//           "All"
//       ],
//       QueueUrl,
//       VisibilityTimeout: 20,
//       WaitTimeSeconds: 0
//     }
//   }

// }
