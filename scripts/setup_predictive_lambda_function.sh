#!/bin/bash

# Print script description
echo "##############################################################";
echo "#            SETTING UP PREDICTIVE LAMBDA FUNCTION           #";
echo "##############################################################";

# Create directory to store python packages
mkdir ./lambda/lambda-python-get-s3-object/packages

# Install modules into packages directory
pip install -r ./lambda/lambda-python-get-s3-object/requirements.txt \
    --target ./lambda/lambda-python-get-s3-object/packages

# Zip modules into a dependency package
cd ./lambda/lambda-python-get-s3-object/packages && rm -rf ./__pycache__ && zip -q -r ../dependency_package.zip . && cd ..

# Zip handler function to existing library package
zip dependency_package.zip app.py && cd ../..

# Upload the package to S3 bucket
aws --endpoint-url='http://localhost:4566' s3 cp ./lambda/lambda-python-get-s3-object/dependency_package.zip s3://sample-bucket/dependency_package.zip

# Create the Lambda function
PREDICTIVE_LAMBDA_ARN=$(aws --endpoint-url=http://localhost:4566 lambda create-function \
                            --function-name $PREDICTIVE_LAMBDA_FUNCTION \
                            --code S3Bucket=sample-bucket,S3Key=dependency_package.zip \
                            --handler app.handler \
                            --runtime python3.8 \
                            --role arn:aws:iam::000000000000:role/lambda-execution-role \
                            --query "FunctionArn" \
                            --output text)

# Print variable values
echo "PREDICTIVE_LAMBDA_ARN: $PREDICTIVE_LAMBDA_ARN"

# Export the variables
export PREDICTIVE_LAMBDA_ARN