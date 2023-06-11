import { AWSUtility } from "./util/aws-util";

// Create the AWSUtility object
const awsUtility = new AWSUtility("test_access_key_id", "test_secret_access_key_id");

// Call the listBuckets method
awsUtility.listBuckets();
// Call the listObjects method
awsUtility.listObjects(process.argv[2]);