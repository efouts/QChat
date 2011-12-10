function chatClient() {
    var self = this;
    this.messagesPanel = undefined;
    this.messageTextBox = undefined;
    this.postMessageButton = undefined;
    this.lastMessageReceivedDate = undefined;
    this.lastMessageUser = undefined;
    this.aliasTextBox = undefined;    
    this.alias = undefined;
    this.displayContinuedMessage;
    this.displayNewMessage;
    
    var defaultText = "Please type your name into the 'Alias' box above to get started";

    this.initialize = function initialize(messagesPanel, messageTextBox, postMessageButton, aliasTextBox, displayContinuedMessage, displayNewMessage) {
        this.messagesPanel = messagesPanel;
        this.messageTextBox = messageTextBox;
        this.postMessageButton = postMessageButton;
	    this.aliasTextBox = aliasTextBox;
        this.displayContinuedMessage = displayContinuedMessage;
        this.displayNewMessage = displayNewMessage;
	
	    this.postMessageButton.click(this.postMessageButtonClick);
	
	    this.aliasTextBox.keydown(this.aliasTextBoxKeyDown);
	    this.aliasTextBox.change(this.aliasTextBoxChanged);
	
	    this.messageTextBox.val(defaultText);	
	    this.messageTextBox.keypress(this.messageTextBoxOnKeyPress);
        
	    disableMessageTextBox();
	    this.update();

	    $(window).unload(function () {
            if (self.alias)
	            $.post('/leave', { alias : self.alias });
	    });
    }
   
    this.aliasTextBoxKeyDown = function aliasTextBoxKeyDown() {
	    if (self.aliasTextBox.val() !== '')
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
    
    this.aliasTextBoxChanged = function aliasTextBoxChanged() {
	    if (self.alias === undefined)
	        self.join();
	    else
	        self.changeAlias();
	
	    self.alias = self.aliasTextBox.val();
    }
    
    this.join = function join() {
	    $.post('/join', { alias : self.aliasTextBox.val() });   
    }
    
    this.changeAlias = function changeAlias() {
	    var aliasInfo = { previousAlias : self.alias, newAlias : self.aliasTextBox.val() };		
	    $.post('/alias', aliasInfo);	
    }
    
    this.messageTextBoxOnKeyPress = function messageTextBoxOnKeyPress(e) {
        if (e.which == 13 && !e.shiftKey) {
            if (self.messageTextBox.val() !== '')
                self.postMessage();
                
            e.preventDefault();
        }
    }
    
    this.postMessageButtonClick = function postMessageButtonClick(e) {
	    if (self.messageTextBox.val() === '')
	        return;
	
        self.postMessage();
    }
    
    this.postMessage = function postMessage() {
        $.post('/send', { content: this.messageTextBox.val(), alias: this.alias }); 
        self.messageTextBox.val('');
        self.messageTextBox.focus();
    }

    this.update = function update() {
        var sinceDate = { since: this.lastMessageReceivedDate };
        $.getJSON('/update', sinceDate, function(data) {
            self.dataReceived(data);
            self.update();
        });
    }

    this.dataReceived = function dataReceived(data) {
        if (!data.messages)
            return;

        $.each(data.messages, parseMessage);
        self.messagesPanel.scrollTop(self.messagesPanel[0].scrollHeight);        
    }

    var parseMessage = function parseMessage(index, message) {
        var messageHtml = message.content.replace(/\n/g, "<br />");
    	  
        if (self.lastMessageUser === message.alias)
            self.displayContinuedMessage(message);
        else
            self.displayNewMessage(message);

        self.lastMessageReceivedDate = message.timestamp;
        self.lastMessageUser = message.alias;
    }
}

var qchat = new chatClient();
