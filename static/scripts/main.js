function main(client) {
    var currentStatus = undefined;
    var lastActivityReceivedId = undefined;
    var viewObject;    
    var chatObject;    
    var membersAnimatorObject;
    var membersObject;
    var aliasObject;
    var fileUploaderObject;

    this.initialize = function initialize() {
        viewObject = new view();
        chatObject = new chat(viewObject);
        membersAnimatorObject = new membersAnimator(viewObject);
        membersObject = new members(viewObject);
        aliasObject = new alias(viewObject, client);
        fileUploaderObject = new fileUploader(viewObject);
        
        $(window).keydown(windowKeyDown).unload(windowUnload);

        viewObject.messageTextArea.keypress(messageTextAreaOnKeyPress)
            .val('Please type your name into the "Alias" box above to get started');

        client.update(lastActivityReceivedId, onUpdate);
    };     

    var windowKeyDown = function windowKeyDown(event) {
        if (event.which == 40)
            chatObject.scrollChat(null, -1, 0, -1);
        else if (event.which == 38)
            chatObject.scrollChat(null, 1, 0, 1);
    };

    var windowUnload = function windowUnload() {
        var currentAlias = aliasObject.getCurrentAlias();

        if (currentAlias !== undefined)
            client.leave(currentAlias);
    };

    var messageTextAreaOnKeyPress = function messageTextAreaOnKeyPress(event) {
        if (event.which == 13 && !event.shiftKey) {
            if (viewObject.messageTextArea.val() !== '')
                client.send(viewObject.aliasTextBox.val(), viewObject.messageTextArea.val(), onSend);

            event.preventDefault();
        } else {
            updateStatus('typing');
        }
    };

    var updateStatus = function updateStatus(status) {
        if (currentStatus === status)
            return;

        currentStatus = status;
        client.status(aliasObject.getCurrentAlias(), status);
    };

    var onSend = function onSend() {
        viewObject.messageTextArea.val('').focus();
        updateStatus('ready');
    };

    var onUpdate = function onUpdate(activities) {
        if (activities.length) {
            $.each(activities, function (index, activity) {
                lastActivityReceivedId = activity.id;

                if (isMemberActivity(activity))
                    membersObject.displayActivity(activity);
                else if (isChatActivity(activity))
                    chatObject.displayActivity(activity);
            });
            
            $('.chat-image').fancybox({
                type: 'image'
            });
        }

        client.update(lastActivityReceivedId, onUpdate);
    }

    var isMemberActivity = function isMemberActivity(activity) {
        return activity.type == 'join' || 
               activity.type == 'leave' ||
               activity.type == 'alias' || 
               activity.type == 'status';
    };

    var isChatActivity = function isChatActivity(activity) {
        return activity.type == 'file' || 
               activity.type == 'image' || 
               activity.type == 'message';
    };
}
