var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

describe("public/app", function() {

    it("isSignedIn=true", function(done) {
      assert.equal(auth.isSignedIn(), true);
      done();
    });

    it("loadTemplates", function(done) {
      ketmo.loadTemplates(function() {
        should.exist(ketmo.SignUpView);
        should.exist(ketmo.ShellView);
        should.exist(ketmo.FundListItemView);
        should.exist(ketmo.FundView);
        should.exist(ketmo.AccountListItemView);
        should.exist(ketmo.TaskListView);
        should.exist(ketmo.TaskListItemView);
        should.exist(ketmo.AccountView);
        should.exist(ketmo.TransactionListItemView);
        done();
      });
    });

    it("checkUser (true)", function(done) {
      assert.equal(auth.isSignedIn(), true);
      ketmo.checkUser(function() {
        done();
      }).apply();
    });

    it("checkUser (false)", function(done) {
      auth.isSignedInValue = false;
      assert.equal(auth.isSignedIn(), false);
      ketmo.checkUser(function() {
        done();
      }).apply();
    });
});
