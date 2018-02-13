var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema is a blueprint with used for any new entry to database
var schema = new Schema({
    imagePath: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true}
});

// but we don't work with blueprint
// we work with model who based on blueprint
module.exports = mongoose.model('Product', schema);