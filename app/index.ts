import { AWSUtility } from "./util/aws-util";

// Create the AWSUtility object
const awsUtility = new AWSUtility("test_access_key_id", "test_secret_access_key_id");

// Check command line arguments to invoke S3 AWS utility functions
if(process.argv[2] === "--listBuckets"){
    // Call the listBuckets method
    awsUtility.listBuckets();
}
else if(process.argv[2] === "--listObjects"){
    // Call the listObjects method
    awsUtility.listObjects(process.argv[3]);
}
else if(process.argv[2] === "--getObject"){
    // Call the getObject method
    awsUtility.getObject(process.argv[3], process.argv[4]);
}
else if(process.argv[2] === "--putObject"){
    // Call the putObject method
    awsUtility.putObject(process.argv[3], process.argv[4], process.argv[5]);
}