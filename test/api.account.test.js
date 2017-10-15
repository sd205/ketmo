var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var helper = require('./helper');

describe("api/account(s)", function() {

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
  var createDate;
  var updateDate;
  var acc2_id;
  var fund2_id;

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

  it("GET    /api/accounts?fund_id=... (empty)", function(done) {
    baseRequest1.get(helper.base_url+'api/accounts?fund_id='+fund1_id, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      assert.equal(body,'[]');
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
      assert.equal(obj.fund_id,fund1_id);
      assert.equal(obj.defaultValue,1.5);
      assert.equal(obj.balance,0);
      assert.typeOf(obj._id,'string');
      assert.typeOf(obj._aud.createUser,'string');
      assert.typeOf(obj._aud.updateUser,'string');
      assert.typeOf(obj._aud.createDate,'string');
      assert.typeOf(obj._aud.updateDate,'string');
      assert.typeOf(obj._acl.owner,'string');
      acc1_id = obj._id;
      createDate = obj._aud.createDate;
      updateDate = obj._aud.updateDate;
      done();
    });
  });

  it("GET    accounts?fund_id=... (Acc 1)", function(done) {
    baseRequest1.get(helper.base_url+'api/accounts?fund_id='+fund1_id, function(error, response, body) {
      var arr = JSON.parse(body);
//console.log(body);
      assert.equal(response.statusCode, 200);
      assert.equal(arr.length,1);
      assert.equal(arr[0].name,'Acc 1');
      assert.equal(arr[0]._id,acc1_id);
      done();
    });
  });

  it("GET    /api/funds (empty) USER 2", function(done) {
    baseRequest2.get(helper.base_url+'api/accounts?fund_id='+fund1_id, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      assert.equal(body,'[]');
      done();
    });
  });

  it("PUT    /api/account/:id (The First Account)", function(done) {
    baseRequest1.put(helper.base_url+'api/account/'+acc1_id, {form: {name:'The First Account', defaultValue: 0.5}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.name,'The First Account');
      assert.equal(obj.fund_id,fund1_id);
      assert.equal(obj.defaultValue,0.5);
      assert.equal(obj._id,acc1_id);
      assert.equal(obj._aud.createDate,createDate);
      assert.notEqual(obj._aud.updateDate,updateDate);
      done();
    });
  });

  it("PUT    /api/account/:id (balance not changed)", function(done) {
    baseRequest1.put(helper.base_url+'api/account/'+acc1_id, {form: {balance:100, defaultValue: 0.6}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.name,'The First Account');
      assert.equal(obj.balance,0);
      assert.equal(obj.fund_id,fund1_id);
      assert.equal(obj.defaultValue,0.6);
      assert.equal(obj._id,acc1_id);
      assert.equal(obj._aud.createDate,createDate);
      assert.notEqual(obj._aud.updateDate,updateDate);
      done();
    });
  });

  it("PUT    /api/account/:id (fund not changed)", function(done) {
    baseRequest1.put(helper.base_url+'api/account/'+acc1_id, {form: {name:'The First Account', fund_id: 'no such fund'}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.name,'The First Account');
      assert.equal(obj.fund_id,fund1_id);
      assert.equal(obj.balance,0);
      assert.equal(obj.defaultValue,0.6);
      assert.equal(obj._id,acc1_id);
      assert.equal(obj._aud.createDate,createDate);
      assert.notEqual(obj._aud.updateDate,updateDate);
      done();
    });
  });

  it("PUT    /api/account/:id (The First Account) USER 2", function(done) {
    baseRequest2.put(helper.base_url+'api/account/'+acc1_id, {form: {name:'The First Account', defaultValue: 0.5}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 404);
      done();
    });
  });

  it("GET    /api/account/:id (The First Account)", function(done) {
    baseRequest1.get(helper.base_url+'api/account/'+acc1_id, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.name,'The First Account');
      assert.equal(obj.fund_id,fund1_id);
      assert.equal(obj.balance,0);
      assert.equal(obj.defaultValue,0.6);
      assert.equal(obj._id,acc1_id);
      done();
    });
  });

  it("POST   /api/account (Acc 2)", function(done) {
    baseRequest1.post(helper.base_url+'api/account', {form: {name:'Acc 2', defaultValue: 1, fund_id: fund1_id}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.name,'Acc 2');
      assert.equal(obj.fund_id,fund1_id);
      assert.equal(obj.balance,0);
      assert.equal(obj.defaultValue,1);
      assert.typeOf(obj._id,'string');
      acc2_id = obj._id;
      done();
    });
  });

  it("GET    /api/accounts?fund_id=... (two accounts)", function(done) {
    baseRequest1.get(helper.base_url+'api/accounts?fund_id='+fund1_id, function(error, response, body) {
      var arr = JSON.parse(body);
//console.log(body);
      assert.equal(response.statusCode, 200);
      assert.equal(arr.length,2);
      done();
    });
  });

  it("POST   /api/account (Acc 2 - duplicate name)", function(done) {
    baseRequest1.post(helper.base_url+'api/account', {form: {name:'Acc 2', defaultValue: 2, fund_id: fund1_id}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      assert.typeOf(obj.errors,'object');
      assert.equal(obj.errors.name.kind,'unique');
      assert.equal(obj.message,'Account validation failed');
      done();
    });
  });

  it("POST   /api/fund (Fund 2)", function(done) {
    baseRequest1.post(helper.base_url+'api/fund', {form: {name:'Fund 2', defaultValue: 1.5, features: 5}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.name,'Fund 2');
      fund2_id = obj._id;
      done();
    });
  });

  it("POST   /api/account (Acc 2 - Fund 2)", function(done) {
    baseRequest1.post(helper.base_url+'api/account', {form: {name:'Acc 2', defaultValue: 2, fund_id: fund2_id}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.name,'Acc 2');
      assert.equal(obj.fund_id,fund2_id);
      done();
    });
  });


  it("PUT    /api/fund/:id (Acc 2 > The First Account)", function(done) {
    baseRequest1.put(helper.base_url+'api/account/'+acc2_id, {form: {name:'The First Account', defaultValue: 0.5}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      assert.typeOf(obj.errors,'object');
      assert.equal(obj.errors.name.kind,'unique');
      assert.equal(obj.message,'Account validation failed');
      done();
    });
  });

  it("POST   /api/account (missing name)", function(done) {
    baseRequest1.post(helper.base_url+'api/account', {form: {defaultValue: 2, fund_id: fund2_id}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      assert.typeOf(obj.errors,'object');
      assert.equal(obj.errors.name.kind,'required');
      assert.equal(obj.message,'Account validation failed');
      done();
    });
  });

  it("POST   /api/account (empty name)", function(done) {
    baseRequest1.post(helper.base_url+'api/account', {form: {name: '', defaultValue: 2, fund_id: fund2_id}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      assert.typeOf(obj.errors,'object');
      assert.equal(obj.errors.name.kind,'required');
      assert.equal(obj.message,'Account validation failed');
      done();
    });
  });

  it("DELETE /api/account/:id (Acc 2)", function(done) {
    baseRequest1.delete(helper.base_url+'api/account/'+acc2_id, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.name,'Acc 2');
      assert.equal(obj._id,acc2_id);
      done();
    });
  });
});

