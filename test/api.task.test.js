var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var helper = require('./helper');

describe("api/task(s)", function() {

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
  var fundreward1_id;
  var fundpenalty1_id;
  var accreward1_id;
  var accpenalty1_id;
  var createDate;
  var updateDate;
  var acc2_id;
  var fund2_id;
  var acc2reward1_id;
  var acc2reward2_id;

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

  it("GET    /api/tasks?parent_ref=fund&parent_id=<Fund 1> (empty)", function(done) {
    baseRequest1.get(helper.base_url+'api/tasks?parent_ref=fund&parent_id='+fund1_id, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      assert.equal(body,'[]');
      done();
    });
  });

  it("POST   /api/task (Fund Reward 1)", function(done) {
    baseRequest1.post(helper.base_url+'api/task', {form: {name:'Fund Reward 1', value: 1, parent_ref: 'fund', parent_id: fund1_id}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.name,'Fund Reward 1');
      assert.equal(obj.parent_ref,'fund');
      assert.equal(obj.parent_id,fund1_id);
      assert.equal(obj.value,1);
      assert.typeOf(obj._id,'string');
      assert.typeOf(obj._aud.createUser,'string');
      assert.typeOf(obj._aud.updateUser,'string');
      assert.typeOf(obj._aud.createDate,'string');
      assert.typeOf(obj._aud.updateDate,'string');
      assert.typeOf(obj._acl.owner,'string');
      fundreward1_id = obj._id;
//      createDate = obj._aud.createDate;
//      updateDate = obj._aud.updateDate;
      done();
    });
  });

  it("GET    /api/tasks?parent_ref=fund&value[$gt]=0&parent_id=<Fund 1> (1 row)", function(done) {
    baseRequest1.get(helper.base_url+"api/tasks?parent_ref=fund&value%5B%24gt%5D=0&parent_id="+fund1_id, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var arr = JSON.parse(body);
      assert.equal(arr.length,1);
      assert.equal(arr[0].name,'Fund Reward 1');
      assert.equal(arr[0]._id,fundreward1_id);
      done();
    });
  });

  it("GET    /api/tasks?parent_ref=fund&value[$lte]=0&parent_id=<Fund 1> (empty)", function(done) {
    baseRequest1.get(helper.base_url+"api/tasks?parent_ref=fund&value%5B%24lte%5D=0&parent_id="+fund1_id, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var arr = JSON.parse(body);
      assert.equal(arr.length,0);
      done();
    });
  });

  it("POST   /api/task (Fund Penalty 1)", function(done) {
    baseRequest1.post(helper.base_url+'api/task', {form: {name:'Fund Penalty 1', value: -1, parent_ref: 'fund', parent_id: fund1_id}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.name,'Fund Penalty 1');
      assert.equal(obj.parent_ref,'fund');
      assert.equal(obj.parent_id,fund1_id);
      assert.equal(obj.value,-1);
      assert.typeOf(obj._id,'string');
      assert.typeOf(obj._aud.createUser,'string');
      assert.typeOf(obj._aud.updateUser,'string');
      assert.typeOf(obj._aud.createDate,'string');
      assert.typeOf(obj._aud.updateDate,'string');
      assert.typeOf(obj._acl.owner,'string');
      fundpenalty1_id = obj._id;
//      createDate = obj._aud.createDate;
//      updateDate = obj._aud.updateDate;
      done();
    });
  });

  it("GET    /api/tasks?parent_ref=fund&value[$lte]=0&parent_id=<Fund 1> (1 row)", function(done) {
    baseRequest1.get(helper.base_url+"api/tasks?parent_ref=fund&value%5B%24lte%5D=0&parent_id="+fund1_id, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var arr = JSON.parse(body);
      assert.equal(arr.length,1);
      assert.equal(arr[0].name,'Fund Penalty 1');
      assert.equal(arr[0]._id,fundpenalty1_id);
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
      acc1_id = obj._id;
      done();
    });
  });

  it("GET    /api/tasks?parent_ref=account&parent_id=<Acc 1> (empty)", function(done) {
    baseRequest1.get(helper.base_url+'api/tasks?parent_ref=account&parent_id='+acc1_id, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      assert.equal(body,'[]');
      done();
    });
  });

  it("POST   /api/task (Acc Reward 1)", function(done) {
    baseRequest1.post(helper.base_url+'api/task', {form: {name:'Acc Reward 1', value: 1, parent_ref: 'account', parent_id: acc1_id}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.name,'Acc Reward 1');
      assert.equal(obj.parent_ref,'account');
      assert.equal(obj.parent_id,acc1_id);
      assert.equal(obj.value,1);
      assert.typeOf(obj._id,'string');
      assert.typeOf(obj._aud.createUser,'string');
      assert.typeOf(obj._aud.updateUser,'string');
      assert.typeOf(obj._aud.createDate,'string');
      assert.typeOf(obj._aud.updateDate,'string');
      assert.typeOf(obj._acl.owner,'string');
      accreward1_id = obj._id;
      createDate = obj._aud.createDate;
      updateDate = obj._aud.updateDate;
      done();
    });
  });

  it("GET    /api/tasks?parent_ref=account&value[$gt]=0&parent_id=<Acc 1> (1 row)", function(done) {
    baseRequest1.get(helper.base_url+"api/tasks?parent_ref=account&value%5B%24gt%5D=0&parent_id="+acc1_id, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var arr = JSON.parse(body);
      assert.equal(arr.length,1);
      assert.equal(arr[0].name,'Acc Reward 1');
      assert.equal(arr[0]._id,accreward1_id);
      done();
    });
  });

  it("GET    /api/tasks?parent_ref=account&value[$lte]=0&parent_id=<Acc 1> (empty)", function(done) {
    baseRequest1.get(helper.base_url+"api/tasks?parent_ref=account&value%5B%24lte%5D=0&parent_id="+acc1_id, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var arr = JSON.parse(body);
      assert.equal(arr.length,0);
      done();
    });
  });

  it("POST   /api/task (Acc Penalty 1)", function(done) {
    baseRequest1.post(helper.base_url+'api/task', {form: {name:'Acc Penalty 1', value: -1, parent_ref: 'account', parent_id: acc1_id}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.name,'Acc Penalty 1');
      assert.equal(obj.parent_ref,'account');
      assert.equal(obj.parent_id,acc1_id);
      assert.equal(obj.value,-1);
      assert.typeOf(obj._id,'string');
      assert.typeOf(obj._aud.createUser,'string');
      assert.typeOf(obj._aud.updateUser,'string');
      assert.typeOf(obj._aud.createDate,'string');
      assert.typeOf(obj._aud.updateDate,'string');
      assert.typeOf(obj._acl.owner,'string');
      accpenalty1_id = obj._id;
//      createDate = obj._aud.createDate;
//      updateDate = obj._aud.updateDate;
      done();
    });
  });

  it("GET    /api/tasks?parent_ref=account&value[$lte]=0&parent_id=<Acc 1> (1 row)", function(done) {
    baseRequest1.get(helper.base_url+"api/tasks?parent_ref=account&value%5B%24lte%5D=0&parent_id="+acc1_id, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var arr = JSON.parse(body);
      assert.equal(arr.length,1);
      assert.equal(arr[0].name,'Acc Penalty 1');
      assert.equal(arr[0]._id,accpenalty1_id);
      done();
    });
  });

  it("GET    /api/tasks?parent_ref=account&value[$lte]=0&parent_id=<Acc 1> (empty) USER 2", function(done) {
    baseRequest2.get(helper.base_url+"api/tasks?parent_ref=account&value%5B%24lte%5D=0&parent_id="+acc1_id, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var arr = JSON.parse(body);
      assert.equal(arr.length,0);
      done();
    });
  });


  it("PUT    /api/task/:id (The First Account Reward)", function(done) {
    baseRequest1.put(helper.base_url+'api/task/'+accreward1_id, {form: {name:'The First Account Reward', value: 0.5}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.name,'The First Account Reward');
      assert.equal(obj.value,0.5);
      assert.equal(obj.parent_ref,'account');
      assert.equal(obj.parent_id,acc1_id);
      assert.equal(obj._id,accreward1_id);
      assert.equal(obj._aud.createDate,createDate);
      assert.notEqual(obj._aud.updateDate,updateDate);
      done();
    });
  });

  it("PUT    /api/task/:id (parent not changed)", function(done) {
    baseRequest1.put(helper.base_url+'api/task/'+accreward1_id, {form: {parent_ref: 'fund', parent_id: fund1_id}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.name,'The First Account Reward');
      assert.equal(obj.value,0.5);
      assert.equal(obj.parent_ref,'account');
      assert.equal(obj.parent_id,acc1_id);
      assert.equal(obj._id,accreward1_id);
      assert.equal(obj._aud.createDate,createDate);
      assert.notEqual(obj._aud.updateDate,updateDate);
      done();
    });
  });

  it("PUT    /api/task/:id (The First Account Reward) USER 2", function(done) {
    baseRequest2.put(helper.base_url+'api/task/'+accreward1_id, {form: {name:'The First Account Reward', value: 0.5}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 404);
      done();
    });
  });

  it("GET    /api/task/:id (The First Account Reward)", function(done) {
    baseRequest1.get(helper.base_url+'api/task/'+accreward1_id, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.name,'The First Account Reward');
      assert.equal(obj.value,0.5);
      assert.equal(obj.parent_ref,'account');
      assert.equal(obj.parent_id,acc1_id);
      assert.equal(obj._id,accreward1_id);
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

  it("POST   /api/task (Acc 2 Reward 1)", function(done) {
    baseRequest1.post(helper.base_url+'api/task', {form: {name:'Acc 2 Reward 1', value: 1, parent_ref: 'account', parent_id: acc2_id}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.name,'Acc 2 Reward 1');
      assert.equal(obj.parent_ref,'account');
      assert.equal(obj.parent_id,acc2_id);
      assert.equal(obj.value,1);
      assert.typeOf(obj._id,'string');
      assert.typeOf(obj._aud.createUser,'string');
      assert.typeOf(obj._aud.updateUser,'string');
      assert.typeOf(obj._aud.createDate,'string');
      assert.typeOf(obj._aud.updateDate,'string');
      assert.typeOf(obj._acl.owner,'string');
      acc2reward1_id = obj._id;
      done();
    });
  });

  it("POST   /api/task (Acc 2 Reward 2)", function(done) {
    baseRequest1.post(helper.base_url+'api/task', {form: {name:'Acc 2 Reward 2', value: 2, parent_ref: 'account', parent_id: acc2_id}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.name,'Acc 2 Reward 2');
      assert.equal(obj.parent_ref,'account');
      assert.equal(obj.parent_id,acc2_id);
      assert.equal(obj.value,2);
      assert.typeOf(obj._id,'string');
      assert.typeOf(obj._aud.createUser,'string');
      assert.typeOf(obj._aud.updateUser,'string');
      assert.typeOf(obj._aud.createDate,'string');
      assert.typeOf(obj._aud.updateDate,'string');
      assert.typeOf(obj._acl.owner,'string');
      acc2reward2_id = obj._id;
      done();
    });
  });

  it("POST   /api/task (Acc 2 Penalty 1)", function(done) {
    baseRequest1.post(helper.base_url+'api/task', {form: {name:'Acc 2 Penalty 1', value: -1, parent_ref: 'account', parent_id: acc2_id}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.name,'Acc 2 Penalty 1');
      assert.equal(obj.parent_ref,'account');
      assert.equal(obj.parent_id,acc2_id);
      assert.equal(obj.value,-1);
      assert.typeOf(obj._id,'string');
      assert.typeOf(obj._aud.createUser,'string');
      assert.typeOf(obj._aud.updateUser,'string');
      assert.typeOf(obj._aud.createDate,'string');
      assert.typeOf(obj._aud.updateDate,'string');
      assert.typeOf(obj._acl.owner,'string');
      //acc2reward2_id = obj._id;
      done();
    });
  });

  it("GET    /api/tasks?parent_ref=account&value[$gt]=0&parent_id=<Acc 2> (2 rows)", function(done) {
    baseRequest1.get(helper.base_url+"api/tasks?parent_ref=account&value%5B%24gt%5D=0&parent_id="+acc2_id, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var arr = JSON.parse(body);
      assert.equal(arr.length,2);
      assert.equal(arr[0].name,'Acc 2 Reward 1');
      assert.equal(arr[0]._id,acc2reward1_id);
      assert.equal(arr[1].name,'Acc 2 Reward 2');
      assert.equal(arr[1]._id,acc2reward2_id);
      done();
    });
  });

  it("POST   /api/task (Acc 2 Penalty 1 - duplicate name)", function(done) {
    baseRequest1.post(helper.base_url+'api/task', {form: {name:'Acc 2 Penalty 1', value: -1, parent_ref: 'account', parent_id: acc2_id}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      assert.typeOf(obj.errors,'object');
      assert.equal(obj.errors.name.kind,'unique');
      assert.equal(obj.message,'Task validation failed');
      done();
    });
  });

  it("POST   /api/task (The First Account Reward - Acc 2)", function(done) {
    baseRequest1.post(helper.base_url+'api/task', {form: {name:'The First Account Reward', value: 1, parent_ref: 'account', parent_id: acc2_id}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.name,'The First Account Reward');
      assert.equal(obj.parent_ref,'account');
      assert.equal(obj.parent_id,acc2_id);
      assert.equal(obj.value,1);
      assert.typeOf(obj._id,'string');
      assert.typeOf(obj._aud.createUser,'string');
      assert.typeOf(obj._aud.updateUser,'string');
      assert.typeOf(obj._aud.createDate,'string');
      assert.typeOf(obj._aud.updateDate,'string');
      assert.typeOf(obj._acl.owner,'string');
      //acc2reward1_id = obj._id;
      done();
    });
  });

  it("PUT    /api/task/:id (Acc Penalty 1 > The First Account Reward)", function(done) {
    baseRequest1.put(helper.base_url+'api/task/'+accpenalty1_id, {form: {name:'The First Account Reward'}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      assert.typeOf(obj.errors,'object');
      assert.equal(obj.errors.name.kind,'unique');
      assert.equal(obj.message,'Task validation failed');
      done();
    });
  });

  it("POST   /api/task (missing name)", function(done) {
    baseRequest1.post(helper.base_url+'api/task', {form: {value: 1, parent_ref: 'account', parent_id: acc2_id}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      assert.typeOf(obj.errors,'object');
      assert.equal(obj.errors.name.kind,'required');
      assert.equal(obj.message,'Task validation failed');
      done();
    });
  });

  it("POST   /api/task (empty name)", function(done) {
    baseRequest1.post(helper.base_url+'api/task', {form: {name: '', value: 1, parent_ref: 'account', parent_id: acc2_id}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      assert.typeOf(obj.errors,'object');
      assert.equal(obj.errors.name.kind,'required');
      assert.equal(obj.message,'Task validation failed');
      done();
    });
  });

  it("DELETE /api/task/:id (Acc Penalty 1)", function(done) {
    baseRequest1.delete(helper.base_url+'api/task/'+accpenalty1_id, {form: {name:'The First Account Reward'}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.name,'Acc Penalty 1');
      assert.equal(obj._id,accpenalty1_id);
      done();
    });
  });

});

