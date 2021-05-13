def lambda_handler(event, context):
    print("event->", event)
    print("context->", context)
    return [
            {
                'name' : 'tap water',
                'recipe' : '1. open the tap'
                },
            {
                'name' : 'bottled water',
                'recipe' : '1. walk into a bodega'
                }
            ]
