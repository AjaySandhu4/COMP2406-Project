BASE_URL = "http://localhost:3000";

const button = document.getElementById("login");
button.addEventListener("click", sendLoginData);


//Sends POST request to server containing username and password input in order to authenticate client
function sendLoginData(){
    //Grabbing data from input fields
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    let userData = {username: username, password: password};

    const req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(this.readyState==4 && this.status==200){
            window.location.href = BASE_URL;
        }
        if(this.readyState==4 && this.status==401){
            alert("Username and/or password are not valid!");
        }
    }
    req.open("POST", BASE_URL+"/login");
    req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(userData));

}