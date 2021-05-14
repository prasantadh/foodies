var apigClient = apigClientFactory.newClient();

function getRecipe(){
    apigClient.idIdGet(params = { "id": "p3pKOD6jIHEcjf20CCXohP8uqkG5dGi" }, '').then(function (result) {
        var recTitle = result['data']['Item']['title']['S']

        console.log(recTitle)
        console.log(recIngredients)
        console.log(recInstructions)
        if (document.getElementById('RecipeTitle')) {
            document.getElementById('RecipeTitle').innerText = recTitle;
        }
        var ingredientLength = result['data']['Item']['ingredients']['L']['length']
        var i;
        var recIngredients = '';
        for (i=0; i<ingredientLength; i++){
            recIngredients+=result['data']['Item']['ingredients']['L'][i]['S']

            recIngredients+="\r\n"
        }
        
        if (document.getElementById('Ingredients')) {
            document.getElementById('Ingredients').innerText = recIngredients;
        }
        var recInstructions = result['data']['Item']['instructions']['S']
        if (document.getElementById('Instructions')) {
            document.getElementById('Instructions').innerText = recInstructions;
        }
    })
}