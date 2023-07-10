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
exports.handler = async(event, context) => {
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
   const preSignedUrl = s3.getSignedUrl('putObject', params);

   // Print pre-signed URL to console
   console.log(preSignedUrl);

   // Return the pre-signed S3 URL
   return{
    statusCode: 200,
    body: preSignedUrl
   }
};