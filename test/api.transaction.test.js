var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var helper = require('./helper');

describe("api/transaction(s)", function() {

  var baseRequest1;
  var baseRequest2;

  before(function(done) {
    var reqs = {user:[]};
    helper.before( function() {
      helper.getNewUserRequest(reqs, function() {
        helper.getNewUserRequest(reqs, function() {
          baseRequest1 = reqs.user[0];
          baseRequest2 = reqs.user[1];
          done();
        });
      });
    });
  });

  after(function(done) {
    // runs after all tests in this block
    helper.after(done);
  });


  var fund1_id;
  var acc1_id;
  var tx1_id;
  var tx2_id;

  it("POST   /api/fund (Fund 1)", function(done) {
    baseRequest1.post(helper.base_url+'api/fund', {form: {name:'Fund 1', defaultValue: 1.5, features: 5}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.name,'Fund 1');
      fund1_id = obj._id;
      done();
    });
  });

  it("POST   /api/account (Acc 1)", function(done) {
    baseRequest1.post(helper.base_url+'api/account', {form: {name:'Acc 1', defaultValue: 1.5, fund_id: fund1_id}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.name,'Acc 1');
      assert.equal(obj.balance,0);
      acc1_id = obj._id;
      done();
    });
  });

  it("GET    /api/account/:id (balance = 0)", function(done) {
    baseRequest1.get(helper.base_url+'api/account/'+acc1_id, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.balance,0);
      done();
    });
  });

  it("GET    /api/transactions?account_id=<Acc 1> (empty)", function(done) {
    baseRequest1.get(helper.base_url+'api/transactions?account_id='+acc1_id, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      assert.equal(body,'[]');
      done();
    });
  });

  it("POST   /api/transaction (Tx 1  +1)", function(done) {
    baseRequest1.post(helper.base_url+'api/transaction', {form: {comment:'Tx 1', amount: 1, account_id: acc1_id}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.comment,'Tx 1');
      assert.equal(obj.account_id,acc1_id);
      assert.equal(obj.amount,1);
      assert.typeOf(obj._id,'string');
      assert.typeOf(obj._aud.createUser,'string');
      assert.typeOf(obj._aud.updateUser,'string');
      assert.typeOf(obj._aud.createDate,'string');
      assert.typeOf(obj._aud.updateDate,'string');
      assert.typeOf(obj._acl.owner,'string');
      tx1_id = obj._id;
      createDate = obj._aud.createDate;
      updateDate = obj._aud.updateDate;
      done();
    });
  });

  it("GET    /api/transactions?account_id=<Acc 1> (1 row)", function(done) {
    baseRequest1.get(helper.base_url+'api/transactions?account_id='+acc1_id, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var arr = JSON.parse(body);
      assert.equal(arr.length,1);
      assert.equal(arr[0].comment,'Tx 1');
      assert.equal(arr[0]._id,tx1_id);
      done();
    });
  });

  it("GET    /api/account/:id (balance = 1)", function(done) {
    baseRequest1.get(helper.base_url+'api/account/'+acc1_id, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.balance,1);
      done();
    });
  });

  it("POST   /api/transaction (Tx 2  -1.5)", function(done) {
    baseRequest1.post(helper.base_url+'api/transaction', {form: {comment:'Tx 2', amount: -1.5, account_id: acc1_id}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.comment,'Tx 2');
      assert.equal(obj.account_id,acc1_id);
      assert.equal(obj.amount,-1.5);
      assert.typeOf(obj._id,'string');
      tx2_id = obj._id;
      done();
    });
  });

  it("GET    /api/account/:id (balance = -0.5)", function(done) {
    baseRequest1.get(helper.base_url+'api/account/'+acc1_id, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.balance,-0.5);
      done();
    });
  });


  it("GET    /api/transaction/:id (Tx 1  404)", function(done) {
    baseRequest1.get(helper.base_url+'api/transaction/'+tx1_id, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 404);
      done();
    });
  });

  it("PUT    /api/transaction/:id (Tx 1  404)", function(done) {
    baseRequest1.put(helper.base_url+'api/transaction/'+tx1_id, {form: {comment:'CHANGED', amount: 0}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 404);
      done();
    });
  });

  it("DELETE /api/transaction/:id (Tx 1  404)", function(done) {
    baseRequest1.delete(helper.base_url+'api/transaction/'+tx1_id, {form: {comment:'CHANGED', amount: 0}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 404);
      done();
    });
  });
});

