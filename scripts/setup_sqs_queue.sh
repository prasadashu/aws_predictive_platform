#!/bin/bash

# Create an SQS queue
SQS_QUEUE_URL=$(aws --endpoint-url=http://localhost:4566 sqs create-queue \
                    --queue-name RequestQueue \
                    --query "QueueUrl" \
                    --output text)

# Print variable names
echo "SQS_QUEUE_URL: $SQS_QUEUE_URL"

# Export variables
export SQS_QUEUE_URL