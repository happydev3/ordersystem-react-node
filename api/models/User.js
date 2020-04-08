var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var secret = require('../config').secret;
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    privacy: {
        type: Boolean,
        default: false
    }
});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateJWT = function() {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);
  
    return jwt.sign({
      id: this._id,
      username: this.username,
      exp: parseInt(exp.getTime() / 1000),
    }, secret);
  };
  
UserSchema.methods.toAuthJSON = function(){
    return {
      username: this.username,
      password: this.password,
      privacy: this.privacy,
      token: this.generateJWT()
    };
  };
  

var User = mongoose.model('User', UserSchema);
module.exports = User;