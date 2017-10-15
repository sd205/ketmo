var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var User = require('./user');
var Session = require('./session');

//if we already have a cookie, look up the session and user
router.post('/', function(req, res, next) {
  console.log('Cookies: ', req.cookies)
  var sessionid = req.cookies.ketmo_sessionid;
  console.log('sessionid=', sessionid)
  if (sessionid) {
    Session.findById({_id: sessionid}, 'user', function(err, session) {
      if (err) res.send(err);
      console.log('session='+JSON.stringify(session));
      if (session) {
        User.populate(session, {path: 'user', model: 'User', select: Session.USER_SELECT}, function(err, session) {
          console.log('session='+JSON.stringify(session));
          res.json(session);
        });
      } else {
        res.json(); //cookie not matched in the database
      }
    });
  } else {
    res.json();  //no session cookie
  }
});

//clean up the session on signout
router.post('/signout', function(req, res, next) {
  // Cookies that have not been signed
  console.log('Cookies: ', req.cookies)
  var sessionid = req.cookies.ketmo_sessionid;
  console.log('sessionid=', sessionid)
  if (sessionid) {
    Session.remove({_id: sessionid}, function(err, session) {
      if (err) res.send(err);
      res.json('deleted');
    });
  } else {
    res.json('not found');
  }
});

//google authentication
router.post('/google', function(req, res, next) {
  var CLIENT_ID = '405093204476-ukgtnhq2jjqhc2bvjl311vjgmdbe3tdd.apps.googleusercontent.com';
  // https://developers.google.com/identity/sign-in/web/backend-auth
  var GoogleAuth = require('google-auth-library');
  var auth = new GoogleAuth;
  var client = new auth.OAuth2(CLIENT_ID, '', '');
  client.verifyIdToken(
      req.body.idtoken,
      CLIENT_ID, // Or, if multiple clients access the backend: [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
      function(e, login) {
        Session.find({token: req.body.idtoken}, function(err, sessions) {
          if (err) res.send(err);
          if (sessions.length==0) {
            var payload = login.getPayload();
            var googleid = payload['sub'];
            var email = payload['email'];
            var name = payload['name'];
    
            User.find({email: email, provider: 'google'}, function(err, rows) {
              if (err) res.send(err);
              if (rows.length==0) {
                var user = new User({username: name, email: email, provider: 'google'});
                user.save(function (err, user) {
                  if (err) res.send(err);
                  var session = new Session({user: user._id, token: req.body.idtoken});
                  session.save(function (err, session) {
                    if (err) res.send(err);
                    User.populate(session, {path: 'user', model: 'User', select: Session.USER_SELECT}, function(err, session) {
                      console.log('NEW user, session='+JSON.stringify(session));
                      res.json(session);
                    });
                  });

                });
              } else {
                var user = rows[0];
                var session = new Session({user: user._id, token: req.body.idtoken});
                  //console.log('session='+JSON.stringify(session));
                session.save(function (err, session) {
                  //console.log('err='+err);
                  if (err) res.send(err);
                  //console.log('session2='+JSON.stringify(session));
                  User.populate(session, {path: 'user', model: 'User', select: Session.USER_SELECT}, function(err, session) {
                    console.log('MATCHED user, session='+JSON.stringify(session));
                    res.json(session);
                  });
                });
              }
            });
          } else {
            var session = sessions[0];
            User.populate(session, {path: 'user', model: 'User', select: Session.USER_SELECT}, function(err, session) {
              console.log('MATCHED session='+JSON.stringify(session));
              res.json(session);
            });
          }
        //res.send(email);
        });
      });
});

module.exports = router;