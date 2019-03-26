import { AwsSESManager } from "./aws-ses-manager";
import { Service } from "typedi";

const { Consumer } = require('sqs-consumer');

@Service()
export class AWSSqsListenner {
  constructor() {}
  init() {
    const awsSesManager = new AwsSESManager();
    const app = Consumer.create({
      queueUrl: "https://sqs.us-east-1.amazonaws.com/039444674434/NiceQueue",
      handleMessage: async (message) => {
          console.log(message.Body);
        // do some work with `message`
      }
    });
     
    app.on('error', (err) => {
      console.error(err.message);
    });
     
    app.on('processing_error', (err) => {
      console.error(err.message);
    });
     
    app.start();
  }
}