var utils = require('../utilities.js');

var jenkins = function jenkins() {
    this.handle = function handle(request, response, chatroom) {
        utils.emptyResponse(response);
        
        var action = { type: 'jenkins' } // Add fields
        chatroom.addActivity(action);
        console.log('jenkins');
    };
};

module.exports = jenkins;
