var slider = document.getElementById("rowSlider");

for (let i = 0; i < 10; i ++) {
//     var colDiv = document.createElement('div');
//     colDiv.className = "col s3";
//     var cardDiv = document.createElement('div');
//     cardDiv.className = "card";
//     var cardImageDiv = document.createElement('div');
//     cardImageDiv.className = "card-image";
     var cardImage = document.createElement('img');
     cardImage.src = "images/burger.jpg";
//     var cardImageSpan = document.createElement('span');
//     cardImageSpan.className = "card-title";
//     cardImageSpan.textContent = "Burger";
//     var cardContentDiv = document.createElement('div');
//     cardContentDiv.className = "card-content";
//     var cardP = document.createElement('p');
//     cardP.innerHTML = "Prep Time : 10 minutes.";

//     slider.appendChild(colDiv);
//     slider.appendChild(cardDiv);
//     slider.appendChild(cardImageDiv);
//     slider.appendChild(cardImage);
//     slider.appendChild(cardImageSpan);
//     slider.appendChild(cardContentDiv);
//     slider.appendChild(cardP);

}



const div = document.createElement('div');
div.className = 'col s3';
div.innerHTML = `
    <div class="card">
        <div class="card-image">
            <img src="images/burger.jpg">
            <span class="card-title">Burger</span>
        </div>
        <div class="card-content">
            <p>Prep Time: 10 mins</p>
        </div>
    </div>
`;
  
slider.appendChild(div);
