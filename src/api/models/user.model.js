var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    user: String,
    acquaintance: [{user:String, isFriend:Boolean, subscribed: Boolean, blocked: Boolean}]
});

module.exports = mongoose.model('User', userSchema);