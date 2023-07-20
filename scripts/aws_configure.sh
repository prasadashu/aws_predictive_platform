#!/bin/bash

# Print script description
echo "##############################################################";
echo "#                    SETTING UP AWS CLI                      #";
echo "##############################################################";

echo "Configuring AWS CLI..."
aws configure set profile.default.aws_access_key_id ml_platofrm_id_key
aws configure set profile.default.aws_secret_access_key ml_platform_secret_key
aws configure set profile.default.region us-east-1
echo "AWS CLI configured"