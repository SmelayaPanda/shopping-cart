var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
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

/* Sign up */
router.get('/user/signup', function (req, res, next) {
    res.render('user/signup', {csrfToken: req.csrfToken()});
});
router.post('/user/signup', function (req, res, next) {
    res.redirect('/');
});
module.exports = router;
