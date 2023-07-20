#!/bin/bash

# Print script description
echo "##############################################################";
echo "#                   SETTING UP S3 BUCKETS                    #";
echo "##############################################################";

# Create S3 Bucket to store user uploaded .npy files
aws --endpoint-url=http://localhost:4566 s3 mb s3://testbucket

# Create S3 Bucket to store pickled models
aws --endpoint-url='http://localhost:4566' s3 mb s3://sample-bucket