var utils = require('./utilities.js');

var chatController = function chatController(chatroom, connectionPool, messageFormatters) {
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

        for(i = 0; i < messageFormatters.length; i++)
            content = messageFormatters[i].format(content);

        chatroom.sendMessage(alias, content);
        utils.emptyResponse(response);
    };

    this.update = function update(request, response) {
        var activity = null;

        if (request.query.since === undefined) {
            activity = chatroom.findAllActivity();
        } else {
            var since = new Date(request.query.since);
            activity = chatroom.findActivity(since);
        }

        if (activity.length)
            utils.jsonResponse(activity, response);
        else 
            connectionPool.add(response, since);
    };
};

module.exports = chatController;
