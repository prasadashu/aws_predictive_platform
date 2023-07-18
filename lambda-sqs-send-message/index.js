// Instantiate AWS SDK
const aws = require('aws-sdk');

// Instantiate AWS SQS service
const sqs = new aws.SQS({
    // Define API version
    apiVersion: '2012-11-05',
    
    // Pick endpoint URL from Localstack environment variables
    endpoint: `http://${process.env.LOCALSTACK_HOSTNAME}:4566`
});

// Define handler
exports.handler = async(event, context) => {
    // Define parameters and message body to send to SQS
    const params = {
        DelaySeconds: 10,
        MessageBody: "Message content sent from Lambda",
        QueueUrl: `http://${process.env.LOCALSTACK_HOSTNAME}:4566/000000000000/SomeQueueName`
    };

    try{
        // Send message to SQS
        const data = await sqs.sendMessage(params).promise();
        console.log("Success: ", data);
      } 
      catch(error){
        // Print error while sending SQS message to console
        console.error("Error: ", error);
      }
}