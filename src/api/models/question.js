var mongoose = require('mongoose');

var questionSchema = mongoose.Schema({
    qtnText: String,
    options: [{option:String, points:Number}]
});

module.exports = mongoose.model('Question', questionSchema);