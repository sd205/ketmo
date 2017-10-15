var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var Audit = require('../auth/audit');
var ACL = require('../auth/acl');
var Task = require('./task');
var Transaction = require('./transaction');

//define the model for Account
var schema = mongoose.Schema({
    name: { type: String, required: true },
    fund_id: { type: ObjectId, required: true },
    balance: Number,
    defaultValue: Number,
    _acl: { type: ACL.schema, required: true },
    _aud: { type: Audit.schema, required: true }
});

schema.method('removeChildren', function(callback) {
  var account_id = this._id;
  console.log('account.removeChildren: '+account_id);
  Transaction.remove({account_id: account_id}, function(err, rows) {
    if (err) { console.log(err); callback(); }
    console.log('transaction rows='+JSON.stringify(rows));
    Task.remove({parent_ref: 'account', parent_id: account_id}, function(err, rows) {
      console.log('task rows='+JSON.stringify(rows));
      if (err) { console.log(err); callback(); }
      callback();
    });
  });
});

var model = mongoose.model('Account', schema);
module.exports = model;
