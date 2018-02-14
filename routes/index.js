var express = require('express')
    , router = express.Router()
    , csrf = require('csurf')
    , csrfProtection = csrf();
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

module.exports = router;
