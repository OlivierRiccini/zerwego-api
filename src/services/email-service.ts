import { Service, Inject } from "typedi";
import { AmqSender } from "../messaging/send";

@Service()
export class EmailService {
    @Inject() private amqSender: AmqSender;
    constructor() {}

    public sendEmail(message) {
        this.amqSender.sendToMessageToQueue(message);
    }
}