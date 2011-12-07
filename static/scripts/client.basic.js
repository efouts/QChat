function chatClient() {
    var self = this;

    this.messageTextBox = undefined;
    this.nicknameTextBox = undefined;
    this.appendMessageCallback = undefined;
    this.lastMessageReceivedDate = undefined;

    this.initialize = function(messageTextBox, nicknameTextBox, appendMessageCallback) {
        this.messageTextBox = messageTextBox;
    	this.nicknameTextBox = nicknameTextBox;
        this.appendMessageCallback = appendMessageCallback;
        this.messageTextBox.keypress(onKeyPress);

        this.checkForMessages();
    }

    var onKeyPress = function onKeyPress(e) {
		if (e.which == 13 && e.shiftKey == false)
			self.postMessage();
    };   
    
    
    this.postMessage = function postMessage() {
        var nickname = self.nicknameTextBox.val();
        var content = self.messageTextBox.val();

        $.post('/send', { content: content, nickname: nickname }, function() {   
            self.messageTextBox.val('').focus();
        });
    }
    
    this.checkForMessages = function checkForMessages() {
        var data = { since: self.lastMessageReceivedDate };

        $.getJSON('/messages', data, function(messages) {
            self.messageReceived(messages);
            self.checkForMessages();
        });
    }
    
    this.messageReceived = function messageReceived(messages) {       
        $.each(messages, function (index, message) {
            self.lastMessageReceivedDate = message.timestamp;
            self.appendMessageCallback(message);
        });
    }

    this.formatTime = function formatTime(time) {
        time = new Date(time);
        var hours = time.getHours();
        var minutes = time.getMinutes();
        var seconds = time.getSeconds();

        var suffix = 'AM';
      
        if (hours >= 12) {
            suffix = 'PM';
            hours = hours - 12;
        }

        if (hours == 0)
            hours = 12;
        
        if (minutes < 10)
            minutes = '0' + minutes;

        if (seconds < 10)
            seconds = '0' + seconds;

        return hours + ':' + minutes + ':' + seconds + ' ' + suffix;
    };
}


