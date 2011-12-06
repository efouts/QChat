function chatClient() {
    this.MessagesPanel = undefined;
    this.MessageTextBox = undefined;
    this.PostMessageButton = undefined;
    this.LastMessageReceivedDate = undefined;

    this.initialize = function(messagesPanelId, textboxId, buttonId) {
        this.MessagesPanel = $('#' + messagesPanelId);
        this.MessageTextBox = $('#' + textboxId);
        this.PostMessageButton = $('#' + buttonId);
        
        this.PostMessageButton.click({chat:this}, this.PostMessageButtonClick);
    }
    
    this.PostMessageButtonClick = function(e) {
        var chat = e.data.chat;
        chat.PostMessage();
        chat.MessageTextBox.val('');
    }
    
    this.PostMessage = function() {
        this.MessagesPanel.append('<div>' + this.MessageTextBox.val() + '</div>');
    }
    
    this.MessageReceived = function() {
        // Todo add the message to the display div
    }
    
    this.UserConnected = function() {
        // Todo add a message to the display to show the user connected    
        // Todo add a message to the connected users panel.
    }
}

var qchat = new chatClient();
