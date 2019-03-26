// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({ region: 'us-east-1' });
// Create an SQS service object
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
// var queueParams = {
//     QueueName: 'NiceQueue2'
//   };
//   sqs.createQueue(queueParams, function(err, data) {
//     if (err) { console.log(err, err.stack) } // an error occurred
//     else  { console.log(data) };           // successful response
// });
// sqs.listQueues(function(err, data) {
//     if(err) {
//         console.log(err);
//     } 
//     else {
//         console.log(data);
//     } 
// });
// var queueParams = {
//     QueueName: 'Nice Queue'
//   };
//   sqs.createQueue(queueParams, function(err, data) {
//     if (err) { console.log(err, err.stack) } // an error occurred
//     else  { console.log(data) };           // successful response
// });
var queueURL = "https://sqs.us-east-1.amazonaws.com/039444674434/NiceQueue";
var parameters = {
    AttributeNames: [
        "SentTimestamp"
    ],
    MaxNumberOfMessages: 1,
    MessageAttributeNames: [
        "All"
    ],
    QueueUrl: queueURL,
    VisibilityTimeout: 20,
    WaitTimeSeconds: 0
};
sqs.receiveMessage(parameters, function (err, data) {
    if (err) {
        console.log("Receive Error", err);
    }
    else if (data.Messages) {
        console.log('----------- RECEIVED ----------');
        console.log(data.Messages[0]);
        var deleteParams = {
            QueueUrl: queueURL,
            ReceiptHandle: data.Messages[0].ReceiptHandle
        };
        sqs.deleteMessage(deleteParams, function (err, data) {
            if (err) {
                console.log("Delete Error", err);
            }
            else {
                console.log("Message Deleted", data);
            }
        });
    }
});
//# sourceMappingURL=aws-sqs-receiver.js.map