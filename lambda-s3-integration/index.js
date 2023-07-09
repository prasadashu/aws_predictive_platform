// Instantiate the AWS SDK
const aws = require('aws-sdk');

// Instantiate the S3 service
const s3 = new aws.S3({
    // Define the API version
    apiVersion: '2006-03-01',

    // Pick endpoint URL from Localstack environment variables
    endpoint: `http://${process.env.LOCALSTACK_HOSTNAME}:4566`, // This two lines are
    s3ForcePathStyle: true,                                     // only needed for LocalStack. 
});

// Define handler
exports.handler = async (event, context) => {
    // Get the bucket and object from the event
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    };

    try{
        // Receive object from S3
        const receivedObject = await s3.getObject(params).promise();
        // Convert the received object into 'UTF-8' encoding
        const objectContent = receivedObject.Body.toString('utf-8');
        // Print the 'UTF-8' encoded form of the S3 object content
        console.log('Object Content:', objectContent);
        // Return object content
        return objectContent;
    } 
    catch(error){
        // Print error while getting object to console
        console.error("Error in receiving S3 object: ", error);
        const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
        console.log(message);
        throw new Error(message);
    }
};