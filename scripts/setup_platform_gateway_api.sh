#!/bin/bash

# Print script description
echo "##############################################################";
echo "#               SETTING UP PLATFORM GATEWAY API              #";
echo "##############################################################";

# Create a PLATFORM REST API
PLATFORM_API_ID=$(aws --endpoint-url=http://localhost:4566 apigateway create-rest-api \
                      --name $PLATFORM_API_NAME \
                      --query "id" \
                      --output text)                         
                         
# Get parent ID
PLATFORM_API_PARENT_ID=$(aws --endpoint-url=http://localhost:4566 apigateway get-resources \
                             --rest-api-id "$PLATFORM_API_ID" \
                             --query "items[0].id" \
                             --output text)

# Create endpoint resource
PLATFORM_RESOURCE_ID=$(aws --endpoint-url=http://localhost:4566 apigateway create-resource \
                           --rest-api-id "$PLATFORM_API_ID" \
                           --parent-id "$PLATFORM_API_PARENT_ID" \
                           --path-part "{query}" \
                           --query "id" \
                           --output text)

# Link POST protocol with endpoint resorurce
aws --endpoint-url=http://localhost:4566 apigateway put-method \
    --rest-api-id "$PLATFORM_API_ID" \
    --resource-id "$PLATFORM_RESOURCE_ID" \
    --http-method POST \
    --request-parameters "method.request.path.query=true" \
    --authorization-type "NONE"

# Attach Lambda function to REST API
aws --endpoint-url=http://localhost:4566 apigateway put-integration \
    --rest-api-id "$PLATFORM_API_ID" \
    --resource-id "$PLATFORM_RESOURCE_ID" \
    --http-method POST \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/$PLATFORM_LAMBDA_ARN/invocations" \
    --passthrough-behavior WHEN_NO_MATCH

# Create REST API deployment
PLATFORM_API_DEPLOYMENT_ID=$(aws --endpoint-url=http://localhost:4566 apigateway create-deployment \
                                 --rest-api-id "$PLATFORM_API_ID" \
                                 --stage-name $PLATFORM_API_DEPLOYMENT_NAME \
                                 --query "id" \
                                 --output text)

# Print variable values
echo "PLATFORM_API_ID: $PLATFORM_API_ID"
echo "PLATFORM_API_PARENT_ID: $PLATFORM_API_PARENT_ID"
echo "PLATFORM_RESOURCE_ID: $PLATFORM_RESOURCE_ID"
echo "PLATFORM_API_DEPLOYMENT_ID: $PLATFORM_API_DEPLOYMENT_ID"

# Print sample REST API URL
echo "Pre-Signed S3 REST API endpoint: http://localhost:4566/restapis/$PLATFORM_API_ID/$PLATFORM_API_DEPLOYMENT_NAME/_user_request_/pre-signed-s3-url";
echo "Training REST API endpoint: http://localhost:4566/restapis/$PLATFORM_API_ID/$PLATFORM_API_DEPLOYMENT_NAME/_user_request_/train";

# Export variables
export PLATFORM_API_ID
export PLATFORM_API_PARENT_ID
export PLATFORM_RESOURCE_ID
export PLATFORM_API_DEPLOYMENT_ID