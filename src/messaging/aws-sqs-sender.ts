import { Service } from "typedi";

// Load the SDK for JavaScript
var AWS = require('aws-sdk');

@Service()
export class AWSSqsSender {
  sqs: any;

  constructor() {
    AWS.config.update({region: 'us-east-1'});
    this.sqs = new AWS.SQS({apiVersion: '2012-11-05'});
  }

  public sendMessageToQueue(message) {
    const params = this.buildParams(message);
    this.sqs.sendMessage(params, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data.MessageId);
      }
    });
  }
  
  private buildParams(message) {
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
  
}
