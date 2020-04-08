var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/User');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    //login
    passport.use('login', new LocalStrategy({ passReqToCallback : true },
        function(req, username, password, done) {
            User.findOne({ username: username }, function (err, user) {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (!user.validPassword(password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                req.session.userId = user._id;
                return done(null, user);
                });
            }
    ));
    //signup
    passport.use('register', new LocalStrategy({ passReqToCallback : true },
        function(req, username, password, done) {
            if (!req.user) {
                User.findOne({ username : username }, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        return done(null, false, {message: 'That UserName is already taken.'});
                    } else {
                        var user = new User();

                        user.username = username;
                        user.password = user.generateHash(password);
                        user.privacy  = false;
                        console.log("____REGISTER___",user.username)
                        console.log("____REGISTER___", user.password)
                        user.save().then(function () {
                            req.session.userId = user._id;
                            return done(null, user);
                        }).catch(err => {
                            console.log("REGISTER ERROR : ",err);
                        });
                    }
                });
            } else {
                return done(null, false, {message: 'You have already been logged in.'});
            }
        }));    
}