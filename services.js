var express = require('express');
var router = express.Router();

var auth        = require('./ketmoAuth');
var Fund        = require('./model/fund');
var Account     = require('./model/account');
var Task        = require('./model/task');
var Transaction = require('./model/transaction');

//GLOBAL ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

router.all('*', auth.getSession, auth.purgeSessions); //

//FUND ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.get('/funds', function(req, res, next) {
  Fund.find(auth.addFilters(req, req.query), function(err, rows) {
    if (err) { res.send(err); }
    else {
      res.json(rows);
    }
  });
});

router.post('/fund', function(req, res, next) {
  Fund.find(auth.ownerFilter(req, {name: req.body.name})).count( function(err, count) {
    if (err) { res.send(err); }
    else if (count > 0) {
      res.json({
        errors: {
          name: {
            message: "Fund name must be unique",
            name: "ValidationError",
            properties: { type: "unique", message: "Fund name must be unique", path: "name"},
            kind: "unique",
            path: "name",
            value: req.body.name }},
        message: "Fund validation failed",
        name: "ValidationError" });
    } else {
      var row = new Fund({ name: req.body.name, features: req.body.features, defaultValue: req.body.defaultValue, _aud: auth.createAudit(req), _acl: auth.createACL(req)});
      //console.log('row='+JSON.stringify(row));
      row.save(function (err, row2) {
        //console.log(err);
        if (err) res.send(err);
        res.json(row2);
      });
    }
  });
});

router.route('/fund/:id')
  .get(function(req, res, next) {
    Fund.findOne(auth.addFilters(req, {_id: req.params.id}), function(err, row) {
    if (err) { res.send(err); }
    else if (row==null) { res.sendStatus(404); }
    else {
      res.json(row);
    }
    });
  })
  .put(function(req, res, next) {
    Fund.findOne(auth.addFilters(req, {_id: req.params.id}), function(err, row) {
      if (err) { res.send(err); }
      else if (row==null) { res.sendStatus(404); }
      else {
        Fund.find(auth.ownerFilter(req, {name: req.body.name, _id: {$ne: req.params.id}})).count( function(err, count) {
          if (err) { res.send(err); }
          else if (count > 0) {
            res.json({
              errors: {
                name: {
                  message: "Fund name must be unique",
                  name: "ValidationError",
                  properties: { type: "unique", message: "Fund name must be unique", path: "name"},
                  kind: "unique",
                  path: "name",
                  value: req.body.name }},
              message: "Fund validation failed",
              name: "ValidationError" });
          } else {
            row.name = req.body.name;
            row.features = req.body.features;
            row.defaultValue = req.body.defaultValue;
            row._aud = auth.updateAudit(req, row._aud);
            row.save(function (err, row2) {
              if (err) res.send(err);
              res.json(row2);
            });
          }
        });
      }
    });
  })
  .delete(function(req, res, next) {
    //TO DO: cascade delete of accounts etc
    Fund.findOne(auth.addFilters(req, {_id: req.params.id}), function(err, row) {
      if (err) { res.send(err); }
      else if (row==null) { res.sendStatus(404); }
      else {
        row.removeChildren(function () {
          row.remove(function () {
            res.json(row);
          });
        });
      }
    });
  });

//ACCOUNT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.get('/accounts', function(req, res, next) {
  Account.find(auth.addFilters(req, req.query), function(err, rows) {
    if (err) { res.send(err); }
    else {
      res.json(rows);
    }
  });
});

router.post('/account', function(req, res, next) {
  Account.find(auth.ownerFilter(req, {fund_id: req.body.fund_id, name: req.body.name})).count( function(err, count) {
    if (err) { res.send(err); }
    else if (count > 0) {
      res.json({
        errors: {
          name: {
            message: "Account name must be unique",
            name: "ValidationError",
            properties: { type: "unique", message: "Account name must be unique", path: "name"},
            kind: "unique",
            path: "name",
            value: req.body.name }},
        message: "Account validation failed",
        name: "ValidationError" });
    } else {
      var row = new Account({ name: req.body.name, fund_id: req.body.fund_id, balance: 0, defaultValue: req.body.defaultValue, _aud: auth.createAudit(req), _acl: auth.createACL(req)});
      //console.log('row='+JSON.stringify(row));
      row.save(function (err, row2) {
        if (err) res.send(err);
        res.json(row2);
      });
    }
  });
});

router.route('/account/:id')
  .get(function(req, res, next) {
    Account.findOne(auth.addFilters(req, {_id: req.params.id}), function(err, row) {
      if (err) res.send(err);
      res.json(row);
    });
  })
  .put(function(req, res, next) {
    Account.findOne(auth.addFilters(req, {_id: req.params.id}), function(err, row) {
      if (err) { res.send(err); }
      else if (row==null) { res.sendStatus(404); }
      else {
        Account.find(auth.ownerFilter(req, {name: req.body.name, fund_id: row.fund_id, _id: {$ne: req.params.id}})).count( function(err, count) {
          if (err) { res.send(err); }
          else if (count > 0) {
            res.json({
              errors: {
                name: {
                  message: "Account name must be unique",
                  name: "ValidationError",
                  properties: { type: "unique", message: "Account name must be unique", path: "name"},
                  kind: "unique",
                  path: "name",
                  value: req.body.name }},
              message: "Account validation failed",
              name: "ValidationError" });
          } else {
            if (err) res.send(err);
            if (req.body.name) { row.name = req.body.name; }
            if (req.body.defaultValue) { row.defaultValue = req.body.defaultValue; }
            row._aud = auth.updateAudit(req, row._aud);
            row.save(function (err, row2) {
              if (err) res.send(err);
              res.json(row2);
            });
          }
        });
      }
    });
  })
  .delete(function(req, res, next) {
    Account.findOne(auth.addFilters(req, {_id: req.params.id}), function(err, row) {
      if (err) res.send(err);
      row.removeChildren(function () {
        row.remove(function () {
          res.json(row);
        });
      });
    });
  });

//TASK ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.get('/tasks', function(req, res, next) {
console.log('tasks: query='+JSON.stringify(req.query));
  Task.find(auth.addFilters(req, req.query), function(err, rows) {
    if (err) res.send(err);
    res.json(rows);
  });
});

router.post('/task', function(req, res, next) {
  Task.find(auth.ownerFilter(req, {parent_ref: req.body.parent_ref, parent_id: req.body.parent_id, name: req.body.name})).count( function(err, count) {
    if (err) { res.send(err); }
    else if (count > 0) {
      res.json({
        errors: {
          name: {
            message: "Task name must be unique",
            name: "ValidationError",
            properties: { type: "unique", message: "Task name must be unique", path: "name"},
            kind: "unique",
            path: "name",
            value: req.body.name }},
        message: "Task validation failed",
        name: "ValidationError" });
    } else {
      var row = new Task({ name: req.body.name, value: req.body.value, parent_ref: req.body.parent_ref, parent_id: req.body.parent_id,  _aud: auth.createAudit(req), _acl: auth.createACL(req)});
      console.log('row='+JSON.stringify(row));
      row.save(function (err, row2) {
        if (err) res.send(err);
        res.json(row2);
      });
    }
  });
});

router.route('/task/:id')
  .get(function(req, res, next) {
    Task.findOne(auth.addFilters(req, {_id: req.params.id}), function(err, row) {
      if (err) res.send(err);
      res.json(row);
    });
  })
  .put(function(req, res, next) {
    Task.findOne(auth.addFilters(req, {_id: req.params.id}), function(err, row) {
      if (err) { res.send(err); }
      else if (row==null) { res.sendStatus(404); }
      else {
        Task.find(auth.ownerFilter(req, {name: req.body.name, parent_ref: row.parent_ref, parent_id: row.parent_id, _id: {$ne: req.params.id}})).count( function(err, count) {
          if (err) { res.send(err); }
          else if (count > 0) {
            res.json({
              errors: {
                name: {
                  message: "Task name must be unique",
                  name: "ValidationError",
                  properties: { type: "unique", message: "Task name must be unique", path: "name"},
                  kind: "unique",
                  path: "name",
                  value: req.body.name }},
              message: "Task validation failed",
              name: "ValidationError" });
          } else {
            if (err) res.send(err);
            if (req.body.name) { row.name = req.body.name; }
            if (req.body.value) { row.value = req.body.value; }
            row._aud = auth.updateAudit(req, row._aud);
            row.save(function (err, row2) {
              if (err) res.send(err);
              res.json(row2);
            });
          }
        });
      }
    });
  })
  .delete(function(req, res, next) {
    Task.findOneAndRemove(auth.addFilters(req, {_id: req.params.id}), function(err, row) {
      if (err) res.send(err);
      res.json(row);
    });
  });

//TRANSACTION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.get('/transactions', function(req, res, next) {
  //TO DO: check account_id is provided
  var options = req.query._options;
  delete req.query._options;
  var orderBy = options?options.sort:undefined;
  var maxRows = options?(options.limit?parseInt(options.limit):undefined):undefined;
  Transaction.find(auth.addFilters(req, req.query)).sort(orderBy).limit(maxRows).exec( function(err, rows) { //{applied: -1}
    //console.log('err='+err);
    if (err) res.send(err);
    res.json(rows);
  });
});

router.post('/transaction', function(req, res, next) {
  //TO DO: check account_id is provided
  Account.findOne(auth.addFilters(req, {_id: req.body.account_id}), function(err, acc) {
    if (err) res.send(err);
    acc.balance += parseFloat(req.body.amount);
    acc._aud = auth.updateAudit(req, acc._aud);
    acc.save(function (err, acc) {
      if (err) res.send(err);
      var now = new Date();
      var row = new Transaction({ comment: req.body.comment, amount: req.body.amount, account_id: req.body.account_id, applied: now, _aud: auth.createAudit(req), _acl: auth.createACL(req)});
      //console.log('row='+JSON.stringify(row));
      row.save(function (err, row2) {
        if (err) res.send(err);
        row2.balance = acc.balance;
        //console.log('row2='+JSON.stringify(row2));
        res.json(row2);
      });
    });
  });
});

module.exports = router;
