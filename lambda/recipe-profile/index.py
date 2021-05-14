import json
import boto3
from boto3.dynamodb.conditions import Key

def lambda_handler(event, context):
    ##print()
    dynamodb_client = boto3.client('dynamodb', region_name="us-east-1")
    dynamodb = boto3.resource('dynamodb', region_name="us-east-1")
    table = dynamodb.Table('recipes')

    id = event['path'][9:]
    response = dynamodb_client.get_item(
    TableName='recipes',
    Key={
        'id': {'S': id}
    }
)
    
    return {
        'statusCode': 200,
        'body': json.dumps(response),
        'headers': 
            {'Access-Control-Allow-Origin': '*'}
    }
