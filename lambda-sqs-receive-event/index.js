// Instantiate AWS SDK
const aws = require('aws-sdk');

// Instantiate SQS service
const sqs = new aws.SQS({
    apiVersion: '2012-11-05',
    // Pick endpoint URL from Localstack environment variables
    endpoint: `http://${process.env.LOCALSTACK_HOSTNAME}:4566`
})

// Define handler
exports.handler = async(event, context) => {
    // Print SQS message attributes and body
    console.log("Message ID: ", event.Records[0].messageId);
    console.log("Receipt Handle: ", event.Records[0].receiptHandle);
    console.log("Body: ", event.Records[0].body);
}