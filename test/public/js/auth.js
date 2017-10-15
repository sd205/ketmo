console.log("test/auth.js");
//override auth for testing
var auth = {

  getSession: function(next) {
    auth.user = 'test';
    auth.username = 'test';
    next();
  },

  signOut: function(next) {
    console.log('test.auth.signOut');
    next();
  },
  
  isSignedInValue: true,

  isSignedIn: function() {
    return this.isSignedInValue;
  }
};

