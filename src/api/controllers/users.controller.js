var _ = require('lodash');
var User = require('../models/user.model.js');
var async = require('async');
var mongoose = require('mongoose');

module.exports = function (app) {

    app.get('/user', function (req, res) {
        User.find(function (err, users) {
            if(err){
                res.json({error: err});
            }
            res.json({data: users});
        })
    });

    app.post('/user', function (req, res) {
        var newUser = new User(req.body);
        newUser.save(function (err) {
            if(err){
                res.json({error: err});
            };
            res.json({result: 'User created'});

        })
    });

    app.put('/addfriend', function (req, res) {
        var friends = req.body.friends;
        var firstFriend = {user:friends[0], isFriend: true, subscribed: false, blocked: false};
        var secondFriend = {user:friends[1], isFriend: true, subscribed: false, blocked: false};
        var firstRecord;
        var secondRecord;
        let records;
        User.find({'user':{$in: friends}, 'acquaintance.blocked':false})
            .then(function (_records) {
                records = _records
            if (!records || records.length!=2){
                throw "error";
            } else {
                firstRecord = records[0];
                var friend = firstFriend;
                if(firstRecord.user == friend.user){
                    friend = secondFriend;
                }
                friend1Pos = firstRecord.acquaintance.map(acq =>  { return acq.user; }).indexOf(friend.user);
                if(friend1Pos != undefined && friend1Pos >= 0){
                    if(firstRecord.acquaintance[friend1Pos].blocked == true){
                        throw "blocked";
                    }
                    firstRecord.acquaintance[friend1Pos].isFriend = true;
                    firstRecord.save(function (err, reply) {
                        if(err){
                            res.json({"success": false});
                        }
                    });
                }else{
                    firstRecord.acquaintance.addToSet(friend);
                    // firstRecord.save(function (err, reply) {
                    //     if(err){
                    //         res.json({"success": false});
                    //     }
                    // });
                }
            }
        }).then(() => {
            secondRecord = records[1];
            var friend = firstFriend;
            if(secondRecord.user == friend.user){
                friend = secondFriend;
            }
            friendPos = secondRecord.acquaintance.map(acq =>  { return acq.user; }).indexOf(friend.user);
            if(friendPos != undefined && friendPos >= 0){
                if(firstRecord.acquaintance[friend1Pos].blocked == true){
                    throw "blocked";
                }
                secondRecord.acquaintance[friendPos].isFriend = true;
                secondRecord.save(function (err, reply) {
                    if(err){
                        res.json({"success": false});
                    }
                });
            }else{
                secondRecord.acquaintance.addToSet(friend);
                // secondRecord.save(function (err, reply) {
                //     if(err){
                //         res.json({"success": false});
                //     }
                // })
            }
            res.json({"success": true});
        }, ()=>{
            res.json({"success": false});
        }).then(()=>{
            firstRecord.save(function (err, reply) {
                if(err){
                    res.json({"success": false});
                }
            });
            secondRecord.save(function (err, reply) {
                if(err){
                    res.json({"success": false});
                }
            });
        }, ()=>{
            res.json({"success": false});
        });
    });

    app.post('/getfriends', function (req, res) {
        var user = req.body.email;
        return User.aggregate([{$match: {'user': 'user1@test.com'}}
        ,{$project:{'acquaintance':
                {$filter: {
                    input: '$acquaintance',
                    as: 'acq',
                    cond: {$eq: ['$$acq.isFriend', true]}
                }}
            }}
            ])
            .then(foundFriends=>{
                console.log('foundFriends: ', foundFriends);
                var friends = foundFriends[0].acquaintance.map(friendObj => {return friendObj.user});
                res.json({"success": true, "friends": friends, 'count': friends.length});
            })
    });

    app.put('/subscribe', function (req, res) {
        var requestor = req.body.requestor;
        var target = req.body.target;
        var userList = [requestor, target];
        let records;
        User.find({'user':{$in: userList}})
            .then(_records => {
                records = _records
                if (!records || records.length!=2){
                    res.json({"success": false});
                } else {
                    var foundRequestor = records[0];
                    if(foundRequestor.user != requestor.user){
                        foundRequestor = records[1];
                    }
                    friendPos = foundRequestor.acquaintance.map(acq =>  { return acq.user; }).indexOf(target);
                    if(friendPos != undefined && friendPos >= 0){
                        foundRequestor.acquaintance[friendPos].subscribed = true;
                        foundRequestor.save(function (err, reply) {
                            if(err){
                                res.json({"success": false});
                            }
                            res.json({"success": true});
                        })
                    }else{
                        var newAcq = {user:target, isFriend: false, subscribed: true, blocked: false};
                        foundRequestor.acquaintance.addToSet(newAcq);
                        foundRequestor.save(function (err, reply) {
                            if(err){
                                res.json({"success": false});
                            }
                            res.json({"success": true});
                        })
                    }
                }
            }, ()=>{
                res.json({"success": false});
            });
    });

    app.post('/commonfriends', function (req, res) {
        var userList = req.body.friends;
        let records;
        User.find({'user':{$in: userList}})
            .then(_records => {
                records = _records
                if (!records || records.length!=2){
                    res.json({"success": false});
                } else {
                    var acqList1 = records[0].acquaintance;
                    var acqList2 = records[1].acquaintance;
                    var result = _.intersectionBy(acqList1, acqList2, 'user');
                    res.json({"success": true, "friends": result, "count": result.length});
                }
            }, ()=>{
                res.json({"success": false});
            });
    });

    app.put('/block', function (req, res) {
        var requestor = req.body.requestor;
        var target = req.body.target;
        var userList = [requestor, target];
        let records;
        User.find({'user':{$in: userList}})
            .then(_records => {
                records = _records
                if (!records || records.length!=2){
                    res.json({"success": false});
                } else {
                    var foundRequestor = records[0];
                    if(foundRequestor.user != requestor.user){
                        foundRequestor = records[1];
                    }
                    friendPos = foundRequestor.acquaintance.map(acq =>  { return acq.user; }).indexOf(target);
                    if(friendPos != undefined && friendPos >= 0){
                        foundRequestor.acquaintance[friendPos].blocked = true;
                        foundRequestor.save(function (err, reply) {
                            if(err){
                                res.json({"success": false});
                            }
                            res.json({"success": true});
                        })
                    }else{
                        var newAcq = {user:target, isFriend: false, subscribed: false, blocked: true};
                        foundRequestor.acquaintance.addToSet(newAcq);
                        foundRequestor.save(function (err, reply) {
                            if(err){
                                res.json({"success": false});
                            }
                            res.json({"success": true});
                        })
                    }
                }
            }, ()=>{
                res.json({"success": false});
            });
    });

    app.post('/canreceive', function (req, res) {
        var user = req.body.sender;
        var text = req.body.text;
        User.aggregate([{$match:{
            $or:[{'acquaintance': {$elemMatch:{'user':user, 'blocked': false}}},
                {'user':{$in:extractEmails(text)}, 'acquaintance.user':{$nin:[user]}}]
        }}])
            .then(foundFriends=>{
                var friends = foundFriends.map(friendObj => {return friendObj.user});
                res.json({"success": true, "friends": friends, 'count': friends.length});
            }, (err)=>{
                res.json({"success": false});
            })
    });

    function extractEmails (text)
    {
        return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    }

};