BASE_URL = "http://localhost:3000";

const button = document.getElementById("register");
button.addEventListener("click", sendRegistrationData);


//Sends POST request to server containing username and password input in order to create new user
function sendRegistrationData(){
    //Grabbing data from input fields
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    let userData = {username: username, password: password};

    const req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(this.readyState==4 && this.status==201){
            window.location.href = BASE_URL+"/users/"+this.responseText;
        }
        if(this.readyState==4 && this.status!=201){
            alert(this.responseText);
        }
    }
    req.open("POST", BASE_URL+"/users");
    req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(userData));

}