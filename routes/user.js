var express = require('express')
    , router = express.Router()
    , passport = require('passport')
    , csrf = require('csurf')
    , csrfProtection = csrf();
router.use(csrfProtection);

// Check login
router.get('/profile', isLoggedIn, function (req, res, next) {
    res.render('user/profile');
});

// LOGOUT
router.get('/logout', isLoggedIn, function (req, res, next) {
    req.logout(); // method of passport
    res.redirect('/');
});

// redirect from any URI into HOME page if user is login
router.use('/', notLoggedIn, function (req, res, next) {
    next(); // end of circle request-response for any request if not logged in
});

// SING UP
router.get('/signup', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', {
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
});
// 'local.signup' - the same strategy as in passport.js
router.post('/signup',
    passport.authenticate('local.signup',
        {
            successRedirect: '/user/profile',
            failureRedirect: '/user/signup',
            failureFlash: true
        })
);

// SIGN IN
router.get('/signin', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin', {
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
});
// 'local.signin' - the same strategy as in passport.js
router.post('/signin',
    passport.authenticate('local.signin',
        {
            successRedirect: '/user/profile',
            failureRedirect: '/user/signin',
            failureFlash: true
        })
);

module.exports = router;


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) { // method of passport
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) { // method of passport
        return next();
    }
    res.redirect('/');
}