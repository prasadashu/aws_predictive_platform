#!/bin/bash

# Print script description
echo "##############################################################";
echo "#             SETTING UP PLATFORM LAMBDA FUNCTION            #";
echo "##############################################################";

# Install npm modules
npm --prefix ./lambda-api-gateway-s3-integration/ install

# Zip modules into a package
cd ./lambda-api-gateway-s3-integration && zip -q -r function.zip node_modules/ package.json package-lock.json index.js && cd ..
	
# Create the Lambda function
PLATFORM_LAMBDA_ARN=$(aws --endpoint-url=http://localhost:4566 lambda create-function \
    --function-name $PLATFORM_LAMBDA_FUNCTION \
    --zip-file fileb://./lambda-api-gateway-s3-integration/function.zip \
    --handler index.handler \
    --runtime nodejs14.x \
    --role arn:aws:iam::000000000000:role/lambda-execution-role \
    --query "FunctionArn" \
    --output text)

# Print variable values
echo "PLATFORM_LAMBDA_ARN: $PLATFORM_LAMBDA_ARN"

# Export the Lambda function ARN
export PLATFORM_LAMBDA_ARN