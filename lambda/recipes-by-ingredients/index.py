def lambda_handler(event, content):
    print("event->", event)
    print("event->", context)
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
