var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

//define the model for Session
var schema = mongoose.Schema({
    user: { type: ObjectId, required: true },
    token: String,
    expires: Date
});

schema.pre('save',function(next) {
  //console.log('session.preSave');
  if (!this.expires) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (1*24*60*60*1000));
    this.expires = expires;
  }
  next();
});

schema.USER_SELECT = 'username provider email';


var model = mongoose.model('Session', schema);
module.exports = model;
