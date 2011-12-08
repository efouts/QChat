var utils = require('./utilities.js');
var waitingRoom = require('./waitingRoom.js');

var messagesController = function messagesController(chatroom) {   
    this.sendMessage = function sendMessage(request, response) {
        var content = utils.htmlEncode(request.body.content);
        var alias = utils.htmlEncode(request.body.alias);
        var timestamp = new Date();

        chatroom.sendMessage(alias, content, timestamp);

        utils.emptyResponse(response);      
        
        waitingRequests.serviceAll(serviceWaitingRequest);
    };    

    this.getMessages = function getMessages(request, response) {
        var since = null;

        if (request.query.since)
            since = new Date(request.query.since);

        var messagesSince = chatroom.getMessages(since);

        if (messagesSince.length) 
            utils.jsonResponse(messagesSince, response);
        else
            waitingRequests.add({ response: response, since: since });	
    };     

    var serviceWaitingRequest = function serviceWaitingRequest(waitingRequest) {
        var messages = chatroom.getMessages(waitingRequest.since);
        utils.jsonResponse(messages, waitingRequest.response);
    };

    var endStaleWaitingRequest = function endStaleWaitingRequest(waitingRequest) {
        utils.jsonResponse([], waitingRequest.response);
    }

    var waitingRequests = new waitingRoom(endStaleWaitingRequest);
};

module.exports = messagesController;
