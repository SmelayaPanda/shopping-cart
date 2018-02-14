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

passport.use('local.signup',
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
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