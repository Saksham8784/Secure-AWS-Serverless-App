import json

import boto3

dynamodb = boto3.resource('dynamodb')

table = dynamodb.Table('studentData')

def lambda_handler(event, context):

body = json.loads(event['body']) if 'body' in event else event

table.put_item( Item={ 'studentID': body['studentID'], 'name': body['name'], 'class': body['class'], 'age': int(body['age']) }

)
