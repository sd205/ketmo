var Session = require('./session');
var User = require('./user');
var Audit = require('./audit');
var ACL = require('./acl');

var auth = {

  purgeSessions: function(req, res, next) {
    var i = Math.floor(Math.random()*100); //only purge on 1% of calls
    if (i==0) {
      var now = new Date();

      Session.remove({expires: {$lt: now}}, function(err, rows) {
        if (err) {
          console.log('purgeSessions err='+err);
          next();
        } else {
          var n = JSON.parse(rows).n;
          if (n > 0) {
            console.log('purgeSessions rows='+n);
          }
          next();
        }
      });

    } else {
      next();
    }
  },

  getSession: function(req, res, next) {
    //console.log('Cookies: ', req.cookies)
    var sessionid = req.cookies.ketmo_sessionid;
    //console.log('sessionid=', sessionid)
    if (sessionid) {
      Session.findById({_id: sessionid}, 'user', function(err, session) {
        if (err) res.status(401).send(err);
        //console.log('session='+JSON.stringify(session));
        if (session) {
          User.populate(session, {path: 'user', model: 'User', select: Session.USER_SELECT}, function(err, session) {
            //console.log('session='+JSON.stringify(session));
            req.session = session;
            next(); //keep going
          });
        } else {
          res.status(401).send({error: 'cookie not matched in the database'});
        }
      });
    } else {
      res.status(401).send({error: 'not signed in'});
    }

  },

  createACL: function(req) {
    var acl =  new ACL({
      owner: req.session.user._id
    });
    return acl;
  },

  createAudit: function(req) {
    var now = new Date();
    var aud =  new Audit({
      createUser: req.session.user._id,
      createDate: now,
      updateUser: req.session.user._id,
      updateDate: now
    });
    return aud;
  },

  updateAudit: function(req, aud) {
    var now = new Date();
    aud.updateUser = req.session.user._id;
    aud.updateDate = now;
    return aud;
  },

  ownerFilter: function(req, filters) {
    if (filters==null) { filters = {}; }
    filters["_acl.owner"] = req.session.user._id;
    //console.log('auth.addFilters: filters='+JSON.stringify(filters));
    return filters;
  },

  addFilters: function(req, filters) {
    return this.ownerFilter(req, filters);
  }
}

module.exports = auth
