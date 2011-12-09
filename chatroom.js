var events = require('events');
var util = require('util');
var message = require('./message.js');

var chatroom = function chatroom() {
    events.EventEmitter.call(this);
    var self = this;
	var messages = [];
	
    this.join = function join(alias) {
        var content = alias + ' has joined.';
        self.sendMessage('Server', content, new Date(), message.types.join);
    };

    this.leave = function leave(alias) {
        var content = alias + ' has left.';
        self.sendMessage('Server', content, new Date(), message.types.leave);
    };

    this.changeAlias = function changeAlias(previousAlias, newAlias) {
        var content = previousAlias + ' is now ' + newAlias + '.';
        self.sendMessage('Server', content, new Date(), message.types.alias);
    };

	this.sendMessage = function sendMessage(alias, content, timestamp, type) {
        var _message = message.create(alias, content, timestamp, type);
		messages.push(_message);

        self.emit('message');

        trimMessages();
	};	

    this.findAllMessages = function findAllMessages() {
        return messages;
    };

	this.findMessages = function findMessages(since) {
		var messagesSince = [];
        var messageIndex = messages.length - 1;

        while (messages[messageIndex].timestamp > since && messageIndex >= 0)
            messagesSince.unshift(messages[messageIndex--]);        

		return messagesSince;
	};

    var trimMessages = function trimMessages() {
        while(messages.length > 1000)
            messages.shift();
    };
};

util.inherits(chatroom, events.EventEmitter);
module.exports = chatroom;
