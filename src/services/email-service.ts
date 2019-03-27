import { Service, Inject } from "typedi";
// import { AmqSender } from "../messaging/send";
import { AWSSqsSender } from "../messaging/aws-sqs-sender";

@Service()
export class EmailService {
    @Inject() private awsSqsSender: AWSSqsSender;
    constructor() {}

    public sendEmail(message) {
        this.awsSqsSender.sendMessageToQueue(message);
    }
}