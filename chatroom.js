var chatroom = function chatroom() {
    var self = this;
	var messages = [];
	
    this.enter = function enter(alias) {
        var message = alias + ' has entered.';
        sendServerMessage(message);
    };

    this.exit = function exit(alias) {
        var message = alias + ' has exited.';
        sendServerMessage(message);
    };

    this.changeAlias = function changeAlias(previousAlias, newAlias) {
        var message = previousAlias + ' is now ' + newAlias;
        sendServerMessage(message);
    };

	this.sendMessage = function sendMessage(alias, message, timestamp) {
        var message = createMessage(alias, message, timestamp);
		messages.push(message);
	};	

	this.getMessages = function getMessages(since) {
		if (since == undefined)			
			return messages;
		
		var messagesSince = [];

		for(i = 0; i < messages.length; i++)
			if (messages[i].timestamp > since)
				messagesSince.push(messages[i]);

		return messagesSince;
	};

    var sendServerMessage = function sendServerMessage(message) {
        var timestamp = new Date();
        self.sendMessage('Server', message, timestamp);
    };

	var createMessage = function createMessage(alias, content, timestamp) {
		return { alias: alias, content: content, timestamp: timestamp };
	};
};

module.exports = chatroom;
