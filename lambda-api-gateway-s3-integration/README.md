# Integrating API Gateway, Lambda and pre-signed S3 URL

- Please note the below points:

| :exclamation: | The steps below assume that "Localstack" is already running. |
|---------------|:------------------------|
| :exclamation: | The Lambda code is harcoded for S3 bucket names |


## How to run the function

### I. Create an S3 Bucket

1. Create an S3 Bucket.
```shell
aws --endpoint-url=http://localhost:4566 s3 mb s3://testbucket
```

### II. Create a Lambda function

1. Install the dependencies.
- Since the `package-lock.json` file is present, we can perform a clean install.
```shell
npm ci
```
- Otherwise, we can even install using the `package.json` file.
```shell
npm install
```

2. Zip the contents into a `function.zip` file.
```shell
zip -q -r function.zip .
```

3. Create the `Lambda` function.
- The index.<HANDLER_NAME> will change depending on the Handler function.
```shell
aws --endpoint-url=http://localhost:4566 lambda create-function --function-name "<SOME_LAMBDA_FUNCTION>" --zip-file fileb://function.zip --handler index.handler --runtime nodejs14.x --role arn:aws:iam::000000000000:role/lambda-execution-role
```

### III. Create REST API

1. Create a REST API.
```shell
aws --endpoint-url=http://localhost:4566 apigateway create-rest-api --name "<SOME_API_NAME>"
```

2. Next, get the Parent-ID for the REST API.
```shell
aws --endpoint-url=http://localhost:4566 apigateway get-resources --rest-api-id "<SOME_REST_API_ID>"
```

3. Next, we will have to define an endpoint for the REST API.
- Here, we are providing the `--path-part` value as `{query}`.
- This is because in the **NodeJS** code, we have `query` as the parameter in `payload.pathParameters.query`.
- The value `query` is the **endpoint** which we will be giving in the URL.
- The command will return the `RESOURCE_ID` of the **endpoint**.
```shell
aws --endpoint-url=http://localhost:4566 apigateway create-resource --rest-api-id "<SOME_REST_API_ID>" --parent-id "<SOME_PARENT_ID>" --path-part "{query}"
```

4. Next, we will be linking the GET protocol with the endpoint.
```shell
aws --endpoint-url=http://localhost:4566 apigateway put-method --rest-api-id "<SOME_REST_API_ID>" --resource-id "<SOME_RESOURCE_ID>" --http-method GET --request-parameters "method.request.path.query=true" --authorization-type "NONE"
```

5. Next, we will be integrating the REST API with the Lambda function.
- The --uri must follow the format:
```text
arn:aws:apigateway:<REGION>:lambda:path/2015-03-31/functions/arn:aws:lambda:<REGION>:<ACCOUNT_ID>:function:<LAMBDA_FUNCTION_NAME>/invocations
```
```shell
aws --endpoint-url=http://localhost:4566 apigateway put-integration --rest-api-id "<SOME_REST_API_ID>" --resource-id "<SOME_RESOURCE_ID>" --http-method GET --type AWS_PROXY --integration-http-method POST --uri <API_GATEWAY_LAMBDA_ARN> --passthrough-behavior WHEN_NO_MATCH
```

6. Deploy the REST API.
```shell
aws --endpoint-url=http://localhost:4566 apigateway create-deployment --rest-api-id "<SOME_REST_API_ID>" --stage-name "<SOME_DEPLOYMENT_NAME>"
```

### IV. Test the REST API

1. Run cURL command on the URL.
- A valid endpoint to get an S3 pre-signed URL is `pre-signed-s3-url`.
```shell
curl http://localhost:4566/restapis/<SOME_REST_API_ID>/<SOME_DEPLOYMENT_NAME>/_user_request_/<SOME_ENDPOINT>
```

2. Or, run the `client_app.sh` file.
- Create a sample file to upload to S3.
```shell
echo "Some random value" >> sample_file.txt
```
- Run the shell file.
```shell
bash client_app.sh
```

3. Check S3 bucket for files created.
```shell
aws --endpoint-url=http://localhost:4566 s3 ls s3://testbucket
```