import { AwsSESManager } from "./aws-ses-manager";
import { Service } from "typedi";
import { AwsSNSManager } from "./aws-sns-manager";
const { Consumer } = require('sqs-consumer');

@Service()
export class AWSSqsListenner {
  awsSesManager: AwsSESManager;
  awsSnsManager: AwsSNSManager;
  
  constructor() {
    this.awsSesManager = new AwsSESManager();
    this.awsSnsManager = new AwsSNSManager();
   }
  
  public init() {
    // const awsSesManager = new AwsSESManager();
    const app = Consumer.create({
      queueUrl: "https://sqs.us-east-1.amazonaws.com/039444674434/NiceQueue",
      handleMessage: async (message) => {
        console.log(message.Body);
        await this.awsSesManager.formatAndSendEmail(message.Body);
        await this.awsSnsManager.formatAndSendSMS();
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
