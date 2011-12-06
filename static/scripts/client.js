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
            Self.MessagesPanel.append('<div class="bubble bubble-left shadowed"><span class="user">(' + message.timestamp + '): </span><span>' + message.content + '</span></div>');

	    Self.MessagesPanel.append('<div class="avatar-wrapper avatar-wrapper-left"><p>' + message.nickname + '</p></div>');

        Self.LastMessageReceivedDate = message.timestamp;        
        Self.LastMessageUser = message.nickname;
    }
    
    //this.UserConnected = function() {
        // Todo add a message to the display to show the user connected    
        // Todo add a message to the connected users panel.
    //}
}

var qchat = new chatClient();
