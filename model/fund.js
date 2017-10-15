var mongoose = require('mongoose');
var async = require('async');

var Audit = require('../auth/audit');
var ACL = require('../auth/acl');
var Account = require('./account');
var Task = require('./task');

//define the model for Fund
var schema = mongoose.Schema({
    name: { type: String, required: true },
    features: { type: Number, min: 0, max: 63 },
    defaultValue: { type: Number, required: true, min: 0},
    _acl: { type: ACL.schema, required: true },
    _aud: { type: Audit.schema, required: true }
});

schema.method('removeChildren', function(done) {
  var fund_id = this._id;
  console.log('fund.removeChildren: '+fund_id);
  Task.remove({parent_ref: 'fund', parent_id: fund_id}, function(err, rows) {
    console.log('task rows='+JSON.stringify(rows));
    if (err) { console.log(err); done(); }

    //define a queue to process each of the test users to be cleaned up
    var q = async.queue(function (account, callback) {
      account.removeChildren(function() {
        account.remove(function (err,rows) {
          //console.log("account="+JSON.stringify(rows));
          callback();
        });
      });
    }, Infinity);

    q.drain = function() {
      done();
    }

    //add all the test users to the queue
    var i =0;
    Account.find({fund_id: fund_id}).cursor()
    .on('data', function(doc) {
      i++;
      q.push(doc);
    })
    .on('end', function() {
      if (i==0) { done(); }
    });
  });
});

var model = mongoose.model('Fund', schema);
module.exports = model;
