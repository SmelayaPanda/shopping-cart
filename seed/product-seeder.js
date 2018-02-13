var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopping');

var products = [
    new Product({
        imagePath: 'images/1.jpg',
        title: 'Samsung One',
        description: 'Awesome wash machine, better cost, better quality!',
        price: 850
    }),
    new Product({
        imagePath: 'images/2.jpg',
        title: 'Samsung Yoho',
        description: 'Awesome wash machine, better cost, better quality!',
        price: 820
    }),
    new Product({
        imagePath: 'images/3.jpg',
        title: 'LG zx',
        description: 'Awesome wash machine, better cost, better quality!',
        price: 740
    }),
    new Product({
        imagePath: 'images/4.jpg',
        title: 'Samsung Triplet',
        description: 'Awesome wash machine, better cost, better quality!',
        price: 920
    })
];

var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function (err, result) {
        done++;
        if (done === products.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}