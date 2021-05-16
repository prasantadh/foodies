import json
import logging
import boto3
import requests
from requests_aws4auth import AWS4Auth
from elasticsearch import Elasticsearch, RequestsHttpConnection

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

headers = { "Content-Type": "application/json" }
host = 'https://search-rec-x5ooupubnao7joz3vofgnpjryu.us-east-1.es.amazonaws.com/'
region = 'us-east-1'

def lambda_handler(event, context):

    print ('event : ', event)                   ## Event structure unknown!
    labels = event["labels"]

    if len(labels) != 0:
        rIDs = get_recipes(labels)

    if not rIDs:
        return{
            'statusCode':200,
            "headers": {"Access-Control-Allow-Origin":"*"},
            'body': json.dumps('No Results found')
        }
    else:
        return{
            'statusCode': 200,
            'headers': {"Access-Control-Allow-Origin":"*"},
            'body': {
                'userQuery': labels,
                'recipes':rIDs
            },
            'isBase64Encoded': False
        }


def get_recipes(keys):

    es = Elasticsearch(
        [host],
        http_auth=("Master123", "Master123!"),
    )

    resp = []
    for key in keys:
        if (key is not None) and key != '':
            searchData = es.search({"query": {"match": {"labels": key}}})
            resp.append(searchData)

    output = []
    for r in resp:
        if 'hits' in r:
             for val in r['hits']['hits']:
                key = val['_source']['rID']
                if key not in output:
                    output.append(key)
    return output
