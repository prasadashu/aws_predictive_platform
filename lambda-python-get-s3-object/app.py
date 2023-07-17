import os
import boto3
import json
import pickle
import io
import numpy as np
from sklearn import datasets
from sklearn import svm

# Instantiate S3 client
s3 = boto3.client(service_name = 's3',
                  endpoint_url = f"http://{os.getenv('LOCALSTACK_HOSTNAME')}:{os.getenv('EDGE_PORT')}")


def handler(event, context):
    """Function to fetch object from S3"""

    # Loop over all records
    for record in event['Records']:
        # Load record body as JSON
        record_body = json.loads(record['body'])
        
        # Get task and User ID
        task = record_body["task"]
        user_id = record_body["userID"]

        # Check if task is to train a model
        if(task == "predict"):
            # Get CSV object from S3
            s3_csv_data = s3.get_object(
                Bucket = "testbucket",
                Key = "data_" + str(user_id) + ".npy"
            )

            # Convert CSV data to dataframe
            with io.BytesIO(s3_csv_data['Body'].read()) as file:
                s3_csv_dataframe = np.load(file)

            # Get target dataframe
            target = s3_csv_dataframe[:, 4]

            # Get feature dataframe
            data = s3_csv_dataframe[:, :4]

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

            # Perform prediction
            predicted_value = clf.predict(data[0:1])[0]

            # Print predicted value
            print('Prediction on ' + str(data[0:1]) + ' is : ' + str(predicted_value))

            # Return from the function
            return {
                'statusCode': 200,
                'body': json.dumps('Prediction on ' + str(data[0:1]) + ' is : ' + str(predicted_value))
            }
            
        # Otherwise, check if task is to predict using model
        elif(task == "train"):
            iris = datasets.load_iris()

            X, y = iris.data, iris.target
            
            # Instantiate SVC model
            clf = svm.SVC()

            # Train SVC on iris dataset
            clf.fit(X, y)

            # Store SVC model as a pickle file
            pickled_model = pickle.dumps(clf)

            # Put pickled model to S3 bucket
            s3.put_object(
                Bucket = "sample-bucket",
                Key = "pickled_model_" + str(user_id) + ".pickle",
                Body = pickled_model
            )
            
            # Get object from S3 Bucket
            bucket_object = s3.get_object(
                Bucket = "sample-bucket",
                Key = "pickled_model_" + str(user_id) + ".pickle"
            )

            # Get object body
            bucket_object_body = bucket_object['Body'].read()

            # Get model from the body
            ml_model = pickle.loads(bucket_object_body)

            # Perform prediction on an instance of dataset
            ml_prediction = ml_model.predict(X[0:1])

            # Print prediction to log
            print("Prediction on " + str(X[0:1]) + " is : " + str(ml_prediction))

            # Return from the function
            return {
                'statusCode': 200,
                'body': json.dumps('Prediction on ' + str(X[0:1]) + ' is : ' + str(ml_prediction))
            }