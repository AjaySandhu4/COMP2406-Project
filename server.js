const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
let userRouter = require("./routes/user-router");
let orderRouter = require("./routes/order-router");
let User = require('./models/UserModel');

MONGO_URL = 'mongodb://localhost:27017/a4'; //Url for database

let app = express();

let store = new MongoDBStore({
    uri: MONGO_URL,
    collection: 'sessions'
});

app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "pug");
app.use(session({
    secret: "I have apples",
    store: store,
    cookie:{
        maxAge: 1000*60*60*24 //Cookie lasts 1 day
    },
    saveUninitialized: false,
    resave: true
}));
app.use(exposeSession);

app.use("/users", userRouter);
app.use("/orders", orderRouter);


//Setting up the connection to the database
mongoose.connect(MONGO_URL, {useNewUrlParser: true});
let db = mongoose.connection;
db.on("error", console.error.bind(console, "Database connection error: "))
db.once("open", function(){
    app.listen(3000);
    console.log("Server listening at http://localhost:3000");
});


//Route for GET "/" sends the client HTML containing a welcome page
app.get(["/","/home"], (req, res, next) => {
    res.render("homepage", {}, (err, data)=>{
        if(err){
            res.status(500).send("Server failed to load homepage");
            console.log(err);
        }
        else{
            res.status(200).send(data);
        }
    });
});


//Route for GET "/login" sends client HTML containing a login page
app.get("/login", (req, res, next) => {
    if(!req.session.loggedin){
        res.render("login", {}, (err, data)=>{
            if(err){
                res.status(500).send("Server failed to load login page");
                console.log(err);
            }
            else{
                res.status(200).send(data);
            }
        });
    }
    else{
        res.status(200).send("You are already logged in!");
    } 
});


//Route for POST "/login" receives login data from client, authenticates it, logs is user accordingly...
app.post("/login", (req, res, next) => {
    if(req.session.loggedin){
        res.status(200).send("You are already logged in!");
    }
    else{
        const username = req.body.username;
        const password = req.body.password;
        
        //Make query looking for matching user 
        User.
            findOne().
            where("username").equals(username).
            where("password").equals(password).
            exec(function(error, user){
                if(user){
                    //If user is found, user information is added the to session object
                    req.session.username = user.username;
                    req.session.userId = user._id
                    req.session.loggedin = true;
                    res.status(200).send("Successfully logged in!");
                }
                else{
                    res.status(401).send("Invalid login data");
                }
            });
    }
});


//Route for GET "/logout" logs user out by destroying session data
app.get("/logout", (req, res, next) => {
    if(req.session.loggedin){
        req.session.destroy();
        res.redirect("/home");
    }
    else{
        res.status(200).send("Cannot log out because not logged in");
    }
});


//Route for GET "/register" sends client HTML page that includes inputs in order to register new user
app.get("/register", (req, res, next) =>{
    if(!req.session.loggedin){
        res.render("register", {}, (err, data)=>{
            if(err){
                res.status(500).send("Server failed to load registration  page");
                console.log(err);
            }
            else{
                res.status(200).send(data);
            }
        });
    }
    else{
        res.status(200).send("You must log out first in order to register...");
    } 
});


//Route for GET "/orderform" sends client HTML page that lets client order from restaurants
app.get("/orderform", (req, res, next) => {
    if(req.session.loggedin){
        res.render("orderform", {}, (err, data)=>{
            if(err){
                res.status(500).send("Server failed to load orderform");
                console.log(err);
            }
            else{
                res.status(200).send(data);
            }
        });
    }
    else{
        res.status(401).send("Cannot use orderform unless logged in...");
    }
});


//Function gives the response object the request session which will allow pug templates to access it
//Taken from demo in the A4 workshop of TA Gabriel Melo
function exposeSession(req, res, next){
    if(req.session){
        res.locals.session = req.session;
    }
    next();
}










