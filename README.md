To remind myself what does what...

To start the app:
nodemon server.js

server.js - builds the app
env.js - handles the environment, including connection to MongoDB, and starts the app
services.js - defines and implements the service APIs that read from and write to the database, published as /api/...
model/* - defines the data model using mongoose
public/* - public html etc

auth/* - handles authentication, authorization and auditing
  acl.js - model for ACL embedded object
  audit.js - model for Audit embedded object
  auth.js - back end utilities for authentication, authorization and auditing
  auth-router.js - back end API for session management
  session.js - model for Session management
  user.js - model for User
auth/public/* - client side session management
ketmoAuth.js - stub for application-specific authorization logic

test/* - backend tests
  To execute:
  (need to have server running first)
   mocha

test/public/* - client tests, published as /test


