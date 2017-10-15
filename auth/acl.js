var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

//define the model for ACL
var schema = mongoose.Schema({
    owner: { type: ObjectId, required: true }
});

var model = mongoose.model('ACL', schema);
module.exports = model;
