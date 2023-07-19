#!/bin/bash

# Setup dependencies
bash ./scripts/setup_dependencies.sh

# Configure AWS CLI
bash ./scripts/aws_configure.sh

# Setup S3 Buckets
bash ./scripts/setup_s3_buckets.sh

# Setup SQS Queue
source ./scripts/setup_sqs_queue.sh

# Setup platform Lambda function
source ./scripts/setup_platform_lambda_function.sh

# Setup platform API
source ./scripts/setup_platform_gateway_api.sh

# Setup predictive Lambda function
source ./scripts/setup_predictive_lambda_function.sh

# Setup predictive API
source ./scripts/setup_predictive_gateway_api.sh