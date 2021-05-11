var email;
var firstName;
var lastName;
var password;
var poolData;

function registerUser() {

    email = document.getElementById('email').value;
    firstName = document.getElementById('fname').value;
    lastName = document.getElementById('lname').value;

    if (document.getElementById('email') === null) {
        alert("Please enter a valid email address to register.");
    }

    if (document.getElementById('password').value != document.getElementById('confirm_password').value) {
        alert("Passwords Do Not Match! Please Try Again.")
        throw "Passwords do not match!"
    } else {
        password = document.getElementById('password').value;
    }

    poolData = {
        UserPoolId : _config.cognito.userPoolId,
        ClientId : _config.cognito.clientId
    };

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var attributeList = [];

    var emailData = {
        Name : 'email',
        Value : email,
    };

    var nameData = {
        Name : 'name',
        Value : firstName + ' ' + lastName,
    };

    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(emailData);
    var attributeName = new AmazonCognitoIdentity.CognitoUserAttribute(nameData);

    attributeList.push(attributeEmail);
    attributeList.push(attributeName);

    userPool.signUp(email, password, attributeList, null, function(err, result) {
        if (err) {
            alert(err.message || JSON.stringify(err));
            return;
        }
        cognitoUser = result.user;
        console.log('Username : ' + cognitoUser.getUsername());
        alert('A confirmation email has been sent to your email.');
        window.location.href = 'welcome.html';
    })

    
}

function userSignin() {


    var authenticationData = {
        Username : document.getElementById('email').value,
        Password : document.getElementById('password').value,
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    var poolData = { 
        UserPoolId : _config.cognito.userPoolId,
        ClientId : _config.cognito.clientId,
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
        Username : document.getElementById('email').value,
        Pool : userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            var accessToken = result.getAccessToken().getJwtToken();
            var idToken = result.idToken.jwtToken;
            console.log('Jwt Token : ' + accessToken);
        },

        onFailure: function(err) {
            console.log('Jwt Error : ' + JSON.stringify(err));
            alert(err);
        },

    });

}