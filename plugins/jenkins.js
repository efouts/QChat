var utils = require('../utilities.js');

var jenkins = function jenkins() {
    this.handle = function handle(request, response, chatroom) {
        var jsonContent;

        // HACK!! The JSON in the body is wrapped in JSON. Look at the body parser????
        for (first in request.body) {
            jsonContent = JSON.parse(first);
            break;
        }
        
        var content = "Jenkins Notification: Job " + jsonContent.name + " updated with phase " + jsonContent.build.phase;
        chatroom.sendMessage('jenkins', content);
    };
};

module.exports = jenkins;
