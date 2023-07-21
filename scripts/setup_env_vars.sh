#!/bin/bash

# Defining Lambda function names
PLATFORM_LAMBDA_FUNCTION="lambda-platform-gateway-function"
PREDICTIVE_LAMBDA_FUNCTION="lambda-python-function"

# Defining REST API names
PLATFORM_API_NAME="platform-gateway"
PREDICTIVE_API_NAME="predictive-gateway"

# Defining REST API deployment names
PLATFORM_API_DEPLOYMENT_NAME="test"
PREDICTIVE_API_DEPLOYMENT_NAME="test"

# Export variables
export PLATFORM_LAMBDA_FUNCTION
export PREDICTIVE_LAMBDA_FUNCTION
export PLATFORM_API_NAME
export PREDICTIVE_API_NAME
export PLATFORM_API_DEPLOYMENT_NAME
export PREDICTIVE_API_DEPLOYMENT_NAME