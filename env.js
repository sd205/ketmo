//console.log("env.js");
var mongoose = require('mongoose');

//helper object to manage the environment configuration
var env = {

  //get IP and port from the environment for OpenShift, or use localhost
  ipaddress: process.env.IP   || process.env.OPENSHIFT_NODEJS_IP   || "127.0.0.1",
  port: process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
  isLocalhost: function() {if (process.env.OPENSHIFT_NODEJS_IP) return false; else return true; },

  //get the mongoose connection, either via OpenShift or on localhost
  getConnection: function(next) {
//console.log("env.getConnection");

	  var mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL;

    if(mongoURL == null && process.env.DATABASE_SERVICE_NAME){
		  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
      mongoUser = process.env[mongoServiceName + '_USER'];

		  if (mongoHost && mongoPort && mongoDatabase) {
        mongoURL = 'mongodb://';
		    if (mongoUser && mongoPassword) {
		      mongoURL += mongoUser + ':' + mongoPassword + '@';
		    }
		    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

		  }

    } else {
			mongoURL = 'mongodb://127.0.0.1:27017/ketmodev';
		}

	  mongoose.connect(mongoURL, function(err) {
	    if (err) {
	      console.log('Error connecting to Mongo. Message:\n'+err);
	      return;
	    }

	    console.log('Connected to MongoDB at: %s', mongoURL);
	    next();
	  });
  },

  //close the mongoose connection
  closeConnection: function(next) {
    mongoose.disconnect(next);
  },

  //start the app
  start: function(app) {
//console.log("env.start");
    app.set('ipaddress', this.ipaddress);
    app.set('port', this.port);

    this.getConnection( function() {
      app.listen(app.get('port'), app.get('ipaddress'), function() { console.log('%s: Node server started on %s:%d ...', Date(Date.now() ), app.get('ipaddress'), app.get('port')); });
    });
  }
}

module.exports = env
