var utils = require('../utilities.js');

var jenkins = function jenkins() {
    this.handle = function handle(request, response, chatroom) {
        console.log(request.body);
        var jsonContent = request.body;

        //// HACK!! The JSON in the body is wrapped in JSON. Look at the body parser????
        //for (first in request.body) {
        //    jsonContent = JSON.parse(first);
        //    break;
        //}
        
        var content;

        //if (jsonContent.message)
        //    content = jsonContent.message;
        //else
        //    content = "Jenkins Notification: Job " + jsonContent.name + " updated with phase " + jsonContent.build.phase;

        chatroom.sendMessage('jenkins', jsonContent);
    };
};

module.exports = jenkins;
