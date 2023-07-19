#!/bin/bash

# Zip handler function to existing library package
zip dependency_package.zip app.py

# Upload the package to S3 bucket
aws --endpoint-url='http://localhost:4566' s3 cp ./dependency_package.zip s3://sample-bucket/dependency_package.zip

# Create the Lambda function
PREDICTIVE_LAMBDA_ARN=$(aws --endpoint-url=http://localhost:4566 lambda create-function \
                            --function-name "lambda-python-function" \
                            --code S3Bucket=sample-bucket,S3Key=dependency_package.zip \
                            --handler app.handler \
                            --runtime python3.10 \
                            --role arn:aws:iam::000000000000:role/lambda-execution-role \
                            --query "FunctionArn" \
                            --output text)

# Print variable values
echo "PREDICTIVE_LAMBDA_ARN: $PREDICTIVE_LAMBDA_ARN"

# Export the variables
export PREDICTIVE_LAMBDA_ARN