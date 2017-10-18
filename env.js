var mongoose = require('mongoose');

//helper object to manage the environment configuration
var env = {

  //get IP and port from the environment for OpenShift, or use localhost
  ipaddress: process.env.IP   || process.env.OPENSHIFT_NODEJS_IP   || "127.0.0.1",
  port: process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
  isLocalhost: function() {if (process.env.OPENSHIFT_NODEJS_IP) return false; else return true; },

  //get the mongoose connection, either via OpenShift or on localhost
  getConnection: function(next) {
	  var mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL;
	  var mongoURLLabel = "";
    if(mongoURL == null && process.env.DATABASE_SERVICE_NAME){
		  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
      mongoUser = process.env[mongoServiceName + '_USER'];

		  if (mongoHost && mongoPort && mongoDatabase) {
		    mongoURLLabel = mongoURL = 'mongodb://';
		    if (mongoUser && mongoPassword) {
		      mongoURL += mongoUser + ':' + mongoPassword + '@';
		    }
		    // Provide UI label that excludes user id and pw
		    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
		    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
		
		  }
      connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
      process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
      process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
      process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
      process.env.OPENSHIFT_APP_NAME;
    } else {
			mongoURL = '127.0.0.1:27017/ketmodev';
		}
    //connect to the mongo database...
    mongoose.connect(mongoURL);
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
