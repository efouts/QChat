function chatClient() {
    var self = this;
    this.messageTextBox = undefined;
    this.postMessageButton = undefined;
    this.lastMessageReceivedDate = undefined;
    this.lastMessageUser = undefined;
    this.currentStatus = undefined;
    this.aliasTextBox = undefined;
    this.alias = undefined;
    this.displayContinuedMessage;
    this.displayNewMessage;
    this.displayNewMember;
    this.removeMemberFromDisplay;
    this.updateMemberInDisplay;
    this.updateMemberStatusInDisplay;

    var defaultText = "Please type your name into the 'Alias' box above to get started";

    this.initialize = function initialize(messageTextBox, postMessageButton, aliasTextBox, displayContinuedMessage,
        displayNewMessage, displayNewMember, removeMemberFromDisplay, updateMemberInDisplay, updateMemberStatusInDisplay) {
        this.messageTextBox = messageTextBox;
        this.postMessageButton = postMessageButton;
        this.aliasTextBox = aliasTextBox;
        this.displayContinuedMessage = displayContinuedMessage;
        this.displayNewMessage = displayNewMessage;
        this.displayNewMember = displayNewMember;
        this.removeMemberFromDisplay = removeMemberFromDisplay;
        this.updateMemberInDisplay = updateMemberInDisplay;
		this.updateMemberStatusInDisplay = updateMemberStatusInDisplay;

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
		else {
			updateStatus('typing');
		}
    }

	var updateStatus = function updateStatus(status) {
		if (this.currentStatus === status)
			return;

		this.currentStatus = status;
		var statusInfo = { alias: self.alias, status: status };
		$.post('/status', statusInfo);
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
		updateStatus('ready');
    }

    this.update = function update() {
        var sinceDate = { since: this.lastMessageReceivedDate };
        $.getJSON('/update', sinceDate, function(data) {
            self.dataReceived(data);
            self.update();
        });
    }

    this.dataReceived = function dataReceived(data) {
        if (!data.length)
            return;

        $.each(data, parseData);
    }

    var parseData = function parseData(index, data) {
        self.lastMessageReceivedDate = data.timestamp;

        if (data.type == 'join') {
            self.displayNewMember(data);
        }
        else if (data.type == 'leave') {
            self.removeMemberFromDisplay(data);
        }
        else if (data.type == 'alias') {
            self.updateMemberInDisplay(data);
        }
		else if (data.type == 'status') {
			self.updateMemberStatusInDisplay(data);
		}
        else if (data.type == 'message') {
            if (self.lastMessageUser === data.alias)
                self.displayContinuedMessage(data);
            else
                self.displayNewMessage(data);

            self.lastMessageUser = data.alias;
        }
    }
}

var qchat = new chatClient();
