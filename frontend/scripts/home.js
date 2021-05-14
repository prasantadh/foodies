document.onreadystatechange = function() {
    if (document.readyState !== "complete") {
        document.querySelector(
          "body").style.visibility = "hidden";
        document.querySelector(
          "#loader").style.visibility = "visible";
    } else {
        document.querySelector(
          "#loader").style.display = "none";
        document.querySelector(
          "body").style.visibility = "visible";
    }
};


const popularRecipesBlock = document.getElementById('popularRecipes');

function addCard() {
    var recipeName = "Burger";
    var recipeImage = "css/images/burger.jpg";
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

    return colDiv;
}

for (var i = 0; i < 10; i++) {
    popularRecipesBlock.appendChild(addCard());
}