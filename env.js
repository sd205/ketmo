var mongoose = require('mongoose');

//helper object to manage the environment configuration
var env = {

  //get IP and port from the environment for OpenShift, or use localhost
  ipaddress: process.env.OPENSHIFT_NODEJS_IP   || "127.0.0.1",
  port: process.env.OPENSHIFT_NODEJS_PORT || 8080,
  isLocalhost: function() {if (process.env.OPENSHIFT_NODEJS_IP) return false; else return true; },

  //get the mongoose connection, either via OpenShift or on localhost
  getConnection: function(next) {
    var connection_string = '127.0.0.1:27017/ketmodev';
    if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
      connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
      process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
      process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
      process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
      process.env.OPENSHIFT_APP_NAME;
    }
    //connect to the mongo database...
    mongoose.connect('mongodb://'+connection_string);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
      next();
    });

  },

  //close the mongoose connection
  closeConnection: function(next) {
    mongoose.disconnect(next);
  },

  //start the app
  start: function(app) {
    app.set('ipaddress', this.ipaddress);
    app.set('port', this.port);

    this.getConnection( function() {
      app.listen(app.get('port'), app.get('ipaddress'), function() { console.log('%s: Node server started on %s:%d ...', Date(Date.now() ), app.get('ipaddress'), app.get('port')); });
    });
  }
}

module.exports = env
