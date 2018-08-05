var mongoose = require('mongoose');

var profileSchema = mongoose.Schema({
    name: String,
    score: Number,
    profileType: String
});

module.exports = mongoose.model('Profile', profileSchema);