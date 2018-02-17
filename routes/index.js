var express = require('express')
    , router = express.Router()
    , csrf = require('csurf')
    , csrfProtection = csrf()
    , Cart = require('../models/cart')
    , stripe = require("stripe")("sk_test_q4FzqlpzhmmVlEN6Wq0aYQAI");
;


const paypal = require('paypal-rest-sdk');
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'Ad40922VN8SQtxW7n9nHrj1C7IGvm0ZTp7w60jqz7R8Xz9bRgUXC7J4RbkhRFNuifEh4jKyylbyrseEw',
    'client_secret': 'EBjZF3A3Xu8MzeLxrcZp1EiQAJoUEf4gZhIb6aK8mkPMY9iX1QI0panPKgz3YoDCWjKamHbumZBF7aX6'
});

router.post('/pay', function (req, res) {
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Red Sox Hat",
                    "sku": "001",
                    "price": "25.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "25.00"
            },
            "description": "Hat for the best team ever"
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });

});

router.get('/success', function (req, res) {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "25.00"
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            res.send('Success');
        }
    });
});


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
    }, function (err, charge) {
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
