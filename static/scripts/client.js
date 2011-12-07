function chatClient() {
    var Self = this;
    this.MessagesPanel = undefined;
    this.MessageTextBox = undefined;
    this.PostMessageButton = undefined;
    this.LastMessageReceivedDate = undefined;
    this.LastMessageUser = undefined;
    this.NickName = undefined;

    this.initialize = function(messagesPanelId, textboxId, buttonId, nicknameId) {
        this.MessagesPanel = $('#' + messagesPanelId);
        this.MessageTextBox = $('#' + textboxId);
        this.PostMessageButton = $('#' + buttonId);
	this.NicknameField = $('#' + nicknameId);
        
        this.PostMessageButton.click({chat:this}, this.PostMessage);
        this.CheckForMessages();

		this.MessageTextBox.keypress(onKeyPress);
    }

    var onKeyPress = function onKeyPress(e) {
		if (e.which == 13 && e.shiftKey == false)
			Self.PostMessage();
    };   
    
    
    this.PostMessage = function() {
	var nickname = Self.NicknameField.val();

        $.post('/send', { content: this.MessageTextBox.val(), nickname: nickname });   
	Self.MessageTextBox.val('').focus();
    }
    
    this.CheckForMessages = function() {
        var sinceDate = { since: this.LastMessageReceivedDate };
        $.getJSON('/messages', sinceDate, function(messages) {
            Self.MessageReceived(messages);
            Self.CheckForMessages();
        });
    }
    
    this.MessageReceived = function(messages) {       
        $.each(messages, ParseMessage);

	Self.MessagesPanel.scrollTop(Self.MessagesPanel.attr('scrollHeight'));
    }
    
    var ParseMessage = function(index, message) {
            Self.MessagesPanel.append('<div class="bubble bubble-left shadowed"><span class="user">(' + formatTime(message.timestamp) + '): </span><span>' + message.content + '</span></div>');

	    Self.MessagesPanel.append('<div class="avatar-wrapper avatar-wrapper-left"><p>' + message.nickname + '</p></div>');

        Self.LastMessageReceivedDate = message.timestamp;        
        Self.LastMessageUser = message.nickname;
    }

    var formatTime = function(time) {
        var currentTime = new Date()
        var hours = currentTime.getHours()
        var minutes = currentTime.getMinutes()

        var suffix = 'AM';
      
        if (hours >= 12) {
            suffix = 'PM';
            hours = hours - 12;
        }

        if (hours == 0) {
            hours = 12;
        }

        if (minutes < 10)
            minutes = '0' + minutes;

        return hours + ':' + minutes + ' ' + suffix;
    };
}

var qchat = new chatClient();
