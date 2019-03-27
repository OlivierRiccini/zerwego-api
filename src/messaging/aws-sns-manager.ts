import { Service } from "typedi";

var AWS = require('aws-sdk');

@Service()
export class AwsSNSManager {
    sns;
    constructor() {
        AWS.config.region = 'us-east-1';
        this.sns = new AWS.SNS();
    }

    public async formatAndSendSMS() {
        const params = this.buildParams();
        this.sns.publish(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
        });
    }

    private buildParams() {
        return {
            Message: 'this is a test message',
            MessageStructure: 'string',
            PhoneNumber: '+14383991332'
        };
    }
}

