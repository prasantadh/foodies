def lambda_handler(event, context):
    print("event ->", event)
    print("context ->", context)
    return {"statusCode": "200", "body" : "hello from user profile"}
