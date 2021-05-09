const popularRecipesBlock = document.getElementById('popularRecipes');

function addCard() {
    var recipeName = "Burger";
    var recipeImage = "images/burger.jpg";
    var recipePrepTime = "Prep Time : 10 mins";

    var colDiv = document.createElement('div');
    colDiv.className = "col s3";
    colDiv.innerHTML = `
        <div class="card">
            <div class="card-image">
                <img src="` + recipeImage + `">
                <span class="card-title">` + recipeName + `</span>
            </div>
            <div class="card-content">
                <p>` + recipePrepTime + `</p>
            </div>
        </div>
    `;

    return colDiv
}

for (var i = 0; i < 10; i++) {
    popularRecipesBlock.appendChild(addCard());
}