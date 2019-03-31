export type MessageTypes = 
| 'email'
| 'sms'
| 'facebook_messenger'
| 'whatsApp';


export interface IMessage {
    type: MessageTypes,
    email?: IEmail,
    sms?: ISMS,
    facebookMessenger?: IFacebookMessengerMessage,
    whatsApp?: IWhatsAppMessage
}

export interface IEmail {
    from: string,
    to: string,
    subject?: string,
    content: string
}

export interface ISMS {
    phone: string,
    content: string
}

export interface IFacebookMessengerMessage {
    facebookId: string,
    content: string
}


// NOT SURE YET
export interface IWhatsAppMessage {
    facebookId: string,
    content: string
}