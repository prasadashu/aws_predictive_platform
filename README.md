# Explore Localstack
A TypeScript repository to explore localstack

## Steps to run source code

### Clone this repository
- Clone the repsoitory
```shell
git clone -b typescript https://github.com/prasadashu/explore_localstack.git
```

- Change directory to the cloned directory
```shell
cd explore_localstack
```

### Checking dependencies
- Run the below shell script to validate dependencies.
```shell
bash dependency.sh
```

- Run `Docker Compose` in detached state to spin up `localstack`.
```shell
docker-compose up -d
```

- Build JavaScripts from TypeScript code
```shell
tsc app/index.ts
```

- Run `index.js`
```shell
node app/index.js
```

## Refrences
- Further documentation to expand functionality using AWS SDK can be found in the below link: [AWS SDK Documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/index.html)