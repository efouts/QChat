function chat(view) {
    var utilsObject = new utils();
    var chatObject = view.chat;
    var lastActivityUser = undefined;

    this.scrollChat = function scrollChat(event, delta, deltaX, deltaY) {
        event.preventDefault();
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
        createThumbnail(activity);
        
        var title = activity.name + ' - Uploaded by ' + activity.alias + ' at ' + getFormattedTime(activity.timestamp);
        
        return '<span><a class="chat-image" href="' + activity.path + '" data-fancybox-group="gallery" title="' + title + '">' +
               '<img alt="' + activity.name + '" id="img_' + activity.fileId + '" src="fancybox/source/fancybox_loading.gif" />' +
               '</a></span>';
    };
    
    var createThumbnail = function createThumbnail(activity) {
        var image = new Image();        
        
        image.onload = function() {
            var dimension = utilsObject.getImageThumbnailDimension(image);
            var imageTag = $('#img_' + activity.fileId);
            
            imageTag.attr('src', image.src);
            imageTag.css('height', dimension.height);
            imageTag.css('width', dimension.width);            
        };
        
        image.src = activity.path;
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
