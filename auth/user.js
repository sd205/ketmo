var mongoose = require('mongoose');

//define the model for User
var schema = mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    provider: { type: String, required: true }
});

var model = mongoose.model('User', schema);
module.exports = model;
