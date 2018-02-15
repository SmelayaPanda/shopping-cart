var express = require('express')
    , router = express.Router()
    , csrf = require('csurf')
    , csrfProtection = csrf()
    , Cart = require('../models/cart')
;
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

router.get('/add-to-cart/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function (err, product) {
        if (err) {
            return res.redirect('/'); // strange situation
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        res.redirect('/');
    });
});

router.get('/shopping-cart/', function (req, res, next) {
    console.log(req.session);
    if (!req.session.cart) {
        res.render('shop/shopping-cart', {products: null})
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart',
        {products: cart.generateArray(), totalPrice: cart.totalPrice})
});

module.exports = router;
