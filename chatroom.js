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

    this.findAllActivity = function findAllActivity() {        
        return activity.map(applyPlugins);
    };

    this.findActivity = function findActivity(since) {
        var activitySince = [];
        var i = activity.length - 1;

        while (activity[i].timestamp > since && i >= 0)
            activitySince.unshift(activity[i--]);			

        return activitySince.map(applyPlugins);
    };

    var addActivity = function addActivity(action) {
        action.timestamp = new Date();
        activity.push(action);
        self.emit('activity');
    };

    var applyPlugins = function applyPlugins(action) {
		var clonedAction = utils.clone(action);
		
        for(i = 0; i < plugins.length; i++)
            clonedAction = tryApplyPlugin(plugins[i], clonedAction);

        return clonedAction;
    };

    var tryApplyPlugin = function tryApplyPlugin(plugin, action) {
        try {
            return plugin.apply(action);
        } catch (err) {
            console.log(err.message);
        }
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
