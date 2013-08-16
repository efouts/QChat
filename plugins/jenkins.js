var utils = require('../utilities.js');

var jenkins = function jenkins() {
    this.handle = function handle(request, response, chatroom) {
        var jsonContent = request.body;
        var chatMessage;

        if (jsonContent.message)
            chatMessage = jsonContent.message;
        else
            chatMessage = "Jenkins Notification: Job " + jsonContent.name + " updated with phase " + jsonContent.build.phase;

        chatroom.sendMessage('jenkins', chatMessage);
    };
};

module.exports = jenkins;
