var QChatClient = function QChatClient(messageField, messageListField) {
        var sinceTimestamp = null;

        var send = function send(message) {
                $.post('/send', { content: message, nickname: 'elliott' });           
        };

        this.initialize = function initialize() {
                loadMessages();
                messageField.keypress(messageFieldOnKeypress);          
        };

        var messageFieldOnKeypress = function messageFieldOnKeypress(e) {
                if (e.which != 13)
                        return;
        
                var message = messageField.val().replace('\n', '');

                if (message != '')
                        send(message);

                messageField.val('');
        };

        var loadMessages = function loadMessage() {

		var callback = function(messages) {
			appendMessages(messages);
			loadMessages();
		};

		if (sinceTimestamp == null)
	                $.getJSON('/messages', {}, callback);
		else 
			$.getJSON('/messages', { since: sinceTimestamp }, callback);
        };

	var appendMessages = function displayMessages(messages) {
		$.each(messages, function(index, message) {
			appendMessage(message);
			sinceTimestamp = message.timestamp;
		});
	};

        var appendMessage = function appendMessage(message) { 
                messageListField.append('<li>' + message.nickname + ': ' + message.content + '</li>');
        };      
};
