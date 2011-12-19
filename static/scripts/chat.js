function chat(view) {
    var utilsObject = new utils();
    var chatObject = view.chat;

    this.scrollChat = function scrollChat(event, delta, deltaX, deltaY) {
        chatObject.scrollTop(chatObject.scrollTop() - (deltaY * 200));
    };

    this.displayContinuedMessage = function displayContinuedMessage(message) {
        var chatMessage = chatObject.children('.message').last();

        chatMessage.append($('<div class="message-divider"></div>'));
        chatMessage.append($(getMessageHtml(message)));
        scrollChatToNewMessage();
    };

    this.displayNewFile = function displayNewFile(message) {
        var newMessage = $('<div class="shadowed message">' + getFileHtml(message) + '</div>');
        var newAvatarWrapper = $('<div class="avatar-wrapper"><p>' + message.alias + '</p></div>');
        var sideToAddTo = message.alias == view.aliasTextBox.val() ? 'right' : 'left';

        newMessage.addClass('message-' + sideToAddTo);
        newAvatarWrapper.addClass('avatar-wrapper-' + sideToAddTo);

        chatObject.append(newMessage);
        chatObject.append(newAvatarWrapper);
        scrollChatToNewMessage();
    };

    var getFileHtml = function getFileHtml(message) {
        var timestamp = utilsObject.format12HourTime(new Date(message.timestamp));

        return '<span class="timestamp">(' + timestamp + '): </span><span><a href="' + message.path + '" target="_blank">' + message.name + '</a></span>';
    };

    this.displayNewImage = function displayNewImage(message) {
        var newMessage = $('<div class="shadowed message">' + getImageHtml(message) + '</div>');
        var newAvatarWrapper = $('<div class="avatar-wrapper"><p>' + message.alias + '</p></div>');
        var sideToAddTo = message.alias == view.aliasTextBox.val() ? 'right' : 'left';

        newMessage.addClass('message-' + sideToAddTo);
        newAvatarWrapper.addClass('avatar-wrapper-' + sideToAddTo);

        chatObject.append(newMessage);
        chatObject.append(newAvatarWrapper);
        scrollChatToNewMessage();
    };

    var getImageHtml = function getImageHtml(message) {
        var timestamp = utilsObject.format12HourTime(new Date(message.timestamp));

        return '<span class="timestamp">(' + timestamp + '): </span><span><img alt="' + message.name + '" src="' + message.path + '" /></span>';
    };

    this.displayNewMessage = function displayNewMessage(message) {
        var newMessage = $('<div class="shadowed message">' + getMessageHtml(message) + '</div>');
        var newAvatarWrapper = $('<div class="avatar-wrapper"><p>' + message.alias + '</p></div>');
        var sideToAddTo = message.alias == view.aliasTextBox.val() ? 'right' : 'left';
        
        newMessage.addClass('message-' + sideToAddTo);
        newAvatarWrapper.addClass('avatar-wrapper-' + sideToAddTo);

        chatObject.append(newMessage);
        chatObject.append(newAvatarWrapper);
        scrollChatToNewMessage();
    };

    var getMessageHtml = function getMessageHtml(message) {
        var timestamp = utilsObject.format12HourTime(new Date(message.timestamp));
        var messageHtml = message.content.replace(/\n/g, '<br />');

        return '<span class="timestamp">(' + timestamp + '): </span><span>' + messageHtml + '</span>';
    };

    var scrollChatToNewMessage = function scrollChatToNewMessage() {
        chatObject.scrollTop(chatObject[0].scrollHeight);
    };

    chatObject.mousewheel(this.scrollChat);
};