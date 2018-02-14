var express = require('express')
    , path = require('path')
    , bodyParser = require('body-parser')
    , cookieParser = require('cookie-parser')
    , logger = require('morgan')
    , favicon = require('serve-favicon')
    , session = require('express-session')
    , expressHbs = require('express-handlebars')
    , mongoose = require('mongoose')
    , passport = require('passport')
    , flash = require('connect-flash')
    , validator = require('express-validator')
    , MongoStore = require('connect-mongo')(session)
;

// DB with name "shopping" will be crated automatically if not exists
mongoose.connect('mongodb://localhost:27017/shopping');
// run all code in passport.js
require('./config/passport');

var index = require('./routes/index');
var userRoutes = require('./routes/user');
var app = express();

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(validator());
app.use(cookieParser());
app.use(session(
    {
        secret: 'mySuperPuperSecret',
        resave: false,
        saveUninitialized: false,
        cookie: {maxAge: 60000},
        store: new MongoStore({ mongooseConnection: mongoose.connection })
        // store time to live - ttl: 14 * 24 * 60 * 60 // = 14 days. Default
    }));
app.use(flash()); // flash used session
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.locals.login = req.isAuthenticated(); // ! create global variable 'login' which be able in every view!
    res.locals.session = req.session;
    next();
});

app.use('/user', userRoutes); // if you put this after app.use('/', index); -all user request will be send to '/'
app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
