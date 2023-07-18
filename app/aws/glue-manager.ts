import { 
    GlueClient, 
    GetCrawlersCommand, 
    GetCrawlerCommand, 
    CreateCrawlerCommand, 
    StartCrawlerCommand, 
    DeleteCrawlerCommand 
} from "@aws-sdk/client-glue";

/**
 * Class for managing AWS Glue Service
 */
export class GlueManager {
    // AWS Glue Manager client declaration
    private glueClient: GlueClient;

    /**
     * Constructor to instantiate Glue Client configuration
     * @param awsAccessKeyId AWS Access Key
     * @param awsSecretAccessKey AWS Secret Access Key
     */
    constructor(awsAccessKeyId: string, awsSecretAccessKey: string, awsGlueRegion: string){
        this.glueClient = new GlueClient({
            region: awsGlueRegion,
            credentials: {
                accessKeyId: awsAccessKeyId,
                secretAccessKey: awsSecretAccessKey
            }
        })
    };

    /**
     * Get list of crawlers
     */
    async getGlueCrawlers(numberOfJobs: Number){
        // Get the parameter values to be sent to Glue
        const listGlueCrawlersClientInput = {
            MaxResults: Number("int")
        };

        // Declaration of command to be sent to Glue server
        const listGlueCrawlersClientCommand = new GetCrawlersCommand(listGlueCrawlersClientInput);

        // Execute the Glue client command
        try{
            // Get response from the client
            const listGlueCrawlersClientResponse = await this.glueClient.send(listGlueCrawlersClientCommand);
            // Print the response to the console
            console.log(listGlueCrawlersClientResponse);
        }
        catch(error){
            // Print error while getting response
            console.error("Error while getting list of crawlers: ", error);
        }
    };

    /**
     * Get Glue crawler jobs
     * @param awsGlueCrawlerJobName Name of the crawler job
     */
    async getGlueCrawlerJobDetails(awsGlueCrawlerJobName: string){
        // Get the parameter values to be sent to Glue
        const glueClientInput = {
            Name: awsGlueCrawlerJobName
        };

        // Declaration of command to be sent to Glue server
        const glueClientCommand = new GetCrawlerCommand(glueClientInput);

        // Execute the Glue client command
        try{
            // Get response from the client
            const glueClientResponse = await this.glueClient.send(glueClientCommand);
            // Print the response to console
            console.log(glueClientResponse);
            // Print S3 Target details
            console.log("S3 Target: ", glueClientResponse.Crawler.Targets.S3Targets);
        }
        catch(error){
            // Print error while getting response
            console.log("Error while getting crawler details: ", error);
        }
    };

    /**
     * Create Glue Crawler
     * @param glueCrawlerName Name of the Glue crawler
     * @param glueCrawlerRole Name of the Glue crawler role
     * @param catalogDatabaseName Name of the Glue database
     */
    async createGlueCrawler(glueCrawlerName: string, 
        glueCrawlerRole: string, 
        catalogDatabaseName: string) {
            // Get the parameter values to be sent to Glue
            const glueCreateCrawlerClientInput = {
                Name: glueCrawlerName,
                Role: glueCrawlerRole,
                DatabaseName: catalogDatabaseName,
                Configuration: '{"Version":1.0,"CreatePartitionIndex":true}',
                Targets: {
                    S3Targets: [{
                        Path: 's3://sample-s3-glue-bucket/'
                    }]
                },
                Version: 3
            };

            // Declaration of command to be sent to Glue server
            const glueCreateCrawlerClientCommand = new CreateCrawlerCommand(glueCreateCrawlerClientInput);

            // Execute the Glue client command
            try{
                // Get response for client
                const glueCreateCrawlerClientResponse = await this.glueClient.send(glueCreateCrawlerClientCommand);
                // Print response to console
                console.log(glueCreateCrawlerClientResponse);
            }
            catch(error){
                // Print error while creating crawler
                console.error("Error while creating crawler: ", error);
            }
        };

    /**
     * Trigger Glue crawler job
     * @param glueCrawlerJobName Name of the Glue crawler job
     */
    async startGlueCrawler(glueCrawlerJobName: string) {
        // Get the parameter values to be sent to Glue
        const glueStartCrawlerClientInput = {
            Name: glueCrawlerJobName
        };

        // Declaration of command to be sent to Glue server
        const glueStartCrawlerClientCommand = new StartCrawlerCommand(glueStartCrawlerClientInput);

        // Execute the Glue client command
        try{
            // Get response for client
            const glueStartCrawlerClientResponse = await this.glueClient.send(glueStartCrawlerClientCommand);
            // Print response to console
            console.log(glueStartCrawlerClientResponse);
        }
        catch(error){
            // Print error while starting crawler
            console.error("Error while starting crawler: ", error);
        }
    };

    /**
     * Delete Glue crawler job
     */
    async deleteGlueCrawler(glueCrawlerJobName: string){
        // Get the parameter values to be sent to Glue
        const glueDeleteCrawlerClientInput = {
            Name: glueCrawlerJobName
        };

        // Declaration of command to be sent to Glue server
        const glueDeleteCrawlerClientCommand = new DeleteCrawlerCommand(glueDeleteCrawlerClientInput);

        // Execute the Glue client command
        try{
            // Get response for client
            const glueDeleteCrawlerClientResponse = await this.glueClient.send(glueDeleteCrawlerClientCommand);
            // Print response to console
            console.log(glueDeleteCrawlerClientResponse);
        }
        catch(error){
            console.error("Error while deleting crawler job: ", error);
        }
    };
}