var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var Audit = require('../auth/audit');
var ACL = require('../auth/acl');

//define the model for Transaction
var schema = mongoose.Schema({
    account_id: { type: ObjectId, required: true },
    amount: { type: Number, required: true },
    comment: { type: String, required: true },
    applied: { type: Date },
    balance: { type: Number }, //not saved, but passed back to the page
    //status: { type: Number },
    _acl: { type: ACL.schema, required: true },
    _aud: { type: Audit.schema, required: true }
});

var model = mongoose.model('Transaction', schema);
module.exports = model;
