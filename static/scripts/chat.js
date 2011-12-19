function chat(view) {
    var utilsObject = new utils();
    var chatObject = view.chat;
    var lastActivityUser = undefined;

    this.scrollChat = function scrollChat(event, delta, deltaX, deltaY) {
        chatObject.scrollTop(chatObject.scrollTop() - (deltaY * 200));
    };

    this.displayActivity = function displayActivity(activity) {
        var activityHtml = getActivityHtml(activity);

        if (lastActivityUser === activity.alias)
            displayContinuedActivity(activity, activityHtml);
        else
            displayNewActivity(activity, activityHtml);

        scrollChatToNewActivity();
        lastActivityUser = activity.alias;
    };

    var getActivityHtml = function getActivityHtml(activity) {
        var activityHtml = getTimeStampHtml(activity);

        if (activity.type == 'file')
            activityHtml += getFileHtml(activity);
        else if (activity.type == 'image')
            activityHtml += getImageHtml(activity);
        else if (activity.type == 'message')
            activityHtml += getMessageHtml(activity);

        return activityHtml;
    };

    var getTimeStampHtml = function getTimeStampHtml(activity) {
        var timestamp = utilsObject.format12HourTime(new Date(activity.timestamp));

        return '<span class="timestamp">(' + timestamp + '): </span>';
    };

    var getFileHtml = function getFileHtml(activity) {
        return '<span><a href="' + activity.path + '" target="_blank">' + activity.name + '</a></span>';
    };

    var getImageHtml = function getImageHtml(activity) {
        return '<span><img alt="' + activity.name + '" src="' + activity.path + '" /></span>';
    };

    var getMessageHtml = function getMessageHtml(activity) {
        return '<span>' + activity.content.replace(/\n/g, '<br />') + '</span>';
    };    

    var displayNewActivity = function displayNewActivity(activity, activityHtml) {
        var newActivity = $('<div class="shadowed message">' + activityHtml + '</div>');
        var newAvatarWrapper = $('<div class="avatar-wrapper"><p>' + activity.alias + '</p></div>');
        var sideToAddTo = activity.alias == view.aliasTextBox.val() ? 'right' : 'left';

        newActivity.addClass('message-' + sideToAddTo);
        newAvatarWrapper.addClass('avatar-wrapper-' + sideToAddTo);

        chatObject.append(newActivity);
        chatObject.append(newAvatarWrapper);
    };

    var displayContinuedActivity = function displayContinuedActivity(activity, activityHtml) {
        var chatMessage = chatObject.children('.message').last();

        chatMessage.append($('<div class="message-divider"></div>'));
        chatMessage.append(activityHtml);
    };

    var scrollChatToNewActivity = function scrollChatToNewActivity() {
        chatObject.scrollTop(chatObject[0].scrollHeight);
    };

    chatObject.mousewheel(this.scrollChat);
};