"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONSTANTS = {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    QUEUES: {
        EMAIL: 'https://sqs.us-east-1.amazonaws.com/039444674434/EMAIL_QUEUE',
        SMS: 'https://sqs.us-east-1.amazonaws.com/039444674434/SMS_QUEUE'
    }
};
//# sourceMappingURL=constants.js.map