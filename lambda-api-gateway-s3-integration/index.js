// Instantiate AWS SDK
const aws = require('aws-sdk');

// Instantiate S3 service
const s3 = new aws.S3({
    // Define API version
    apiVersion: '2006-03-01',

    // Pick endpoint URL from Localstack environment variables
    endpoint: `http://${process.env.LOCALSTACK_HOSTNAME}:4566`,
    s3ForcePathStyle: true,
});

// Instantiate AWS SQS service
const sqs = new aws.SQS({
    // Define API version
    apiVersion: '2012-11-05',
    
    // Pick endpoint URL from Localstack environment variables
    endpoint: `http://${process.env.LOCALSTACK_HOSTNAME}:4566`
});

// Define handler
exports.handler = async(payload, event, context) => {
    try{
        // Get the payload information
        const payloadQuery = payload.pathParameters.query;

        // Get User ID from event
        const data = JSON.parse(payload.body);
        const userID = data.userID;

        // Check if pre-signed S3 URL generation is required
        if(payloadQuery == "pre-signed-s3-url"){
            // Define bucket and key for data
            const bucket = 'testbucket';
            const key = 'sample_file_' + userID + '.txt';
            // Define parameter values to be sent to S3 client
            // Note: Provide the time in seconds for the pre-signed URL to expire
            const params = {
                Bucket: bucket,
                Key: key,
                Expires: 60
            };

            // Create a S3 Pre-Signed URL
            // Note: The hostname will point to the IP address of the 'Localstack' container
            const fetchedUrl = s3.getSignedUrl('putObject', params);

            // Replace container IP address with 'localhost'
            const preSignedUrl = fetchedUrl.replace(/http:\/\/[^:]*:4566/, 'http://localhost:4566');

            // Return the pre-signed S3 URL
            return{
                statusCode: 200,
                body: JSON.stringify({
                    preSignedUrl: preSignedUrl
                }),
                headers: {
                    "X-Click-Header": "abc"
                }
            };
        }
        // Check if new prediction is required
        else if(payloadQuery == "predict"){
            // Define parameters to send message to SQS
            const sqsSendMessageParams = {
                DelaySeconds: 10,
                MessageBody: JSON.stringify({
                    task: "predict",
                    userID: userID
                }),
                QueueUrl: `http://${process.env.LOCALSTACK_HOSTNAME}:4566/000000000000/RequestQueue`
            };

            try{
                // Send message to SQS
                const sendMessageData = await sqs.sendMessage(sqsSendMessageParams).promise();
                console.log("Success: ", sendMessageData);

                // Define response to be returned by Lambda function
                const success_response = {
                    statusCode: 200,
                    body: JSON.stringify(sendMessageData)
                };

                // Return the response from Lambda
                return success_response;
            }
            catch(sqsSendMessageError){
                // Print error while sending SQS message to console
                console.error("Error while sending SQS message: ", sqsSendMessageError);
            }
        }
        else {
            // Return 404 resource not found
            return{
                statusCode: 404,
                body: "404: Resource Not Found",
                headers: {
                    "X-Click-Header": "abc"
                }
            }
        }
    }
    catch(error){
        // Return internal server error while handling request
        return{
            statusCode: 500,
            body: JSON.stringify({
                message: "500: Internal Server Error",
                error: error
            }),
            headers: {
                "X-Click-Header": "abc"
            }
        }
    }
}