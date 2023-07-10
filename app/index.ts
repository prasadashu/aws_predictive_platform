import { S3Manager } from "./aws/s3-manager";
import { GlueManager } from "./aws/glue-manager";
import * as dotenv from "dotenv";

// Instantiate the 'dotenv' file
dotenv.config();

// Create Glue Manager utility object
const glueManager = new GlueManager(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY, process.env.AWS_REGION);

// Create crawler
//glueManager.createGlueCrawler("sample-sdk-crawler", "AWS-Sample-S3-Glue-Role", "sample-glue-database")
// Get list of crawlers
//glueManager.getGlueCrawlers(1);
// Get crawler details
//glueManager.getGlueCrawlerJobDetails("sample-sdk-crawler");
// Start crawler
glueManager.startGlueCrawler("sample-sdk-crawler")
// Delete crawler
//glueManager.deleteGlueCrawler("sample-sdk-crawler");