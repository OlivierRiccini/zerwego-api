import { Service } from "typedi";

var AWS = require('aws-sdk');

@Service()
export class AwsSNSManager {
    sns: any;

    constructor() {
        AWS.config.region = 'us-east-1';
        this.sns = new AWS.SNS();
    }

    public async formatAndSendSMS(message) {
        await this.setAttributes();
        const params = this.buildParams(message);
        console.log('Sending SMS....');
        this.sns.publish(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
            } else {
                console.log('Done! email sent => ' + data.MessageId);
            } 
        });
    }

    private buildParams(message) {
        return {
            Message: message.Body,
            MessageStructure: 'string',
            PhoneNumber: message.MessageAttributes.Phone.StringValue,
        };
    }

    private async setAttributes() {
        var params = {
            attributes: {
                DefaultSenderID: 'Zerwego' ,
                DefaultSMSType: 'Transactional'
            }
        };
        await this.sns.setSMSAttributes(params).promise();
    }
}

