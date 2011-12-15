var events = require('events');
var util = require('util');
var utils = require('./utilities.js');

var chatroom = function chatroom(plugins) {
    events.EventEmitter.call(this);
    var self = this;
    var activity = [];
    var messageCount = 0;

    this.join = function join(alias) {
        var action = { type: 'join', alias: alias};
        this.addActivity(action);    
    };

    this.leave = function leave(alias) {
        var action = { type: 'leave', alias: alias };
        this.addActivity(action);
    };

    this.changeAlias = function changeAlias(previousAlias, newAlias) {
        var action = { type: 'alias', previousAlias: previousAlias, newAlias: newAlias };
        this.addActivity(action);
    };
	
	this.changeStatus = function changeStatus(alias, status) {
		var action = { type: 'status', alias: alias, status: status };
        this.addActivity(action);
	};

    this.sendMessage = function sendMessage(alias, content) {
        var action = { type: 'message', alias: alias, content: content };		
        this.addActivity(action);

        if (messageCount === 1000)
            trimOldestMessage();
        else 
            messageCount++;
    };

    this.addActivity = function addActivity(action) {
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

        while (i >= 0 && activity[i].timestamp > since )
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
