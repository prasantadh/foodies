import json
import boto3
from boto3.dynamodb.conditions import Key

def lambda_handler(event, context):
    print("event->", event)
    print("content->", context)
    return {
            'statusCode' : 200,
            'body' : "Successfully posted a comment"
            }
