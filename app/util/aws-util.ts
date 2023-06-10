import * as AWS from "aws-sdk";

/**
 * AWS Utility class to unzip and read CSV files
 */
export class AWSUtility {
    /**
     * Define constructor to authenticate to AWS
     * @param awsAccessKeyId AWS Access Key
     * @param awsSecretAccessKey AWS Secret Key
     */
    constructor(awsAccessKeyID: string, awsSecretAccessKey: string) {
        // Authenticate to AWS
        AWS.config.update(
            {
                accessKeyId: awsAccessKeyID,
                secretAccessKey: awsSecretAccessKey
            }
        )
    };

    /**
     * Define function to get objects from S3
     * @param bucketName S3 Bucket Name
     * @param bucketKey S3 Bucket Key
     * @param endpoint AWS S3 Endpoint
     */
    async getS3Object(bucketName: string, bucketKey: string, endpoint: string): Promise<void> {
        // Instantiate the S3 object
        let s3 = new AWS.S3({
            endpoint: endpoint
        });
        // Get object from S3 bucket
        s3.getObject(
            // Define Bucket and Key to fetch data from
            { Bucket: bucketName, Key: bucketKey }, (error: any, data: any) => {
                // Check if we have any errors while pulling data
                if(error) {
                    // Print error on console
                    console.log("Error while pulling data from S3: ", error);
                }
                else {
                    // Print the data pulled from S3
                    console.log("Data pulled from S3: ", data.Body.toString());
                }
            }
        )
    }
}