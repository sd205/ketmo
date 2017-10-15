var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var request = require("request");
var helper = require('./helper');

describe("static", function() {

    it("GET /", function(done) {
      request.get(helper.base_url, function(error, response, body) {
        assert.equal(response.statusCode, 200);
        done();
      });
    });

});
