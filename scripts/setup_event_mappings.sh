#!/bin/bash

# Create event source mapping between SQS queue and Predictive Lambda function
aws --endpoint-url=http://localhost:4566 lambda create-event-source-mapping \
    --function-name "lambda-python-function" \
    --batch-size 5 \
    --maximum-batching-window-in-seconds 60 \
    --event-source-arn arn:aws:sqs:us-east-1:000000000000:RequestQueue