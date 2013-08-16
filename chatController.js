var connect = require('express/node_modules/connect');
var utils = require('./utilities.js');

var chatController = function chatController(chatroom) {
    this.join = function join(request, response) {
        var alias = request.body.alias;

        if (utils.isAvailable([ alias ]) == false) {
            utils.statusResponse(400, response);
            return;
        }

        utils.emptyResponse(response);

        alias = connect.utils.escape(alias);
        chatroom.join(alias);
    };

    this.leave = function leave(request, response) {
        var alias = request.body.alias;

        if (utils.isAvailable([ alias ]) == false) {
            utils.statusResponse(400, response);
            return;
        }

        utils.emptyResponse(response);

        alias = connect.utils.escape(alias);
        chatroom.leave(alias);
    };

    this.alias = function alias(request, response) {
        var previousAlias = request.body.previousAlias;
        var newAlias = request.body.newAlias;

        if (utils.isAvailable([ previousAlias, newAlias ]) == false) {
            utils.statusResponse(400, response);
            return;
        }

        utils.emptyResponse(response);

        previousAlias = connect.utils.escape(previousAlias);
        newAlias = connect.utils.escape(newAlias);
        chatroom.changeAlias(previousAlias, newAlias);
    };

    this.status = function status(request, response) {
        var alias = request.body.alias;
        var status = request.body.status;
  
        if (utils.isAvailable([ alias, status ]) == false) {
            utils.statusResponse(400, response);
            return;
        }

        utils.emptyResponse(response);

        alias = connect.utils.escape(alias);
        status = connect.utils.escape(status);
        chatroom.changeStatus(alias, status);
    };

    this.send = function send(request, response) {
        var alias = request.body.alias;
        var content = request.body.content;

        if (utils.isAvailable([ alias, content ]) == false) {
            utils.statusResponse(400, response);
            return;
        }

        utils.emptyResponse(response);

        alias = connect.utils.escape(alias);
        content = connect.utils.escape(content);
        chatroom.sendMessage(alias, content);
    };
};

module.exports = chatController;
