function chat(view) {
    var utilsObject = new utils();
    var chatObject = view.chat;

    this.scrollChat = function scrollChat(event, delta, deltaX, deltaY) {
        chatObject.scrollTop(chatObject.scrollTop() - (deltaY * 200));
    };

    this.displayContinuedMessage = function displayContinuedMessage(message) {
        var chatMessage = chatObject.children('.message').last();

        chatMessage.append($('<div class="message-divider"></div>'));
        chatMessage.append($(getInnerMessageHtml(message)));
        scrollChatToNewMessage();

	window.notify.showNotification(message);
    };

    this.displayNewMessage = function displayNewMessage(message) {
        var newMessage = $('<div class="shadowed message">' + getInnerMessageHtml(message) + '</div>');
        var newAvatarWrapper = $('<div class="avatar-wrapper"><p>' + message.alias + '</p></div>');
        var sideToAddTo = message.alias == view.aliasTextBox.val() ? 'right' : 'left';
        
        newMessage.addClass('message-' + sideToAddTo);
        newAvatarWrapper.addClass('avatar-wrapper-' + sideToAddTo);

        chatObject.append(newMessage);
        chatObject.append(newAvatarWrapper);
        scrollChatToNewMessage();
		
	window.notify.showNotification(message);
    };

    var getInnerMessageHtml = function getInnerMessageHtml(message) {
        var timestamp = utilsObject.format12HourTime(new Date(message.timestamp));
        var messageHtml = message.content.replace(/\n/g, '<br />');

        return '<span class="timestamp">(' + timestamp + '): </span><span>' + messageHtml + '</span>';
    };

    var scrollChatToNewMessage = function scrollChatToNewMessage() {
        chatObject.scrollTop(chatObject[0].scrollHeight);
    };

    chatObject.mousewheel(this.scrollChat);
};
