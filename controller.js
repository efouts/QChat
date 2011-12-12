var utils = require('./utilities.js');

var controller = function controller(chatroom, connectionPool, plugins) {
    var onActivity = function onMessage() {
        connectionPool.endAll(function (response, since) {
            var activity = chatroom.findActivity(since);
            utils.jsonResponse(activity, response);
        });
    };

    chatroom.on('activity', onActivity);

    this.join = function join(request, response) {
        var alias = utils.htmlEncode(request.body.alias);
        chatroom.join(alias);
        utils.emptyResponse(response);
    };

    this.leave = function leave(request, response) {
        if (!request.body.alias)
            utils.statusResponse(403, response);

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

module.exports = controller;
