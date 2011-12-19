function main(client) {
    var currentStatus = undefined;
    var lastMessageReceivedDate = undefined;
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
        client.update(lastMessageReceivedDate, onUpdate);
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
        updateStatus('');
    };

    var onUpdate = function onUpdate(activities) {
        if (activities.length) {
            $.each(activities, function (index, activity) {
                lastMessageReceivedDate = activity.timestamp;

                if (activity.type == 'join') {
                    membersObject.displayNewMember(activity);
                }
                else if (activity.type == 'leave') {
                    membersObject.removeMemberFromDisplay(activity);
                }
                else if (activity.type == 'alias') {
                    membersObject.updateMemberInDisplay(activity);
                }
                else if (activity.type == 'status') {
                    membersObject.updateMemberStatusInDisplay(activity);
                }
                else if (activity.type == 'file' || activity.type == 'image' || activity.type == 'message') {
                    chatObject.displayActivity(activity);
                }
            });
        }

        client.update(lastMessageReceivedDate, onUpdate);
    }
}
