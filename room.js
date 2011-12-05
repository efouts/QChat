var room = function room() {
	var messages = [];
	
	this.sendMessage = function sendMessage(message) {
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

	this.createMessage = function createMessage(content, nickname, timestamp) {
		return { content: content, nickname: nickname, timestamp: timestamp };
	};
};

module.exports = room;
