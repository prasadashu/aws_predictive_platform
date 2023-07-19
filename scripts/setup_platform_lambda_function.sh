#!/bin/bash

# Install npm modules
npm --prefix ../lambda-api-gateway-s3-integration/ install

# Zip modules into a package
zip -q -r ./lambda-api-gateway-s3-integration/function.zip \
    ./lambda-api-gateway-s3-integration/package.json \
    ./lambda-api-gateway-s3-integration/package-lock.json \
    ./lambda-api-gateway-s3-integration/index.js
	
# Create the Lambda function
PLATFORM_LAMBDA_ARN=$(aws --endpoint-url=http://localhost:4566 lambda create-function \
    --function-name "lambda-platform-gateway-function" \
    --zip-file fileb://../lambda-api-gateway-s3-integration/function.zip \
    --handler index.handler \
    --runtime nodejs14.x \
    --role arn:aws:iam::000000000000:role/lambda-execution-role \
    --query "FunctionArn" \
    --output text)

# Print variable values
echo "PLATFORM_LAMBDA_ARN: $PLATFORM_LAMBDA_ARN"

# Export the Lambda function ARN
export PLATFORM_LAMBDA_ARN