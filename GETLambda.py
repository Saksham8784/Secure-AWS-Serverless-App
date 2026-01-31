import json

import boto3

from decimal import Decimal

class DecimalEncoder(json.JSONEncoder):

def default(self, obj): if isinstance(obj, Decimal): # convert Decimal → int or float return int(obj) if obj % 1 == 0 else float(obj) return super(DecimalEncoder, self).default(obj)

def lambda_handler(event, context):

dynamodb = boto3.resource('dynamodb')

table = dynamodb.Table('studentData')

response = table.scan()

data = response['Items']

return { "statusCode": 200, "headers": { "Content-Type": "application/json" }, "body": json.dumps(data, cls=DecimalEncoder) }
