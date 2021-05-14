import json
import boto3
from boto3.dynamodb.conditions import Key

def lambda_handler(event, context):
    dynamodb_client = boto3.client('dynamodb', region_name="us-east-1")
    dynamodb = boto3.resource('dynamodb', region_name="us-east-1")
    table = dynamodb.Table('recipes')

    id = '0E.erozRRaUB1LCDDbl./ZL3/JjnN5i' #no comments
    #id = '0MQI9HFNFlFGl2v26NcAaqegwGIavbq' #comments
    response = dynamodb_client.get_item(
    TableName='recipes',
    Key={
        'id': {'S': id}
    })
    
    #some_var = 'comments'
    some_var = 'likes'

    if some_var == 'comments':
        if "comments" in response["Item"].keys():
    
            orig = response["Item"]["comments"]["L"]
        
            new = {"L":[{'S': '1'}, {'S': 'Fake Jake'}, {'S': 'just testing'}]}
            orig.append(new)
    
            response_update = dynamodb_client.update_item(
                ExpressionAttributeNames={
                    '#C': 'comments',
                },
                ExpressionAttributeValues={
                    ':c': {
                        'L': orig,
                    },
                },
                Key={
                    'id': response["Item"]["id"]
                },
                ReturnValues='ALL_NEW',
                TableName='recipes',
                UpdateExpression='SET #C = :c',
            )

            
        else:
            new = [{"L":[{'S': '1'}, {'S': 'Fake Jake'}, {'S': 'just testing here too'}]}]
            
            response_update = dynamodb_client.update_item(
                ExpressionAttributeNames={
                    '#C': 'comments',
                },
                ExpressionAttributeValues={
                    ':c': {
                        'L': new,
                    },
                },
                Key={
                    'id': response["Item"]["id"]
                },
                ReturnValues='ALL_NEW',
                TableName='recipes',
                UpdateExpression='SET #C = if_not_exists(#C, :c)',
            )
    
        print(response_update)
        
    else:
        if "likes" in response["Item"].keys():
    
            orig = response["Item"]["likes"]["L"]
        
            new = {'S': '1'}
            orig.append(new)
    
            response_update = dynamodb_client.update_item(
                ExpressionAttributeNames={
                    '#C': 'likes',
                },
                ExpressionAttributeValues={
                    ':c': {
                        'L': orig,
                    },
                },
                Key={
                    'id': response["Item"]["id"]
                },
                ReturnValues='ALL_NEW',
                TableName='recipes',
                UpdateExpression='SET #C = :c',
            )

            
        else:
            new = [{'S': '1'}]
            
            response_update = dynamodb_client.update_item(
                ExpressionAttributeNames={
                    '#C': 'likes',
                },
                ExpressionAttributeValues={
                    ':c': {
                        'L': new,
                    },
                },
                Key={
                    'id': response["Item"]["id"]
                },
                ReturnValues='ALL_NEW',
                TableName='recipes',
                UpdateExpression='SET #C = if_not_exists(#C, :c)',
            )
    
        print(response_update)
        

    return {
        'statusCode': 200,
        'body': json.dumps(response_update),
        'headers': 
            {'Access-Control-Allow-Origin': '*'}
    }
