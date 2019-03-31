import { Service, Inject } from "typedi";
// import { AmqSender } from "../messaging/send";
import { AWSSqsSender } from "../messaging/aws-sqs-sender";
import { IMessage, IEmail, ISMS, IFacebookMessengerMessage, IWhatsAppMessage } from "src/messaging/message-interfaces";
import { BadRequestError } from "routing-controllers";

@Service()
export class MessagesService {
    @Inject() private awsSqsSender: AWSSqsSender;
    constructor() {}

    public async sendEmail(email: IEmail): Promise<void> {
        try {
            const messageForQueue: IMessage = { type: 'email', email };
            this.awsSqsSender.sendMessageToQueue(messageForQueue);
        } catch {
            throw new BadRequestError('OOpss something went wrong while sending email');
        }
    }

    public async sendSMS(sms: ISMS): Promise<void> {
        try {
            const messageForQueue: IMessage = { type: 'sms', sms };
            this.awsSqsSender.sendMessageToQueue(messageForQueue);
        } catch {
            throw new BadRequestError('OOpss something went wrong while sending sms');
        }
    }

    public async sendFacebookMessengerMessage(message: IFacebookMessengerMessage) {
        //
    }

    public async sendWhatsAppMessage(message: IWhatsAppMessage) {
        //
    }
}