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

	window.notify.showNotification(activity);
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
        return '<span class="timestamp">(' + getFormattedTime(activity.timestamp) + '): </span>';
    };
    
    var getFormattedTime = function getFormattedTime(timestamp) {
        return utilsObject.format12HourTime(new Date(timestamp));
    };

    var getFileHtml = function getFileHtml(activity) {
        return '<span><a href="' + activity.path + '" target="_blank">' + activity.name + '</a></span>';
    };

    var getImageHtml = function getImageHtml(activity) {
        /*var image = new Image();
        image.onload = function () {
            this.onload = this.onerror = null;

            F.coming.width = this.width;
            F.coming.height = this.height;

            F._afterLoad();
        };*/
            
        var title = activity.name + ' - Uploaded by ' + activity.alias + ' at ' + getFormattedTime(activity.timestamp);
        
        return '<span><a class="chat-image" href="' + activity.path + '" data-fancybox-group="gallery" title="' + title + '">' + activity.name + '</a></span>';
    };
    
    var getImageThumbnailDimension = function getImageThumbnailDimension() {
        var ratio = this.width / this.height;
        var maxWidth = 50;
        var maxHeight = 50;
        var width = 0;
        var height = 0;
        var padding2 = 0;
        
        if (width > maxWidth) {
            width = maxWidth;
            height = ((width - padding2) / ratio) + padding2;
        }

        if (height > maxHeight) {
            height = maxHeight;
            width = ((height - padding2) * ratio) + padding2;
        }

        if (width < minWidth) {
            width = minWidth;
            height = ((width - padding2) / ratio) + padding2;
        }

        if (height < minHeight) {
            height = minHeight;
            width = ((height - padding2) * ratio) + padding2;
        }
    };

    var getMessageHtml = function getMessageHtml(activity) {
        return '<span>' + activity.content.replace(/\n/g, '<br />') + '</span>';
    };    

    var displayNewActivity = function displayNewActivity(activity, activityHtml) {
        var sideToAddTo = activity.alias == view.aliasTextBox.val() ? 'right' : 'left';

        chatObject.append($('<div class="shadowed message message-' + sideToAddTo + '">' + activityHtml + '</div>'));
        chatObject.append($('<div class="avatar-wrapper avatar-wrapper-' + sideToAddTo + '"><p>' + activity.alias + '</p></div>'));
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
