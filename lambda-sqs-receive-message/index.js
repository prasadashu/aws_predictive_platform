// Instantiate AWS SDK
const aws = require('aws-sdk');

// Instantiate SQS services
const sqs = new aws.SQS({
    apiVersion: '2012-11-05',
    // Pick endpoint URL from Localstack environment variables
    endpoint: `http://${process.env.LOCALSTACK_HOSTNAME}:4566`
});

// Define SQS Queue
const queueURL = `http://${process.env.LOCALSTACK_HOSTNAME}:4566/000000000000/SomeQueueName`

// Define handler
exports.handler = async(event, context) => {
    // Define parameters to receive message from SQS
    const params = {
        MaxNumberOfMessages: 10,
        QueueUrl: queueURL,
        VisibilityTimeout: 20,
        WaitTimeSeconds: 0
    };

    try{
        // Receive message from SQS
        const data = await sqs.receiveMessage(params).promise();
        // Check if messages were received in the data
        if(data.Messages){
            // Loop over messages and print data
            for(const message of data.Messages){
                // Print data content
                console.log("Message ID: ", message.MessageId);
                console.log("Receipt Handle: ", message.ReceiptHandle);
                console.log("MD5OfBody: ", message.MD5OfBody);
                console.log("Body: ", message.Body);

                // Define parameters to delete received message from SQS
                const deleteParams = {
                    QueueUrl: queueURL,
                    ReceiptHandle: message.ReceiptHandle
                };

                try{
                    // Delete message from SQS
                    sqs.deleteMessage(deleteParams, function(error, data){
                        // Check if there was an error while deleting message
                        if(error){
                            // Print error while deleting message
                            console.error("Error while deleting message: ", error);
                        }
                        else{
                            // Print message after successful deletion 
                            console.log("Message deleted successfully!: ", data);
                        }
                    });
                }
                catch(error){
                    // Print error while executing delete message
                    console.error("Error while executing 'deleteMessage' API: ", error);
                }
            }
        }
    }
    catch(error){
        // Print error to console
        console.error("Error: ", error);
    }
};