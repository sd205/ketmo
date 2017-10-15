var assert = chai.assert;
var expect = chai.expect;

describe("public/auth", function() {
/*
    it("isSignedIn=false", function(done) {
      assert.equal(auth.isSignedIn(), false);
      done();
    });
*/
    it("getSession, isSignedIn=true", function(done) {
      auth.getSession( function() {
        assert.equal(auth.isSignedIn(), true);
        //console.log(auth.user);
        done();
      });
    });
/*
    it("signOut, isSignedIn=false", function(done) {
      auth.getSession( function() {
        auth.signOut( function() {
          assert.equal(auth.isSignedIn(), false);
          done();
        });
      });
    });
*/
});
