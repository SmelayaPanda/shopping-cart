// Important think:
// this imported passport is the same which will be imported in app.js
var passport = require('passport')
    , User = require('../models/user')
    , LocalStrategy = require('passport-local').Strategy;

// store user in the session
passport.serializeUser(function (user, done) {
    // use user id to serialize user in the session
    done(null, user.id)
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    })
});
// SING UP
passport.use('local.signup',
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        // Validation
        req.checkBody('email', 'Invalid email').notEmpty().isEmail();
        req.checkBody('password', 'Invalid password').notEmpty().isLength({min: 4});
        var errors = req.validationErrors();
        if (errors) {
            var messages = [];
            errors.forEach(function (error) {
                messages.push(error.msg); // msg it is a field of express-validation error
            });
            // 1- error, 2 - successful, 3 - error message
            return done(null, false, req.flash('error', messages));
        }
        // Add to db
        User.findOne({'email': email}, function (err, user) {
            if (err) {
                return done(err)
            }
            if (user) {
                return done(null, false, {message: 'Email is already in use'})
            }
            var newUser = new User();
            newUser.email = email;
            newUser.password = newUser.encryptPassword(password);
            newUser.save(function (err, result) {
                if (err) {
                    return done(err);
                }
                return done(null, newUser);
            })
        })
    })
);

// SIGN IN
passport.use('local.signin',
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        // Validation
        req.checkBody('email', 'Invalid email').notEmpty().isEmail();
        req.checkBody('password', 'Invalid password').notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            var messages = [];
            errors.forEach(function (error) {
                messages.push(error.msg); // msg it is a field of express-validation error
            });
            // 1- error, 2 - successful, 3 - error message
            return done(null, false, req.flash('error', messages));
        }
        // Compare with existing
        User.findOne({'email': email}, function (err, user) {
            if (err) {
                return done(err)
            }
            if (!user) {
                return done(null, false, {message: 'No user found.'})
            }
            if (!user.validPassword(password)) {
                return done(null, false, {message: 'Wrong password.'})
            }
            // 1 - no error, 2 - retrieve the user
            return done(null, user);
        })
    })
);