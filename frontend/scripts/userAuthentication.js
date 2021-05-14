var cognitoUser;
var idToken;
var userPool;
var userPoolId = 'us-east-1_WOWiGWkNP';
var clientId = '52mveimcink6t1osd3fopgfekn';
var region = 'us-east-1';
var identityPoolId = 'us-east-1:9d1a41f6-89b5-48e4-bf38-af6b15a1aa67';
var jwtUsername;
var jwtUserid;
var recipeName

AWS.config.region = 'us-east-1'; 
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: identityPoolId
});

var poolData = {
    UserPoolId : userPoolId,
    ClientId : clientId
};

getCurrentSession();


document.onload = function() {
    console.log(logoutButton);
    document.getElementById('logoutButton').onclick = function() {
        userLogout();
    }    
};

function register() {

    var email = document.getElementById('email').value;
    var firstName = document.getElementById('fname').value;
    var lastName = document.getElementById('lname').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirm_password').value;
    var fullName = firstName;
    if (lastName) {
        fullName = fullName + " " + lastName;
    } 

    if (!email || !firstName || !password) {
        alert('Please fill out all the required fields!')
    } else {
        if (password == confirmPassword) {
            console.log('Password confirmed.');
            registerUser(email, password, fullName);
        } else {
            alert('Passwords do not match!');
        }
    }
}

function registerUser(email, password, fullName) {

    var attributeList = [];

    var emailData = {
        Name : 'email',
        Value : email,
    };

    var nameData = {
        Name : 'name',
        Value : fullName,
    };

    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(emailData);
    var attributeName = new AmazonCognitoIdentity.CognitoUserAttribute(nameData);

    attributeList.push(attributeEmail);
    attributeList.push(attributeName);

    userPool.signUp(email, password, attributeList, null, function(err, result) {
        if (err) {
            console.log('An error occured while signing up!');
            alert(err.message + JSON.stringify(err));
            return;
        }
        cognitoUser = result.user;
        console.log('Username : ' + cognitoUser.getUsername());
        console.log('Name : ' + fullName);
        alert('A confirmation email has been sent to your email.');
        window.location.href = 'index.html';
    });
}


function userSignin() {

    var username = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Please enter Username and Password!');
    } else {
        var authenticationData = {
            Username : username,
            Password : password,
        };    
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
        var userData = {
            Username : username,
            Pool : userPool
        };
        cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        //loader.show()
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function(result) {
                console.log('Logged in successfully!');
                idToken = result.getIdToken().getJwtToken();
                window.location.href = "home.html";
                getCognitoIdentityCredentials();
            },
            onFailure: function(err) {
                alert(err.message);
            },
        });
    }
}


function userLogout() {

    if (cognitoUser != null) {
        cognitoUser.signOut();
        console.log('Logged Out!');
        window.location.href = "index.html";
    }

}

function getCognitoIdentityCredentials() {
    AWS.config.region = region;
    
    var loginMap = {};
    loginMap['cognito-idp.' + region + '.amazonaws.com/' + userPoolId] = idToken;

    //AWS.config.credentials.clearCachedId();
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: identityPoolId,
        Logins: loginMap
    });

    

    AWS.config.credentials.get(function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Received Credentials.');
            var jwtDecoded = parseJwt(idToken);
            jwtUsername = jwtDecoded['name'];
            jwtUserid = jwtDecoded['sub'];
            console.log(jwtUsername);
            updateUsername();
        }
    });
}

function getCurrentSession() {
    userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
        cognitoUser.getSession(function(err, session) {
            if (err) {
                console.log(err.message);
            } else {
                console.log('Session Found! Logged in.');
                idToken = session.getIdToken().getJwtToken();
                getCognitoIdentityCredentials();
            }
        });
    } else {
        console.log('Session expired. Please log in again.');
    }
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

function updateUsername() {
    console.log('Update : ' + jwtUsername);
    if (document.getElementById('sidebarUsername')) {
        document.getElementById('sidebarUsername').innerText = jwtUsername;   
    }
}

function togglePopup(){
    if (document.getElementById('recipeName').value == "") {
        alert('Please enter a recipe name to continue!.');
    }
    else {
        recipeName = document.getElementById('recipeName').value;
        console.log(recipeName);
        var popupHeader = document.getElementById('popupHeader');
        popupHeader.innerText = "Add ingredients for '" + recipeName + "'";

        document.getElementById("popup").classList.toggle("active");
        
    } 
    
  }

function addMore() {
    var ul = document.getElementById('ingredientList');
    var li = document.createElement('li');
    var quantity = document.getElementById('quantity').value;
    var item = document.getElementById('ingredient').value;
    console.log(quantity + " - " + item);
    li.appendChild(document.createTextNode(quantity + " " + item));
    ul.appendChild(li);
}

function writeRecipes() {
    var userName = jwtUsername;
    var listIngredients = [];
    var recipeDesc = document.getElementById('recipeDescription').value;
    let ingreds = document.getElementById('ingredientList').querySelectorAll('li');
    console.log(userName);
    console.log(recipeDesc);
    ingreds.forEach((item, index) => {
        console.log(item.innerText, index);
        listIngredients.push(item.innerText);
    });
    console.log("listIngredients: " + listIngredients);
    writeRecipesToDb(userName, recipeDesc, listIngredients);
}

function writeRecipesToDb(username, recipeDesc, listIngredients) {

    // AWS.config.update({
    //     region: "us-west-1",
    //     accessKeyId: "fakeMyKeyId",
    //     secretAccessKey: "fakeSecretAccessKey"
    //   });
      
    let date = new Date();
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName :"usersRecipes",
        Item:{
            'id': jwtUserid.toString(),
            "createdAt": date.toISOString(),
            "name": username,
            "recipeName": recipeName,
            "recipeDescription": recipeDesc,
            "ingredients": listIngredients,
            "numberOfLikes": 0,
            "comments": [{"S" : []}],
            "likes": [{"S" : []}],
        }
    };
    docClient.put(params, function(err, data) {
        if (err) {
            console.log("Unable to add item: " + "\n" + JSON.stringify(err, undefined, 2));
        } else {
            console.log("PutItem succeeded: " + "\n"); // + JSON.stringify(data, undefined, 2)
            console.log(params);
        }
    });

    document.getElementById('ingredientList').innerHTML = "";
    togglePopup();
    
}


function fetchRecipesFromDb() {
    const content = document.getElementById('contentBodyBlock');

    getCognitoIdentityCredentials();

    AWS.config.credentials.get(function(){
        var accessKeyId = AWS.config.credentials.accessKeyId;
        var secretAccessKey = AWS.config.credentials.secretAccessKey;
        var sessionToken = AWS.config.credentials.sessionToken;
      });
    var docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
        TableName : "usersRecipes",
        //KeyConditionExpression : "id",
        // ExpressionAttributeNames:{
        //     "#yr": "year"
        // },
        // ExpressionAttributeValues: {
        //     ":yyyy": 1985
        // }
    };
    
    var result = docClient.scan(params, onScan);
    
    function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Scan succeeded.");
            data.Items.forEach(function(item) {
                content.appendChild(addRecipeCard(item));
                console.log(item)
                showComments(item.comments, item.recipeName);
            })
        }
    }
}

function addRecipeCard(item) {
    var postedAtTime = document.getElementById('postedAtTime');
    var recipeNameHeader = document.getElementById('recipeName');
    var recipyBy = document.getElementById('recipeByName');
    var recipeDescription = document.getElementById('cardRecipeDescription');

    var recipeCardDiv = document.createElement('div');
    recipeCardDiv.className = "w3-container w3-card w3-white w3-round w3-margin"
    var postedSpan = document.createElement('span');
    postedSpan.className = "w3-right w3-opacity";
    postedSpan.id = "postedAtTime";
    postedSpan.innerHTML = item.createdAt;
    var recipeNameHeader = document.createElement('h4');
    recipeNameHeader.id = "recipeName";
    recipeNameHeader.innerHTML = item.recipeName;
    var recipeByHeader = document.createElement('h7');
    recipeByHeader.className = "w3-opacity";
    recipeByHeader.id = "recipeByName";
    recipeByHeader.innerHTML = "by " + item.name;
    var recipeDescription = document.createElement('p');
    recipeDescription.id = "cardRecipeDescription";
    recipeDescription.innerHTML = item.recipeDescription;
    var ingredientsP = document.createElement('p')
    ingredientsP.innerHTML = item.ingredients;
    var likeButton = document.createElement('button');
    likeButton.type = "button";
    likeButton.className = "w3-button w3-theme-d1 w3-margin-bottom";
    likeButton.id = "likeButton";
    var iLike = document.createElement('i');
    iLike.className = "fa fa-thumbs-up";
    var numberOfLikes = ObjectLength(item.likes) - 1;
    if (numberOfLikes == -1){numberOfLikes = 0};
    iLike.innerHTML += "  " + numberOfLikes + "  Likes";
    likeButton.appendChild(iLike);
    likeButton.onclick = function(){addLike(item.id, item.createdAt)};
    var dummyp = document.createElement('p');
    var commentInput = document.createElement('input');
    commentInput.id = "commentInput" + item.recipeName;
    commentInput.placeholder = "Add a comment.";
    commentInput.type = "text";
    commentInput.style.width = "60%";
    commentInput.style.float = "left";
    var commentButton = document.createElement('button');
    commentButton.type = "button";
    commentButton.className = "w3-button w3-theme-d2 w3-margin-bottom";
    commentButton.id = "commentButton";
    commentButton.style.float="left";
    commentButton.onclick = function(){addComment(item, commentInput.value)};
    iComment = document.createElement('i');
    iComment.className = "fa fa-comment";
    iComment.innerHTML = "   Comment";
    var commentsByUsers = document.createElement('p');
    commentsByUsers.id = "commentsFor-" + item.recipeName;
    commentButton.appendChild(iComment);
    recipeCardDiv.appendChild(postedSpan);
    recipeCardDiv.appendChild(recipeNameHeader);
    recipeCardDiv.appendChild(recipeByHeader);
    recipeCardDiv.appendChild(recipeDescription);
    recipeCardDiv.appendChild(ingredientsP);
    recipeCardDiv.appendChild(likeButton);
    recipeCardDiv.appendChild(dummyp);
    recipeCardDiv.appendChild(commentInput);
    recipeCardDiv.appendChild(commentButton);
    recipeCardDiv.appendChild(dummyp);
    recipeCardDiv.appendChild(commentsByUsers);
    return recipeCardDiv;
}

function ObjectLength( object ) {
    var length = 0;
    for( var key in object ) {
        if( object.hasOwnProperty(key) ) {
            ++length;
        }
    }
    return length;
};

function addComment(item, commentText) {

    console.log("Comment by : " + jwtUsername);
    console.log("comment : " + commentText);
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName :"usersRecipes",
        Key:{
            'id': item.id,
            "createdAt": item.createdAt,
        }, 
        UpdateExpression: "set comments = list_append(comments, :comms)",
        ExpressionAttributeValues: {
            ":comms": [
                {
                    "S": [item.id, jwtUsername, commentText],
                }   
            ],
        }
    };
    docClient.update(params, function(err, data) {
        if (err) {
            console.log("Unable to add item: " + "\n" + JSON.stringify(err, undefined, 2));
        } else {
            console.log("PutItem succeeded: " + "\n"); // + JSON.stringify(data, undefined, 2)
            console.log(params);
        }
    });
}

function showComments(comments, recipe) {
    commentsBlock = document.getElementById('commentsFor-' + recipe);
    var commentby;
    var commentText;
    try {
        comments.forEach(function(comment) {
            //console.log(comment.S[1]);
            commentby = comment.S[1];
            commentText = comment.S[2];
            console.log(commentby, commentText);
            if (!commentText) {
                commentsBlock.innerHTML = `
                <div class="row">
                <p style="float:left;">Add comment below</p>
            `;
            } else { 
            commentsBlock.innerHTML += `
                <div class="row">
                <p style="float:left;">` + commentby + ` :   ` + commentText + `</p>
            `
            }
        });
    } catch {
        commentsBlock.innerHTML = `
            <div class="row">
            <p style="float:left;">Add comment below.</p>
        `
    }


}


function addLike(userId, timeStamp) {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName :"usersRecipes",
        Key:{
            'id': userId,
            "createdAt": timeStamp,
        }, 
        UpdateExpression: "set likes = list_append(likes, :like)",
        ExpressionAttributeValues: {
            ":like": [
                {
                    "S": [userId],
                }   
            ],
        }
    };
    docClient.update(params, function(err, data) {
        if (err) {
            console.log("Unable to add item: " + "\n" + JSON.stringify(err, undefined, 2));
        } else {
            console.log("PutItem succeeded: " + "\n"); // + JSON.stringify(data, undefined, 2)
            console.log(params);
        }
    });
}