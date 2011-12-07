function chatClient() {
    var self = this;
    this.messagesPanel = undefined;
    this.messageTextBox = undefined;
    this.postMessageButton = undefined;
    this.lastMessageReceivedDate = undefined;
    this.lastMessageUser = undefined;
    this.nickNameTextBox = undefined;    
    this.nickName = undefined;
    
    var defaultText = "Please type your name into the 'Alias' box above to get started";

    this.initialize = function initialize(messagesPanelId, textboxId, buttonId, nicknameId) {
        this.messagesPanel = $('#' + messagesPanelId);
        this.messageTextBox = $('#' + textboxId);
        this.postMessageButton = $('#' + buttonId);
	this.nickNameTextBox = $('#' + nicknameId);
	
	this.postMessageButton.click(this.postMessageButtonClick);
	
	this.nickNameTextBox.keydown(this.nickNameTextBoxKeyDown);
	this.nickNameTextBox.change(this.changeNickName);
	this.nickNameTextBox.focusout(this.nickNameTextBoxLostFocus);
	
	this.postMessageButton.attr('disabled', true);
	this.messageTextBox.val(defaultText);
	// TODO: Add disabled class to textbox and button
	
	this.messageTextBox.attr('disabled', true);
	this.messageTextBox.attr('readOnly', true);
	this.messageTextBox.click(this.messageTextBoxClick);
	this.messageTextBox.keydown(this.messageTextBoxKeyDown);
	
        this.checkForMessages();
    }

    this.nickNameTextBoxLostFocus = function nickNameTextBoxLostFocus() {
	if (self.nickNameTextBox.val() !== '')
	{
	    self.nickNameTextBox.attr('disabled', true);
	    self.nickNameTextBox.attr('readOnly', true);
	}
    }
    
    this.nickNameTextBoxKeyDown = function nickNameTextBoxKeyDown() {
	if (self.nickNameTextBox.val() !== '')
	{
	    self.messageTextBox.val('');
	    self.messageTextBox.removeAttr('disabled');
	    self.messageTextBox.removeAttr('readOnly');
	}
	else if (self.messageTextBox.val() === '' && self.nickNameTextBox.val() === '')
	    self.messageTextBox.val(self.defaultText);
    }
    
    this.changeNickName = function changeNickName() {	    
	self.nickName = self.nickNameTextBox.val();
    }
    
    this.messageTextBoxKeyDown = function messageTextBoxKeyDown() {
	if (self.messageTextBox.val() === '')
	    self.postMessageButton.attr('disabled', true);
	else
	    self.postMessageButton.removeAttr('disabled');
    }
    
    this.messageTextBoxClick = function messageTextBoxClick() {
	if (self.messageTextBox.val() === self.defaultText && self.nickNameTextBox.val() !== '')
	    self.messageTextBox.val('');
    }
    
    this.postMessageButtonClick = function postMessageButtonClick(e) {
        self.postMessage();
        self.messageTextBox.val('');
        self.messageTextBox.focus();
    }
    
    this.postMessage = function postMessage() {
        $.post('/send', { content: this.messageTextBox.val(), nickname: this.nickName});   
    }
    
    this.checkForMessages = function checkForMessages() {
        var sinceDate = { since: this.lastMessageReceivedDate };
        $.getJSON('/messages', sinceDate, function(messages) {
            self.messageReceived(messages);
            self.checkForMessages();
        });
    }
    
    this.messageReceived = function messageReceived(messages) {
        $.each(messages, parseMessage);
    }

    var parseMessage = function parseMessage(index, message) {
    	  var messageHtml = message.content.replace(/\n/g, "<br />");
    	  
        if (self.lastMessageUser === message.nickname)
        {
	    var chatBubble = self.messagesPanel.children(".bubble").last();
	    chatBubble.append($('<div></div>').addClass('message-divider'));
				
            chatBubble.append($("<span></span>")
		.addClass("user")
		.html("(" + self.format12HourTime(new Date(message.timestamp)) + "): "));
	    
	    chatBubble.append($("<span></span>")
	    	.html(messageHtml));
        }
        else
        {
            self.messagesPanel.append($('<div></div>')
            	.addClass("bubble shadowed")
            	.append($('<span></span>')
            		.addClass('user')
            		.append('(' + self.format12HourTime(new Date(message.timestamp)) + '): '))
            	.append($('<span></span>')
            	.append(messageHtml)));
            
            self.messagesPanel.append($("<div></div>")
		.addClass("avatar-wrapper")
		.append($('<p></p>')
		    .html(message.nickname)));
			            
	    self.messagesPanel.children('.bubble').filter(':even').addClass('bubble-left');
	    self.messagesPanel.children('.bubble').filter(':odd').addClass('bubble-right');
			   
	    self.messagesPanel.children('.avatar-wrapper').filter(':even').addClass('avatar-wrapper-left');
	    self.messagesPanel.children('.avatar-wrapper').filter(':odd').addClass('avatar-wrapper-right');
        }
        self.lastMessageReceivedDate = message.timestamp;
        self.lastMessageUser = message.nickname;
    }
    
    this.format12HourTime = function format12HourTime(dateTime){
	var hours = dateTime.getHours();
	var ampm = 'am';
	if (hours > 12) 
	{
	    ampm = 'pm';
	    hours-=12;
	}
	if (hours === 0)
	    hours = 12;
	    
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
