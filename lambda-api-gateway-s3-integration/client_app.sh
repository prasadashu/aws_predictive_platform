#!/bin/bash

# Get REST API ID and Deployment name through CLI
for i in "$@"; do
	case $i in
		-i=*|--restapiid=*)
			RESTAPIID="${i#*=}"
			shift
			;;
		-d=*|--deployment=*)
			DEPLOYMENT="${i#*=}"
			shift
			;;
		-*|--*)
			echo "Unknown arguments"
			exit 1
			;;
		*)
		;;
	esac
done

# Print argument values
echo "REST API ID: ${RESTAPIID}";
echo "DEPLOYMENT Name: ${DEPLOYMENT}";

# Get S3 pre-signed URL 
url=$(curl -s -L "http://localhost:4566/restapis/${RESTAPIID}/${DEPLOYMENT}/_user_request_/pre-signed-s3-url" | jq '. | .preSignedUrl' | sed -e 's/^"//' -e 's/"$//')

# Uplaod file using S3 pre-signed URL
curl --upload-file sample_file.txt "$url"
