var express = require('express')
    , router = express.Router()
    , csrf = require('csurf')
    , csrfProtection = csrf()
    , Cart = require('../models/cart')
    , stripe = require("stripe")("sk_test_q4FzqlpzhmmVlEN6Wq0aYQAI");
;

var Product = require('../models/product');

router.post('/charge', function (req, res, next) {
    console.log(req.body.stripeToken);
    var token = req.body.stripeToken; // Using Express
    var cart = new Cart(req.session.cart);
// Charge the user's card:
    stripe.charges.create({
        amount: cart.totalPrice,
        currency: "usd",
        description: "Example charge",
        statement_descriptor: "Custom descriptor",
        source: token
    }, function(err, charge) {
        // asynchronously called
    });
    res.redirect('/')
});

router.use(csrfProtection);

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

router.get('/shopping-cart', function (req, res, next) {
    if (!req.session.cart) {
        return res.render('shop/shopping-cart', {products: null})
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart',
        {products: cart.generateArray(), totalPrice: cart.totalPrice})
});

module.exports = router;
