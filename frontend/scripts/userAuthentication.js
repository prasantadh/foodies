var cognitoUser;
var idToken;
var userPool;
var userPoolId = 'us-east-1_WOWiGWkNP';
var clientId = '52mveimcink6t1osd3fopgfekn';
var region = 'us-east-1';
var identityPoolId = 'us-east-1:9d1a41f6-89b5-48e4-bf38-af6b15a1aa67';
var jwtUsername;

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
        fullName = FullName + " " + lastName;
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
            alert('An error occured while signing up!');
            console.log(err.message + JSON.stringify(err));
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
            console.log(jwtUsername);
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