#!/bin/bash

# Check if parameters were provided
if [ $# -eq 0 ]; then
	>&2 echo "Please specify the REST API ID and Deployment ID"
	>&2 echo "Example: bash client_app.sh --deployment=<SOME_DEPLOYMENT_ID> --userid=<SOME_USER_ID> --file=<SOME_LOCAL_FILE>"
	exit 1
fi

# Get REST API ID and Deployment name through CLI
for i in "$@"; do
	case $i in
		-d=*|--deployment=*)
			DEPLOYMENT="${i#*=}"
			shift
			;;
		-u=*|--userid=*)
			USERID="${i#*=}"
			shift
			;;
		-f=*|--file=*)
			FILE="${i#*=}"
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
echo "REST API ID: $PLATFORM_API_ID";
echo "DEPLOYMENT Name: ${DEPLOYMENT}";
echo "USER ID:  ${USERID}";

# Get S3 pre-signed URL 
url=$(curl -s -d "{\"userID\":\"${USERID}\"}" -H "Content-Type: application/json" -X POST "http://localhost:4566/restapis/$PLATFORM_API_ID/${DEPLOYMENT}/_user_request_/pre-signed-s3-url" | jq '. | .preSignedUrl' | sed -e 's/^"//' -e 's/"$//')

# Uplaod file using S3 pre-signed URL
curl -s --upload-file "${FILE}" "$url"
