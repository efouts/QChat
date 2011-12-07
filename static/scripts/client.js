function chatClient() {
    var Self = this;
    this.MessagesPanel = undefined;
    this.MessageTextBox = undefined;
    this.PostMessageButton = undefined;
    this.LastMessageReceivedDate = undefined;
    this.LastMessageUser = undefined;
    this.NickName = 'Test User';

    this.initialize = function(messagesPanelId, textboxId, buttonId, nicknameId) {
        this.MessagesPanel = $('#' + messagesPanelId);
        this.MessageTextBox = $('#' + textboxId);
        this.PostMessageButton = $('#' + buttonId);
        if ($('#' + nicknameId).val() !== '')
        {
            this.NickName = $('#' + nicknameId).val();
        }
        this.PostMessageButton.click({chat:this}, this.PostMessageButtonClick);
        this.CheckForMessages();
    }
    
    this.PostMessageButtonClick = function(e) {
        var chat = e.data.chat;
        Self.PostMessage();
        Self.MessageTextBox.val('');
        Self.MessageTextBox.focus();
    }
    
    this.PostMessage = function() {
        $.post('/send', { content: this.MessageTextBox.val(), nickname: this.NickName});   
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
    }

    var ParseMessage = function(index, message) {
    	  var messageHtml = message.content.replace(/\n/g, "<br />");
    	  
        if (Self.LastMessageUser === message.nickname)
        {
				var chatBubble = Self.MessagesPanel.children(".bubble").last();
				chatBubble.append($('<div></div>').addClass('message-divider'));
				
            chatBubble.append($("<span></span>")
			            .addClass("user")
			            .html("(" + Self.Format12HourTime(new Date(message.timestamp)) + "): "));
			            
			   chatBubble.append($("<span></span>")
			            .html(messageHtml));
        }
        else
        {
            Self.MessagesPanel.append($('<div></div>')
            	.addClass("bubble bubble-right shadowed")
            	.append($('<span></span>')
            		.addClass('user')
            		.append('(' + Self.Format12HourTime(new Date(message.timestamp)) + '): '))
            	.append($('<span></span>')
            	.append(messageHtml)));
            
            Self.MessagesPanel.append(
			        $("<div></div>")
			        .addClass("avatar-wrapper avatar-wrapper-right")
			        .append($('<p></p>')
			            .html(message.nickname)));
        }
        Self.LastMessageReceivedDate = message.timestamp;
        Self.LastMessageUser = message.nickname;
    }
    
    this.Format12HourTime = function(dateTime){
		  var hours = dateTime.getHours();
		  var ampm = 'am';
		  if (hours > 12) 
		  {
		      ampm = 'pm';
		      hours-=12;
		  }
		  var minutes = dateTime.getMinutes();
		  if (minutes < 10)
		      minutes = '0' + minutes;
		  
		  var seconds = dateTime.getSeconds();
		  if (seconds < 10)
		      seconds = '0' + seconds;
		      
		  return hours + ':' + minutes + ':' + seconds + ' ' + ampm; 
    }
    
    //this.UserConnected = function() {
        // Todo add a message to the display to show the user connected    
        // Todo add a message to the connected users panel.
    //}
}

var qchat = new chatClient();
