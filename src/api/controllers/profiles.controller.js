var _ = require('lodash');
var Profile = require('../models/profile.js');
var Question = require('../models/question.js')
var async = require('async');
var mongoose = require('mongoose');

module.exports = function (app) {

    app.get('/profile', function (req, res) {
        Profile.find(function (err, profiles) {
            if(err){
                res.json({error: err});
            }
            res.json({data: profiles});
        })
    });

    app.post('/profile', function (req, res) {
        var newProfile = new Profile(req.body);
        newProfile.save(function (err) {
            if(err){
                res.json({error: err});
            };
            res.json({result: 'Profile created'});

        })
    });

    app.get('/question', function (req, res) {
        Question.find(function (err, profiles) {
            if(err){
                res.json({error: err});
            }
            res.json({data: profiles});
        })
    });

    app.post('/question', function (req, res) {
        var newQuestion = new Question(req.body);
        newQuestion.save(function (err) {
            if(err){
                res.json({error: err});
            };
            res.json({result: 'Question created'});

        })
    });

    app.post('/submitanswers', function (req, res) {
        var totalPoints=0;
        async.each(req.body.answers, function (answer, callback) {
            Question.find(
                {'_id': mongoose.Types.ObjectId(answer.questionID), 'options.option': answer.selectedOption},
                {"options.$" : 1}
                ,function (err, question) {
                if(err){
                    callback({error: err});
                    return;
                }else {
                    totalPoints += question[0].options[0].points;
                    callback(null, question);
                }
            })
        }, function (err) {
            var newProfile = new Profile({
                name: req.body.name,
                score: totalPoints,
                profileType: calculateProfile(totalPoints)
            });
            newProfile.save(function (err) {
                if(err){
                    res.json({error: err});
                };

            })
            res.json({data: newProfile});
        });
    });

    function calculateProfile(points){
        if(points>=8){return 'A'};
        if(points>=6){return 'B'};
        if(points>=4){return 'C'};
        if(points>=2){return 'D'};
        if(points>=0){return 'F'};
    }

};