const { ListObjectsV2Command, ListBucketsCommand, GetObjectCommand, PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const fs = require("fs");

// Define S3 client configuration
const client = new S3Client({
    endpoint: "http://0.0.0.0:4566"
});

// Define async function to list S3 buckets
const listBuckets = async() => {
    const input = {};
    const command = new ListBucketsCommand(input);
    try{
        const response = await client.send(command);
        console.log(response);
    }
    catch(error){
        console.error(error);
    }
};

// Define async function to list objects in S3 bucket
const listObjects = async(bucketName, maxKeys = 1) => {
    const input = {
        Bucket: bucketName,
        MaxKeys: maxKeys
    };
    const command = new ListObjectsV2Command(input);
    try{
        const response = await client.send(command);
        console.log(response);
    }
    catch(error){
        console.log(error);
    }
};

// Define function to get objects from S3 bucket
const getObject = async(bucketName, keyName) => {
    const input = {
        Bucket: bucketName,
        Key: keyName
    };
    const command = new GetObjectCommand(input);
    try{
        // Get response from S3 Bucket
        const response = await client.send(command);
        
        // Create a file stream to download S3 object
        const fileStream = fs.createWriteStream("../archive/downloaded_file.csv.gz");
        // Dump response data to file stream
        response.Body.pipe(fileStream);
        // Print file downloaded successfully
        fileStream.on("finish", () => {
            console.log("Object downloaded successfully");
        });
    }
    catch(error){
        console.error("Error while getting object: ", error);
    }
}

// Define function to put file to S3 bucket
const putObject = async (bucketName, keyName, filePath) => {
    // Create a readable stream from the local file
    const fileStream = fs.createReadStream(filePath);
  
    // Define input parameters
    const input = {
      Bucket: bucketName,
      Key: keyName,
      Body: fileStream,
    };
  
    // Define putObject command to send to S3
    const command = new PutObjectCommand(input);
  
    // Execute the command
    try{
      // Get response of command sent
      const response = await client.send(command);
      // Print response received from S3
      console.log(response);
    } 
    catch(error){
      // Handle error while putting objects to S3
      console.error("Error while putting object: ", error);
    }
};

// Call functions based on command line arguments
if(process.argv[2] === "--listBuckets"){
    listBuckets();
}
else if(process.argv[2] === "--listObjects"){
    listObjects(process.argv[3]);
}
else if(process.argv[2] == "--getObject"){
    getObject(process.argv[3], process.argv[4]);
}
else if(process.argv[2] === "--putObject"){
    putObject(process.argv[3], process.argv[4], process.argv[5]);
}