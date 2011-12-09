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
	this.nickNameTextBox.change(this.nickNameTextBoxChanged);
	
	this.messageTextBox.val(defaultText);	
	this.messageTextBox.keypress(this.messageTextBoxOnKeyPress);
        
	disableMessageTextBox();
	this.checkForMessages();
	
	$(window).unload(function() {
	    $.post('/leave', { alias : self.nickName });
	});
    }
   
    this.nickNameTextBoxKeyDown = function nickNameTextBoxKeyDown() {
	if (self.nickNameTextBox.val() !== '')
	    enableMessageTextBox();
	else
	    disableMessageTextBox();
    }
    
    var enableMessageTextBox = function enableMessageTextBox() {
	self.messageTextBox.removeAttr('disabled');
	self.messageTextBox.removeAttr('readOnly');
	self.messageTextBox.val('');
    }
    
    var disableMessageTextBox = function disableMessageTextBox() {
	self.messageTextBox.attr('disabled', true);
	self.messageTextBox.attr('readOnly', true);
	self.messageTextBox.val(defaultText);
    }
    
    this.nickNameTextBoxChanged = function nickNameTextBoxChanged() {
	if (self.nickName === undefined)
	    self.join();
	else
	    self.changeAlias();
	
	self.nickName = self.nickNameTextBox.val();
    }
    
    this.join = function join() {
	$.post('/join', { alias : self.nickNameTextBox.val() });   
    }
    
    this.changeAlias = function changeAlias() {
	var aliasInfo = { previousAlias : self.nickName, newAlias : self.nickNameTextBox.val() };		
	$.post('/alias', aliasInfo);	
    }
    
    this.messageTextBoxOnKeyPress = function messageTextBoxOnKeyPress(e) {
        if (e.which == 13 && !e.shiftKey && self.messageTextBox.val() !== '') {
            self.postMessage();
	    self.messageTextBox.val('');
	    self.messageTextBox.focus();
            e.preventDefault();
        }
    }
    
    this.postMessageButtonClick = function postMessageButtonClick(e) {
	if (self.messageTextBox.val() === '')
	    return;
	
        self.postMessage();
        self.messageTextBox.val('');
        self.messageTextBox.focus();
    }
    
    this.postMessage = function postMessage() {
        $.post('/send', { content: this.messageTextBox.val(), alias: this.nickName});   
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
        self.messagesPanel.scrollTop(self.messagesPanel[0].scrollHeight);
    }

    var parseMessage = function parseMessage(index, message) {
    	  var messageHtml = message.content.replace(/\n/g, "<br />");
    	  
        if (self.lastMessageUser === message.alias)
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
		    .html(message.alias)));
			            
	    self.messagesPanel.children('.bubble').filter(':even').addClass('bubble-left');
	    self.messagesPanel.children('.bubble').filter(':odd').addClass('bubble-right');
			   
	    self.messagesPanel.children('.avatar-wrapper').filter(':even').addClass('avatar-wrapper-left');
	    self.messagesPanel.children('.avatar-wrapper').filter(':odd').addClass('avatar-wrapper-right');
        }
        self.lastMessageReceivedDate = message.timestamp;
        self.lastMessageUser = message.alias;
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
