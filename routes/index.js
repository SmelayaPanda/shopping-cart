var express = require('express')
    , router = express.Router()
    , passport = require('passport')
    , csrf = require('csurf')
    , csrfProtection = csrf();
// protect all routes by csrf protection
router.use(csrfProtection);

var Product = require('../models/product');

/* GET home page. */
router.get('/', function (req, res, next) {
    Product.find(function (err, docs) {
        res.render('shop/index',
            {
                title: 'Express',
                products: docs
            });
    });
});

// SING UP
router.get('/user/signup', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', {
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
});
// 'local.signup' - the same strategy as in passport.js
router.post('/user/signup',
    passport.authenticate('local.signup',
        {
            successRedirect: '/user/profile',
            failureRedirect: '/user/signup',
            failureFlash: true
        })
);

// SIGN IN
router.get('/user/signin', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin', {
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
});
// 'local.signin' - the same strategy as in passport.js
router.post('/user/signin',
    passport.authenticate('local.signin',
        {
            successRedirect: '/user/profile',
            failureRedirect: '/user/signin',
            failureFlash: true
        })
);


router.get('/user/profile', function (req, res, next) {
    res.render('user/profile');
});

module.exports = router;
