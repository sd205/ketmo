var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var Audit = require('../auth/audit');
var ACL = require('../auth/acl');

//define the model for Task
var schema = mongoose.Schema({
    name: { type: String, required: true },
    value: Number,
    parent_ref: { type: String, required: true, enum: ['fund','account'] },
    parent_id: { type: ObjectId, required: true },
    _acl: { type: ACL.schema, required: true },
    _aud: { type: Audit.schema, required: true }
});

var model = mongoose.model('Task', schema);
module.exports = model;
