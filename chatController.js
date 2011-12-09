var utils = require('./utilities.js');
var message = require('./message.js');

var chatController = function chatController(chatroom, connectionPool) {
    this.join = function join(request, response) {
        var alias = utils.htmlEncode(request.body.alias);
        chatroom.join(alias);
        utils.emptyResponse(response);
    };

    this.leave = function leave(request, response) {
        if (!request.body.alias)
            utils.forbiddenResponse(response);

        var alias = utils.htmlEncode(request.body.alias);

        chatroom.leave(alias);
        utils.emptyResponse(response);
    };

    this.alias = function alias(request, response) {
        var previousAlias = request.body.previousAlias;
        var newAlias = request.body.newAlias;
        chatroom.changeAlias(previousAlias, newAlias);
        utils.emptyResponse(response);
    };

    this.send = function send(request, response) {
        var content = utils.htmlEncode(request.body.content);
        var alias = utils.htmlEncode(request.body.alias);
        var timestamp = new Date();
        chatroom.sendMessage(alias, content, timestamp, message.types.user);
        utils.emptyResponse(response);
    };

    this.messages = function messages(request, response) {
        var messages = null;

        if (request.query.since === undefined) {
            messages = chatroom.findAllMessages();
        } else {
            var since = new Date(request.query.since);
            messages = chatroom.findMessages(since);
        }

        if (messages.length) {
            var data = { messages: messages };
            utils.jsonResponse(data, response);
        } else {
            connectionPool.add(response, since);
        }
    };
};

module.exports = chatController;
