# Explore Localstack
A TypeScript repository to explore localstack

## Steps to run source code

### Checking dependencies
- Run the below shell script to validate dependencies.
```shell
shell dependency.sh
```

- Run `Docker Compose` in detached state to spin up `localstack`.
```shell
docker-compose up -d
```

- Build JavaScripts from TypeScript code
```shell
tsc app/
```

- Run `index.js`
```shell
node app/index.js
```

## Refrences
- Further documentation to expand functionality using AWS SDK can be found in the below link: [AWS SDK Documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/index.html)