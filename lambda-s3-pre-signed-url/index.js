// Instantiate AWS SDK
const aws = require('aws-sdk');

// Instantiate S3 service
const s3 = new aws.S3({
    // Define API version
    apiVersion: '2006-03-01',

    // Pick endpoint URL from Localstack environment variables
    endpoint: `http://${process.env.LOCALSTACK_HOSTNAME}:4566`, // This two lines are
    s3ForcePathStyle: true,                                     // only needed for LocalStack. 
});

// Define handler
exports.handler = async(event, context) => {
   // Define bucket and key for data
   const bucket = 'PredictionInputBucket';
   const key = 'PredictionInputKey';
   const params = {
       Bucket: bucket,
       Key: key,
       Expires: 3600
   };

   // Get Signed-URL for S3 Bucket
   const signed_url = s3.getSignedUrl('putObject', params);

   // Return Signed-URL
   return{
    statusCode: 200,
    body: signed_url
   };
};