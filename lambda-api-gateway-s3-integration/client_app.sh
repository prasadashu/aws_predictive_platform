#!/bin/bash

# Get S3 pre-signed URL 
url=$(curl -s -L "http://localhost:4566/restapis/6s2agrfqvu/test/_user_request_/pre-signed-s3-url" | jq '. | .preSignedUrl' | sed -e 's/^"//' -e 's/"$//')

# Uplaod file using S3 pre-signed URL
curl --upload-file sample_file.txt "$url"
