var Room = require('../room.js');

describe('room', function describeRoom() {
	var room = null;

	beforeEach(function beforeEach() { 
		room = new Room();
	});

	it('should be able to create a message', function() {
		var content = 'content';
		var nickname = 'nick';
		var timestamp = new Date();

		var message = room.createMessage(content, nickname, timestamp);

		expect(message.content).toEqual(content);
		expect(message.nickname).toEqual(nickname);
		expect(message.timestamp).toEqual(timestamp);
	});

	it('should be able to send a message', function() {
		var message = room.createMessage('content', 'nick', new Date());
		room.sendMessage(message);		
	});

	it('should be able to get all messages', function() {
		var message = room.createMessage('content', 'nick', new Date());
		room.sendMessage(message);

		var messages = room.getMessages();

		expect(messages).toEqual([ message ]);
	});

	it('should only return messages since the provided timestamp', function() {
		var messageBefore = room.createMessage('messageBefore', 'nick', new Date('1/1/2011'));
		var messageAfter = room.createMessage('messageAfter', 'nick', new Date('1/3/2011'));
		var anotherMessageAfter = room.createMessage('anotherMessageAfter', 'nick', new Date('1/4/2011'));

		room.sendMessage(messageBefore);
		room.sendMessage(messageAfter);
		room.sendMessage(anotherMessageAfter);

		var messages = room.getMessages(new Date('1/2/2011'));

		expect(messages).toEqual([ messageAfter, anotherMessageAfter ]);
	});
});
