var events = require('events');
var util = require('util');
var message = require('./message.js');

var chatroom = function chatroom() {
    events.EventEmitter.call(this);
    var self = this;
    var activity = [];
    var messageCount = 0;

    this.join = function join(alias) {
        var action = { type: 'join', alias: alias};
        addActivity(action);    
    };

    this.leave = function leave(alias) {
        var action = { type: 'leave', alias: alias };
        addActivity(action);
    };

    this.changeAlias = function changeAlias(previousAlias, newAlias) {
        var action = { type: 'alias', previousAlias: previousAlias, newAlias: newAlias };
        addActivity(action);
    };

    this.sendMessage = function sendMessage(alias, content) {
        var action = { type: 'message', alias: alias, content: content };
        addActivity(action);

        if (messageCount === 1000)
            trimOldestMessage();
        else 
            messageCount++;
    };

    var addActivity = function addActivity(action) {
        action.timestamp = new Date();
        activity.push(action);
        self.emit('activity');
    };

    this.findAllActivity = function findAllActivity() {
        return activity;
    };

    this.findActivity = function findActivity(since) {
        var activitySince = [];
        var i = activity.length - 1;

        while (activity[i].timestamp > since && i >= 0)
            activitySince.unshift(activity[i--]);        

        return activitySince;
    };

    var trimOldestMessage = function trimOldestMessage() {
        for (i = 0; i < activity.length; i++) {
            if (activity[i].type === 'message') {
                activity.splice(i, 1);
                break;
            }
        }
    };
};

util.inherits(chatroom, events.EventEmitter);
module.exports = chatroom;
