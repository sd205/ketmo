var request = require("request");
var async = require('async');

var env = require('../env');

var User = require('../auth/user');
var Session = require('../auth/session');
var Fund = require('../model/fund');

var helper = {

  base_url: "",

  before: function(done) {
    this.base_url = "http://"+env.ipaddress+":"+env.port+"/"
    env.getConnection(done);
  },

  after: function(done) {
    //define a queue to process each of the test users to be cleaned up
    var q = async.queue(function (user, callback) {
      //console.log("user="+JSON.stringify(user));
      Session.remove({user: user._id}, function(err, rows) {
        //console.log("sessions="+JSON.stringify(rows));
        Fund.remove({"_acl.owner": user._id}, function(err, rows) {
          //console.log("funds="+JSON.stringify(rows));
          User.remove({_id: user._id}, function(err, rows) {
            //console.log("user="+JSON.stringify(rows));
            callback();
          });
        });
      });
    }, Infinity);

    q.drain = function() {
      env.closeConnection(done);
    }

    //add all the test users to the queue
    User.find({provider: 'test'}).cursor().on('data', function(doc) { q.push(doc); });
  },

  userNumber: 0,
  ketmo_sessionid1: 0,

  getNewUserRequest: function(reqs, done) {
    var userNumber = this.userNumber++;
    var user = new User({username: 'test user '+userNumber, email: 'test'+userNumber+'@ketmo.net', provider: 'test'});

    user.save(function (err, user) {
      if (err) {
        console.log(err);
        done();
      }
      var session = new Session({user: user._id, token: 'test'});
      session.save(function (err, session) {
        if (err) {
          console.log(err);
          done();
        }
        if (userNumber==1) {this.ketmo_sessionid1 = session._id;}
        reqs.user.push(request.defaults({
          headers: {'Cookie': 'ketmo_sessionid='+session._id}
        }));

        done();
      });
    });
  }
}

module.exports = helper
