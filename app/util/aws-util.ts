import { S3Client, ListBucketsCommand, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import * as fs from "fs";
import { Readable } from "stream";

/**
 * AWS Utility class to query S3
 */
export class AWSUtility{
    // Declare client config variable
    private client: S3Client;

    // Define the constructor
    constructor(awsAccessKeyId: string, awsSecretAccessKey: string){
        // Define S3 client configuration
        this.client = new S3Client({
            endpoint: "http://0.0.0.0:4566",
            region: "us-east-1",
            credentials: {
                accessKeyId: awsAccessKeyId,
                secretAccessKey: awsSecretAccessKey
            }
        });
    }

    // Define async function to list S3 buckets
    async listBuckets(): Promise<void> {
        // Declare input for command to be sent to S3 Server
        const input = {};

        // Declare command to be sent to S3 Server
        const command = new ListBucketsCommand(input);
        
        // Execute the command
        try {
            // Get response from S3 Server
            const response = await this.client.send(command);
            // Print the response received
            console.log(response);
        } 
        catch (error) {
            // Print error while getting response
            console.error("Error: ", error);
        }
    };

    // Define async function to list S3 bucket objects
    async listObjects(s3BucketName: string): Promise<void> {
        // Declare input for command to be sent to S3 Server
        const input = {
            Bucket: s3BucketName
        };

        // Declare command to be sent to S3 Server
        const command = new ListObjectsV2Command(input);

        // Execute the command
        try{
            // Get response from S3 Server
            const response = await this.client.send(command);
            // Print the response received
            console.log(response);
        }
        catch(error){
            // Print the error while getting response
            console.error("Error: ", error);
        }
    };

    // Define async function to download S3 Objects
    async getObject(s3BucketName: string, s3ObjectName: string): Promise<void> {
        // Declare input for command to be sent to S3 Server
        const input = {
            Bucket: s3BucketName,
            Key: s3ObjectName
        };

        // Declare command to be sent to S3 Server
        const command = new GetObjectCommand(input);

        // Execute the command
        try{
            // Get response from S3 Server
            const response = await this.client.send(command);
            
            // Create write stream to download S3 object
            const fileStream = fs.createWriteStream("../downloaded_file.txt");
            // Dump response data to file stream
            
             // Dump response data to file stream
            if (response.Body instanceof Readable) {
                response.Body.pipe(fileStream);
            } else {
                throw new Error("Response body is not a readable stream.");
            }

            // Print to console once file is downloaded
            fileStream.on("finish", () => {
                console.log("Object downloaded successfully!");
            });
        }
        catch(error){
            console.error("Error: ", error);
        }
    }
}