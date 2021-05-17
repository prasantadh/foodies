var apigClient = apigClientFactory.newClient();
var rID = ''//id from HTTP GET here
function getRecipe(){
    //apigClient.recipesIdGet(params = { "id": "0MQI9HFNFlFGl2v26NcAaqegwGIavbq"}, "").then(function (result) {
    apigClient.recipesIdGet(params = { "id": rID}, "").then(function (result) {

        //Title
        var recTitle = result['data']['Item']['title']['S']
        console.log(recTitle)
        if (document.getElementById('RecipeTitle')) {
            document.getElementById('RecipeTitle').innerText = recTitle;
        }
        
        //Ingredients
        var ingredientLength = result['data']['Item']['ingredients']['L']['length']
        var i;
        var recIngredients = '';
        for (i=0; i<ingredientLength; i++){
            recIngredients+=result['data']['Item']['ingredients']['L'][i]['S']
            recIngredients+="\r\n"
        }
        console.log(recIngredients)
        if (document.getElementById('Ingredients')) {
            document.getElementById('Ingredients').innerText = recIngredients;
        }
        
        //Instructions
        var recInstructions = result['data']['Item']['instructions']['S']
        console.log(recInstructions)
        if (document.getElementById('Instructions')) {
            document.getElementById('Instructions').innerText = recInstructions;
        }

        //Likes
        var likes = result['data']['Item']['likes']['L']['length'] + ' Likes'
        console.log(likes)
        if (document.getElementById('likeButton')) {
            document.getElementById('likeButton').innerText = likes;
        }

        var commentLength = result['data']['Item']['comments']['L']['length'];
        var i;
        var comments = ''
        for (i=0; i<commentLength; i++){

            comments+=result['data']['Item']['comments']['L'][i]['L'][1]['S']
            comments+="\r\n"
            comments+=result['data']['Item']['comments']['L'][i]['L'][2]['S']
            comments+="\r\n\r\n"
        }
        console.log(comments)
        if (document.getElementById('Comments')) {
            document.getElementById('Comments').innerText = comments;
        }
    })
}