var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var flash = require('connect-flash');
var fs = require('fs');
var User = require('../models/User');
var Order = require('../models/Order');
var passportSetup = require('../config/passport');
let jsonData = require('./database-restraunt');
const chalk = require('chalk');
var auth = require('./auth');

router.get('/user', auth.required, function(req, res, next){
    User.findById(req.payload.id).then(function(user){
        if(!user){ return res.sendStatus(401); }
    
        return res.json({user: user.toAuthJSON()});
    }).catch(next);
});

router.post('/register', function(req ,res, next){
    if(!req.body.username){
        return res.status(422).json({errors: {username: "can't be blank"}});
    }
    
    if(!req.body.password){
        return res.status(422).json({errors: {password: "can't be blank"}});
    }
    passport.authenticate('register', { failureRedirect : '/register' }, 
        function(err, user, info) {
            if(err){ return next(err); }
            if(user){
                res.status(200).json({user : user.toAuthJSON()});
            }
        })(req, res, next);
});

router.post('/login', function(req, res, next){
    if(!req.body.username){
        return res.status(422).json({errors: {username: "can't be blank"}});
    }
    
    if(!req.body.password){
        return res.status(422).json({errors: {password: "can't be blank"}});
    }
    passport.authenticate('login', { failureRedirect : '/login' }, 
        function(err, user, info) {
            if(err){ return next(err); }
            if(user){
                user.token = user.generateJWT();
                return res.json({user: user.toAuthJSON()});
            }
        })(req, res, next);
});

router.get('/logout', function(req, res, next) {
    if (req.session) {
        req.session.destroy(function (err) {
            if(err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

router.post('/profile', auth.required, function(req, res) {
    let filter = {
        _id: req.payload.id
    }
    let update = {
        privacy : req.body.privacy
    }
    User.findOneAndUpdate(filter, update)
        .then(function (originUser) {
            User.findOne(filter).then(updatedUser => {
                res.status(200).json(updatedUser.toAuthJSON());
            })
        })
        .catch(function(err) {
            console.log(chalk.red("___this is error___", err));
            res.status(400).json({message: err.message})
        })
});

router.get('/restaurant_list', auth.required, function(req, res) {
    res.status(200).json({
        restaurantList: jsonData.restaurants
    });
});

router.post('/orders', auth.required, function(req, res) {
    var order = new Order();
    order.userID = req.payload.id;
    order.restaurantID = req.body.restaurantID;
    order.restaurantName = req.body.restaurantName;
    order.subtotal = req.body.subtotal;
    order.total = req.body.total;
    order.fee = req.body.fee;
    order.tax = req.body.tax;
    order.orders = req.body.orders;
    order.save()
        .then(function (orders) {
            res.status(200).json({order: order.toAuthJSON()});
        })
        .catch(error => {
            res.status(406).json({message: error});
        });
})
router.get('/orders', auth.required, function(req, res){
    const userID = req.payload.id;
    if(userID) {
        Order.find({userID : userID}).then((orders) => {
            res.status(200).json({orders : orders})
        }).catch(err => {
            res.status(404).json({message : err})
        })
    } else {
        res.status(401).json({message : "User Not Authorized"});
    }
})
router.get('/getUsers/:userName', function(req, res){
    if(req.params.userName){
        var name = req.params.userName.toLowerCase();
        var regexp = new RegExp("^"+ name);
        User.find({username: regexp}, function(err, users) {
            res.status(200).json({
                users: users
            });
        });
    } else {
        User.find({}, function(err, users) {
            res.status(200).send(users);
        });
    }
});
router.get('/users/:userID', function(req, res) {
    console.log(chalk.red("______________user id___________________", req.params.userID));
    User.findById(req.params.userID, function(err, user) {
        Order.find({userID: user._id})
            .then((userDetail) => {
                res.status(200).json({userDetail: userDetail, username: user.username});
            }).catch((err) => {
                res.status(404).json({message : err});
            });
        });
});

module.exports = router;