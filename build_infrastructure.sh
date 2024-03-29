#!/bin/bash

# Setup environment variables
source ./scripts/setup_env_vars.sh

# Setup dependencies
bash ./scripts/setup_dependencies.sh

# Configure AWS CLI
bash ./scripts/aws_configure.sh

# Spin up localstack docker container
docker-compose up -d

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

# Setup event mapping between predictive Lambda and SQS
bash ./scripts/setup_event_mappings.sh

# Setup predictive API
source ./scripts/setup_predictive_gateway_api.sh