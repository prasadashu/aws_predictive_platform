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

// Define handler
exports.handler = async(payload, event, context) => {
    try{
        // Get the payload information
        const payloadQuery = payload.pathParameters.query;

        // Check if payload query requires S3 pre-signed URL generation
        if(payloadQuery == "pre-signed-s3-url"){
            // Define bucket and key for data
            const bucket = 'testbucket';
            const key = 'sample_file.txt';
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