// Instantiate AWS SDK
const aws = require('aws-sdk');

// Instantiate the S3 service
const s3 = new aws.S3({
    // Define the API version
    apiVersion: '2006-03-01',

    // Pick endpoint URL from Localstack environment variables
    endpoint: `http://${process.env.LOCALSTACK_HOSTNAME}:4566`, // This two lines are
    s3ForcePathStyle: true,                                     // only needed for LocalStack. 
});

// Instantiate AWS SQS service
const sqs = new aws.SQS({
    // Define API version
    apiVersion: '2012-11-05',
    
    // Pick endpoint URL from Localstack environment variables
    endpoint: `http://${process.env.LOCALSTACK_HOSTNAME}:4566`
});

// Define handler
exports.handler = async(event, context) => {
    // Get Bucket and Object from S3 event
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    // Define S3 Get-Object parameters
    const s3GetObjectParams = {
        Bucket: bucket,
        Key: key,
    };

    try{
        // Receive object from S3
        const receivedObject = await s3.getObject(s3GetObjectParams).promise();
        // Convert the received object into 'UTF-8' encoding
        const objectContent = receivedObject.Body.toString('utf-8');
        // Print the 'UTF-8' encoded form of the S3 object content
        console.log('Object Content:', objectContent);

        // Define parameters to send message to SQS
        const sqsSendMessageParams = {
            DelaySeconds: 10,
            MessageBody: objectContent,
            QueueUrl: `http://${process.env.LOCALSTACK_HOSTNAME}:4566/000000000000/SomeQueueName`
        };

        try{
            // Send message to SQS
            const sendMessageData = await sqs.sendMessage(sqsSendMessageParams).promise();
            console.log("Success: ", sendMessageData);
        }
        catch(sqsSendMessageError){
            // Print error while sending SQS message to console
            console.error("Error while sending SQS message: ", sqsSendMessageError);
        }
    } 
    catch(getS3ObjectError){
        // Print error while getting object to console
        console.error("Error in receiving S3 object: ", getS3ObjectError);
        const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
        console.log(message);
        throw new Error(message);
    }
};