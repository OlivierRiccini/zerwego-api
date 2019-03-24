import { Service } from "typedi";
import { IEmailObj } from "src/models/email-model";

var AWS = require('aws-sdk');

@Service()
export class AwsSESManager {
  sendPromise;
  
  constructor() {
    const apiVersion: string = '2010-12-01';
    const region: string = 'us-east-1';
    this.init(apiVersion, region);
  }

  public async formatAndSenEmail(message) {
    const params = await this.createSendEmailParams(message);
    this.sendPromise.sendEmail(params).promise()
      .then(
        function(data) {
          console.log(data.MessageId);
        }).catch(
          function(err) {
          console.error(err, err.stack);
      });
  }

  private init(apiVersion: string, region: string) {
    AWS.config.update({region});
    this.sendPromise = new AWS.SES({apiVersion});
  }

  private async createSendEmailParams(msg): Promise<IEmailObj> {
    // Create sendEmail params 
    return {
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
          Data: `<h1>${msg.content.toString()}</h1>`
          },
          Text: {
          Charset: "UTF-8",
          Data: msg.content.toString()
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
  }

}
