BASE_URL = "http://localhost:3000";

let user; //Will hold the user which page is being looked at
let doesLoginMatch;


function init(){
    const userID = document.getElementById("id").innerHTML; //Grabs the ID of current user from HTML page
    
    doesLoginMatch = document.getElementById("loginmatch").innerHTML === "true"; //Checking if user one logged in within the current session matches the user of the page being looked at
    
    getUser(userID);  
}


//Make an AJAX request for the user specified by their ID
function getUser(userID){
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(this.readyState==4 && this.status==200){
            user = JSON.parse(this.response);
            
            if(doesLoginMatch){
                //If client is logged in and looking at their own profile -> update privacy inputs
                const button = document.getElementById("savePriv");
                button.addEventListener("click", updateUserPriv);
                document.getElementById(user.privacy).checked = true;
            }
        }
    }
    req.open("GET", BASE_URL+ "/users/"+userID);
    req.setRequestHeader("Accept", "application/json");
    req.send();
}


//Sends AJAX PUT request to update the privacy of current user
function updateUserPriv(){
    //First checks if radio inputs have actually been altered before sending request
    if(!document.getElementById(user.privacy).checked){
        const req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if(this.readyState==4 && this.status==200){
                user.privacy = !user.privacy;
                alert(this.responseText);
            }
            else if(this.readyState==4){
                alert(this.responseText);
            }
        }
        req.open("PUT", BASE_URL+"/users/"+user._id);
        req.send();
    }
    
}