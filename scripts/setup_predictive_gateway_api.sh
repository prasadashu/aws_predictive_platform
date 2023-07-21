#!/bin/bash

# Print script description
echo "##############################################################";
echo "#              SETTING UP PREDICTIVE GATEWAY API             #";
echo "##############################################################";

# Create a PREDICTIVE REST API
PREDICTIVE_API_ID=$(aws --endpoint-url=http://localhost:4566 apigateway create-rest-api \
                        --name $PREDICTIVE_API_NAME \
                        --query "id" \
                        --output text)

# Get parent ID
PREDICTIVE_API_PARENT_ID=$(aws --endpoint-url=http://localhost:4566 apigateway get-resources \
                               --rest-api-id "$PREDICTIVE_API_ID" \
                               --query "items[0].id" \
                               --output text)

# Create endpoint resource
PREDICTIVE_RESOURCE_ID=$(aws --endpoint-url=http://localhost:4566 apigateway create-resource \
                             --rest-api-id "$PREDICTIVE_API_ID" \
                             --parent-id "$PREDICTIVE_API_PARENT_ID" \
                             --path-part "{predict}" \
                             --query "id" \
                             --output text)

# Link POST protocol with endpoint resorurce
aws --endpoint-url=http://localhost:4566 apigateway put-method \
    --rest-api-id "$PREDICTIVE_API_ID" \
    --resource-id "$PREDICTIVE_RESOURCE_ID" \
    --http-method POST \
    --request-parameters "method.request.path.predict=true" \
    --authorization-type "NONE"

# Attach Lambda function to REST API
aws --endpoint-url=http://localhost:4566 apigateway put-integration \
    --rest-api-id "$PREDICTIVE_API_ID" \
    --resource-id "$PREDICTIVE_RESOURCE_ID" \
    --http-method POST \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/$PREDICTIVE_LAMBDA_ARN/invocations" \
    --passthrough-behavior WHEN_NO_MATCH

# Create REST API deployment
PREDICTIVE_API_DEPLOYMENT_ID=$(aws --endpoint-url=http://localhost:4566 apigateway create-deployment \
                                 --rest-api-id "$PREDICTIVE_API_ID" \
                                 --stage-name $PREDICTIVE_API_DEPLOYMENT_NAME \
                                 --query "id" \
                                 --output text)

# Print variable values
echo "PREDICTIVE_API_ID: $PREDICTIVE_API_ID"
echo "PREDICTIVE_API_PARENT_ID: $PREDICTIVE_API_PARENT_ID"
echo "PREDICTIVE_RESOURCE_ID: $PREDICTIVE_RESOURCE_ID"
echo "PREDICTIVE_API_DEPLOYMENT_ID: $PREDICTIVE_API_DEPLOYMENT_ID"

# Print sample REST API URL
echo "Prediction REST API endpoint: http://localhost:4566/restapis/$PREDICTIVE_API_ID/$PREDICTIVE_API_DEPLOYMENT_NAME/_user_request_/prediction";

# Export variables
export PREDICTIVE_API_ID
export PREDICTIVE_API_PARENT_ID
export PREDICTIVE_RESOURCE_ID
export PREDICTIVE_API_DEPLOYMENT_ID