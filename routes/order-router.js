const express = require('express');
const mongoose = require('mongoose');
let Order = require('../models/OrderModel');
let User = require('../models/UserModel');
let router = express.Router();

//Routes for "/orders"
router.post("/", addOrder);
router.get("/:orderID", sendOrder);
router.param("orderID", findOrder);

//If client is logged in, the function adds the data in the request body as a new order into the database
function addOrder(req, res, next){
    if(req.session.loggedin){
        let newOrder = new Order();
        newOrder.userID = req.session.userId;
        newOrder.userName = req.session.username;
        newOrder.restaurantName = req.body.restaurantName;
        newOrder.subtotal = req.body.subtotal;
        newOrder.total = req.body.total;
        newOrder.fee = req.body.fee;
        newOrder.tax = req.body.tax;
        newOrder.order = req.body.order;

        newOrder.save(function(error, doc){
            if(error){
                console.log("saving error");
                res.status(500).send("Error saving new order");
            }
            else{
                res.status(200).send("Order successfully placed!");
            }
        });
    }
    else{
        res.status(401).send("Have to be logged in order to place an order...");
    }     
}


//Function sends back HTML to client which holds information for the specified order
function sendOrder(req, res, next){
    res.render("order", {order: res.locals.order}, (err, data)=>{
        if(err){
            res.status(500).send("Server failed to load order page");
            console.log(err);
        }
        else{
            res.status(200).send(data);
        }
    });
}


//Function finds the order from the database specified by the order's ID
//Function also makes query for user associated with order to check whether order is allowed to be viewed
function findOrder(req, res, next){
    const orderID = req.params.orderID;
    Order.findById(orderID).exec(function(err, order){
        if(err){
            res.status(500).send("Error fetching order from database");
            return;
        }
        User.findOne({_id: order.userID}).exec(function(err, user){
            if(err){
                res.status(500).send("Error fetching user");
                return;
            }
            else{
                if(user.privacy && !(req.session.loggedin && req.session.userId.toString() == order.userID)){
                    res.status(403).send("Cannot view this order");
                    return;
                }
                else{
                    res.locals.order = order;
                    next();
                }
            }
        });
    });
}


module.exports = router;