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
        if ($('#' + nicknameId).val() !== '')
            this.NickName = $('#' + nicknameId).val();
        
        this.PostMessageButton.click({chat:this}, this.PostMessageButtonClick);
        this.CheckForMessages();
    }
    
    this.PostMessageButtonClick = function(e) {
        var chat = e.data.chat;
        chat.PostMessage();
        chat.MessageTextBox.val('');
    }
    
    this.PostMessage = function() {
        $.post('/send', { content: this.MessageTextBox.val(), nickname: this.NickName});   
    }
    
    this.CheckForMessages = function() {
        var sinceDate = { since: this.LastMessageReceivedDate };
        $.getJSON('/messages', sinceDate, function(messages) {
            this.MessageReceived(messages);
            this.CheckForMessages();
        });
    }
    
    this.MessageReceived = function(messages) {       
        $.each(messages, ParseMessage);
    }
    
    var ParseMessage = function(index, message) {
        if (Self.LastMessageUser === message.nickname)
        {
            Self.MessagesPanel.children().last().append('<div class="message-divider"></div>');
            Self.MessagesPanel.children().last().append('<span class="user">' + message.nickname + '</span><span>' + message.content + '</span>');
        }
        else
        {
            Self.MessagesPanel.append('<div><span class="user">' + message.nickname + '</span><span>' + message.content + '</span></div>');
        }            
        Self.LastMessageReceivedDate = message.timestamp;
        
        Self.LastMessageUser = message.nickname;
    }
    
    //this.UserConnected = function() {
        // Todo add a message to the display to show the user connected    
        // Todo add a message to the connected users panel.
    //}
}

var qchat = new chatClient();
