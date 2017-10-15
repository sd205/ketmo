var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

//define the model for Audit
var schema = mongoose.Schema({
    createUser: { type: ObjectId, required: true },
    createDate: { type: Date, required: true },
    updateUser: { type: ObjectId, required: true },
    updateDate: { type: Date, required: true }
}, {id: false});

var model = mongoose.model('Audit', schema);
module.exports = model;
