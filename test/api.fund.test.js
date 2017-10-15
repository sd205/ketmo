var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var helper = require('./helper');

describe("api/fund(s)", function() {

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
  var createDate;
  var updateDate;
  var fund2_id;

  it("GET    /api/funds (empty)", function(done) {
    baseRequest1.get(helper.base_url+'api/funds', function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      assert.equal(body,'[]');
      done();
    });
  });

  it("POST   /api/fund (Fund 1)", function(done) {
    baseRequest1.post(helper.base_url+'api/fund', {form: {name:'Fund 1', defaultValue: 1.5, features: 5}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.name,'Fund 1');
      assert.equal(obj.features,5);
      assert.equal(obj.defaultValue,1.5);
      assert.typeOf(obj._id,'string');
      assert.typeOf(obj._aud.createUser,'string');
      assert.typeOf(obj._aud.updateUser,'string');
      assert.typeOf(obj._aud.createDate,'string');
      assert.typeOf(obj._aud.updateDate,'string');
      assert.typeOf(obj._acl.owner,'string');
      fund1_id = obj._id;
      createDate = obj._aud.createDate;
      updateDate = obj._aud.updateDate;
      done();
    });
  });

  it("GET    /api/funds (Fund 1)", function(done) {
    baseRequest1.get(helper.base_url+'api/funds', function(error, response, body) {
      var arr = JSON.parse(body);
//console.log(body);
      assert.equal(response.statusCode, 200);
      assert.equal(arr.length,1);
      assert.equal(arr[0].name,'Fund 1');
      assert.equal(arr[0]._id,fund1_id);
      done();
    });
  });

  it("GET    /api/funds (empty) USER 2", function(done) {
    baseRequest2.get(helper.base_url+'api/funds', function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      assert.equal(body,'[]');
      done();
    });
  });

  it("PUT    /api/fund/:id (The First Fund)", function(done) {
    baseRequest1.put(helper.base_url+'api/fund/'+fund1_id, {form: {name:'The First Fund', defaultValue: 0.5, features: 61}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.name,'The First Fund');
      assert.equal(obj.features,61);
      assert.equal(obj.defaultValue,0.5);
      assert.equal(obj._id,fund1_id);
      assert.equal(obj._aud.createDate,createDate);
      assert.notEqual(obj._aud.updateDate,updateDate);
      done();
    });
  });

  it("PUT    /api/fund/:id (The First Fund) USER 2", function(done) {
    baseRequest2.put(helper.base_url+'api/fund/'+fund1_id, {form: {name:'The First Fund', defaultValue: 0.5, features: 61}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 404);
      done();
    });
  });

  it("GET    /api/fund/:id (The First Fund)", function(done) {
    baseRequest1.get(helper.base_url+'api/fund/'+fund1_id, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.name,'The First Fund');
      assert.equal(obj.features,61);
      assert.equal(obj.defaultValue,0.5);
      assert.equal(obj._id,fund1_id);
      done();
    });
  });

  it("POST   /api/fund (Fund 2)", function(done) {
    baseRequest1.post(helper.base_url+'api/fund', {form: {name:'Fund 2', defaultValue: 1, features: 9}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.name,'Fund 2');
      assert.equal(obj.features,9);
      assert.equal(obj.defaultValue,1);
      assert.typeOf(obj._id,'string');
      fund2_id = obj._id;
      done();
    });
  });

  it("GET    /api/funds (two funds)", function(done) {
    baseRequest1.get(helper.base_url+'api/funds', function(error, response, body) {
      var arr = JSON.parse(body);
//console.log(body);
      assert.equal(response.statusCode, 200);
      assert.equal(arr.length,2);
      done();
    });
  });

  it("POST   /api/fund (Fund 2 - duplicate name)", function(done) {
    baseRequest1.post(helper.base_url+'api/fund', {form: {name:'Fund 2', defaultValue: 2, features: 17}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      assert.typeOf(obj.errors,'object');
      assert.equal(obj.errors.name.kind,'unique');
      assert.equal(obj.message,'Fund validation failed');
      done();
    });
  });

  it("PUT    /api/fund/:id (Fund 2 > The First Fund)", function(done) {
    baseRequest1.put(helper.base_url+'api/fund/'+fund2_id, {form: {name:'The First Fund', defaultValue: 0.5, features: 61}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      assert.typeOf(obj.errors,'object');
      assert.equal(obj.errors.name.kind,'unique');
      assert.equal(obj.message,'Fund validation failed');
      done();
    });
  });

  it("POST   /api/fund (missing name)", function(done) {
    baseRequest1.post(helper.base_url+'api/fund', {form: {defaultValue: 2, features: 17}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      assert.typeOf(obj.errors,'object');
      assert.equal(obj.errors.name.kind,'required');
      assert.equal(obj.message,'Fund validation failed');
      done();
    });
  });

  it("POST   /api/fund (empty name)", function(done) {
    baseRequest1.post(helper.base_url+'api/fund', {form: {name: '', defaultValue: 2, features: 17}}, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      assert.typeOf(obj.errors,'object');
      assert.equal(obj.errors.name.kind,'required');
      assert.equal(obj.message,'Fund validation failed');
      done();
    });
  });

  it("DELETE /api/fund/:id (Fund 2)", function(done) {
    baseRequest1.delete(helper.base_url+'api/fund/'+fund2_id, function(error, response, body) {
//console.log(body);
      assert.equal(response.statusCode, 200);
      var obj = JSON.parse(body);
      expect(obj).not.to.have.property('errors');
      assert.equal(obj.name,'Fund 2');
      assert.equal(obj.features,9);
      assert.equal(obj.defaultValue,1);
      assert.equal(obj._id,fund2_id);
      done();
    });
  });

});

