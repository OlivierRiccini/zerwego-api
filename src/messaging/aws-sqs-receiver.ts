import { Service } from "typedi";

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region

var queueURL = "https://sqs.us-east-1.amazonaws.com/039444674434/NiceQueue";

@Service()
export class AWSSqsReceiver {
  sqs: any;

  constructor() {
    this.init();
  }
  private init() {
    AWS.config.update({region: 'us-east-1'});
    this.sqs = new AWS.SQS({apiVersion: '2012-11-05'});

    const params = this.buildParams();
    this.initReceiver(params);
  }

  private initReceiver(parameters) {
    this.sqs.receiveMessage(parameters, function(err, data) {
      if (err) {
        console.log("Receive Error", err);
      } else if (data.Messages) {
          console.log('----------- RECEIVED ----------');
          console.log(data.Messages[0]);
        var deleteParams = {
          QueueUrl: queueURL,
          ReceiptHandle: data.Messages[0].ReceiptHandle
        };
        this.sqs.deleteMessage(deleteParams, function(err, data) {
          if (err) {
            console.log("Delete Error", err);
          } else {
            console.log("Message Deleted", data);
          }
        });
      }
    });
  }

  private buildParams() {
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
    }
  }

}
