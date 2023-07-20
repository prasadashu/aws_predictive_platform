import os
import boto3
import json
import pickle
import io
import numpy as np
from sklearn import svm

# Instantiate S3 client
s3 = boto3.client(service_name = 's3',
                  endpoint_url = f"http://{os.getenv('LOCALSTACK_HOSTNAME')}:{os.getenv('EDGE_PORT')}")


def handler(event, context):
    """Function to fetch object from S3"""

    # Check if event contains a 'pathParameter' key
    if('pathParameters' in event):
        # Get the value of the endpoint
        endpoint = event['pathParameters']['predict']

        # Check if endpoint requires prediction on data sent
        if(endpoint == 'prediction'):
            # Get string 'body' and convert to JSON
            json_event_body = json.loads(event['body'])

            # Extract User ID and input feature array
            user_id = json_event_body['userID']
            array = json_event_body['array']

            # Convert list to numpy array
            numpy_array = np.array(array)

            # Get saved model from S3 Bucket
            bucket_object = s3.get_object(
                Bucket = "sample-bucket",
                Key = "pickled_model_" + str(user_id) + ".pickle"
            )

            # Get object body
            bucket_object_body = bucket_object['Body'].read()

            # Get model from the body
            ml_model = pickle.loads(bucket_object_body)

            # Perform prediction on an instance of dataset
            ml_prediction = ml_model.predict(numpy_array.reshape(1, len(numpy_array)))

            # Print prediction to log
            print("Prediction on " + str(array) + " is : " + str(ml_prediction))

            # Return from the function
            return {
                'statusCode': 200,
                'body': json.dumps('Prediction on ' + str(array) + ' is : ' + str(ml_prediction))
            }

    # Otherwise, check if event contains 'Records' key
    # Note: 'Records' are being received from SQS
    elif('Records' in event):
        # Loop over all records
        for record in event['Records']:
            # Load record body as JSON
            record_body = json.loads(record['body'])
            
            # Get task and User ID from SQS message body
            task = record_body["task"]
            user_id = record_body["userID"]

            # Check if task is to train a model
            if(task == "train"):
                # Get CSV object from S3
                s3_csv_data = s3.get_object(
                    Bucket = "testbucket",
                    Key = "data_" + str(user_id) + ".npy"
                )

                # Convert CSV data to dataframe
                with io.BytesIO(s3_csv_data['Body'].read()) as file:
                    s3_csv_dataframe = np.load(file)

                # Get target dataframe
                target = s3_csv_dataframe[:, len(s3_csv_dataframe)]

                # Get feature dataframe
                data = s3_csv_dataframe[:, :len(s3_csv_dataframe)]

                # Instantiate SVC classifier
                clf = svm.SVC()

                # Train SVC classifier
                clf.fit(data, target)

                # Store SVC model as a pickle file
                pickled_model = pickle.dumps(clf)

                # Save model as pickled file to S3
                s3.put_object(
                    Bucket = "sample-bucket",
                    Key = "pickled_model_" + str(user_id) + ".pickle",
                    Body = pickled_model
                )

                # Print model saved to console
                print("Model saved to S3 Bucket")

                # Return from the function
                return {
                    'statusCode': 200,
                    'body': json.dumps('Prediction complete!')
                }
            # Otherwise, return that requested resource is not available
            else:
                # Print requested resource from SQS is not available
                print("404: Requested resource from SQS is not available")

                # Return from the Lambda function with 404
                return{
                    'statusCode': 404,
                    'body': json.dumps('Unknown task: ' + str(task))
                }
    # Otherwise, return that requested resource is not available
    else:
        # Print requested resource from event is not available
        print("404: Requested resource from event not available")
        
        # Return from the function with 404
        return {
            'statusCode': 404,
            'body': json.dumps("Resource not found!")
        }