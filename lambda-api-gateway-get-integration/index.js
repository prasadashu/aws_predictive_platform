// Define Lambda function
const apiTestHandler = (payload, context, callback) => {
    // Print payload to console
    console.log(`Function apiTestHandler called with payload ${JSON.stringify(payload)}`);

    // Define callback for Lambda functions
    callback(null, {
        statusCode: 201,
        body: JSON.stringify({
            somethingId: payload.pathParameters.somethingId
        }),
        headers: {
            "X-Click-Header": "abc"
        }
    });
}

module.exports = {
    apiTestHandler
}