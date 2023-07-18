// Define handler
exports.handler = async(event) => {
    // Parsing the incoming 'event' data and returning response
    try{
        // Print 'event' body to console
        console.log(event.body);
        
        // Parse the incoming JSON data from the event
        const data = JSON.parse(event.body);

        // Access the values of the keys
        const key1Value = data.key1;
        const key2Value = data.key2;

        // Define response to be returned by Lambda function
        const success_response = {
            statusCode: 200,
            body: JSON.stringify(data)
        };

        // Return the response from Lambda
        return success_response;
    }
    catch(error){
        // Print error to console
        console.error("Error: ", error);

        // Define response to be returned when errored
        const fail_response = {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal Server Error'
            })
        };
    }
};