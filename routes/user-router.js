const express = require('express');
const mongoose = require('mongoose');
let User = require('../models/UserModel');
let Order = require('../models/OrderModel');
let router = express.Router();

//Routes for "/users"
router.post("/", isNewUserUnique, addUser);
router.get("/", getUsers, sendUsersDir);
router.get("/:userID", getUserOrders, sendUser);
router.put("/:userID", updateUserPrivacy);
router.param("userID", findUser);


//Function adds user created in registration to database
function addUser(req,res,next){
    let newUser = new User();
    newUser.username = req.body.username;
    newUser.password = req.body.password;
    newUser.privacy = false;

    newUser.save(function(error, createdUser){
        if(error){
            console.log("saving error");
            res.status(500).send("Error saving new user");
        }
        else{
            req.session.username = createdUser.username;
            req.session.userId = createdUser._id;
            req.session.loggedin = true;
            res.locals.session = req.session;
            res.status(201).send(createdUser._id.toString());
        }
    });
}
       

//Function checks database to see if username entered in registration is unique
function isNewUserUnique(req, res, next){
    User.
        find().
        where("username").equals(req.body.username).
        exec(function(error, results){
            if(error){
                console.log("data fail");
                res.status(500).send("Server had database failure");
            }
            else if(results.length != 0){
                res.status(400).send("Username already exists");
            }
            else{
                next();
            }
        });
}


//Function sends users found in database
//Filters users by name if query string exists
//Filters out private users regardless of query
function getUsers(req, res, next){
    let query = {};
    if(req.query.name) query = {username: new RegExp(req.query.name, "i")}; //If there is a name query, add a case insensitive query for a username

    User.find(query).where("privacy").equals(false).exec(function(error, results){
        if(error){
            res.status(500).send("Error fetching users from database");
        }
        else{
            res.locals.users = results;
            next();
        }
    });
}


//Function sends client HTML containing the list of users that were queried
function sendUsersDir(req, res, next){
    res.render("users", {users: res.locals.users}, (err, data)=>{
        if(err){
            res.status(500).send("Server failed to load users directory page");
        }
        else{
            res.status(200).send(data);
        }
    });
}


//Finds user from database specified in userID param
function findUser(req, res, next){
    User.findOne({_id: req.params.userID}).exec(function(error, user){
        if(error){
            res.status(500).send("Error fetching users from database");
            return;
        }
        else if(user == null){
            res.status(404).send("Cannot find user of given ID");
            return;
        }
        else if(user.privacy == true){
            //Unless the client is looking at their own profile, send a 403 (when the user is private)
            if(!(req.session.loggedin && req.session.userId.toString() == user._id.toString())){
                res.status(403).send("Cannot access this user's page");
                return;
            }
        }
        else if(req.method == "PUT"){
            //Unless the client is trying to update their own profile, send a 403
            if(!(req.session.loggedin && req.session.userId.toString() == user._id.toString())){
                res.status(403).send("Cannot alter this user's data");
                return;
            }
        }
        res.locals.user = user;
        next();
    });
}


//Function sends HTML page to client containing data of user specified in the param
function sendUser(req, res, next){
    if(req.accepts('text/html')){
        res.render("user", {user: res.locals.user, userOrders: res.locals.userOrders}, (err, data)=>{
            if(err){
                console.log(err);
                res.status(500).send("Server failed to load user page");
            }
            else{
                res.status(200).send(data);
            }
        });
    }
    else if(req.accepts('application/json')){
        res.status(200).send(JSON.stringify(res.locals.user));
    }
    else{
        res.sendStatus(406);
    }
}


//Function uses found user and updates its privacy
function updateUserPrivacy(req, res, next){
    updatePrivacy = {privacy: !res.locals.user.privacy} //Flips privacy value
    User.findByIdAndUpdate(res.locals.user._id, {privacy: !res.locals.user.privacy}, function(error, doc){
        if(error){
            res.status(500).send("Server failed to update user in database");
        }
        else{
            res.status(200).send("Your privacy was successfully updated!");
        }
    });
}


//Function finds orders associated with user specified in param
//Only allows finding orders of non-private users or if the user is same as the session
function getUserOrders(req, res, next){
    if(res.locals.user.privacy && !(req.session.loggedin && req.session.userId.toString() == res.locals.user._id.toString())){
        res.locals.userOrders = [];
        next();
    }
    else{
        Order.
            find().
            where("userID").equals(res.locals.user._id).
            exec(function(err, result){
                if(err){
                    res.status(500).send("Server failed when fetching user's orders from database");
                }
                else{
                    res.locals.userOrders = result;
                    next();
                }
            });
    }
}


module.exports = router;

