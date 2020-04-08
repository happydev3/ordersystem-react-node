var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var passportLocal = require('passport-local');
var session = require('express-session');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);
var logger= require('morgan');
var cookieParser = require('cookie-parser');
var configDB = require('./config/database');
var passportSetup = require('./config/passport');
var path = require('path');
var cors = require('cors');
//connect to MongoDB
mongoose.connect(configDB.url);
var db = mongoose.connection;
require('./config/passport')(passport);
//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // db are connected!
});

var app = express();
//parse income requests
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
//use sessions for tracking logins

app.use(session({
    secret: 'comp2406',
    cookie: { maxAge: 7200000 },
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public/')));
//include routes
var routes = require('./routes/router');
app.use('/', routes);


//catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('File not Found');
    err.status = 404;
    next(err);
});

//error handler
//define as the last app.use callback
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
})

app.listen(3000, function() {
    console.log('Express app listening on port 3000');
})