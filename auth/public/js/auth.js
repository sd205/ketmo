console.log("auth.js");
var auth = {

  getSession: function(next) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/auth');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
      console.log('session=' + xhr.responseText);
      if (xhr.responseText.length>0) {
        var session = JSON.parse(xhr.responseText);
        auth.user = session.user;
        auth.username = auth.user.username;
        //console.log('Signed in as: ' + auth.username);
      }
      next();
    }
    xhr.send();
  },

  signinGoogle: function(googleUser, next) {
    var id_token = googleUser.getAuthResponse().id_token;
    var d = new Date();
    d.setTime(d.getTime() + (1*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/auth/google');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
      //console.log('session=' + xhr.responseText);
      var session = JSON.parse(xhr.responseText);
      auth.user = session.user;
      document.cookie = "ketmo_sessionid="+session._id+";" + expires + ";path=/";
      console.log('Signed in as: ' + auth.user.username);
      if (next) {
        next();
      } else {
        location.reload();
      }
    };
    xhr.send('idtoken=' + id_token);
  },
  
  signOut: function(next) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/auth/signout');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
      console.log('logout=' + xhr.responseText);

      if (auth.user.provider=='google') {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
          document.cookie = "ketmo_sessionid=;expires=" + (new Date(0).toUTCString()) + ";path=/";
          auth.user=null;
          console.log('User signed out.');
          if (next) {
            next();
          } else {
            location.reload();
          }
        });
      } else {
        console.log('Provider not matched: '+auth.user.provider);
      }
    }
    xhr.send();
  },
  
  isSignedIn: function() {
    if (auth.user === undefined) return false;
    return true;
  }
};

