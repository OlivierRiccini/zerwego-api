
// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1'});

// Create sendEmail params 
var params = {
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
       Data: "<h1>Inho le boss</h1>"
      },
      Text: {
       Charset: "UTF-8",
       Data: "Inho le boss"
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

// Create the promise and SES service object
var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

// Handle promise's fulfilled/rejected states
sendPromise.then(
  function(data) {
    console.log(data.MessageId);
  }).catch(
    function(err) {
    console.error(err, err.stack);
  });