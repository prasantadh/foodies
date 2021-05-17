apigClient = apigClientFactory.newClient();

apigClient.recipeByIngredientsGet({"ingredients" : ["sugar", "milk"]})
