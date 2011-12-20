var connect = require('connect');
var utils = require('./utilities.js');

var chatController = function chatController(chatroom) {
    this.join = function join(request, response) {
        if (request.body.alias == false) {
            utils.statusResponse(400, response);
            return;
        }

        utils.emptyResponse(response);

        var alias = connect.utils.escape(request.body.alias);
        chatroom.join(alias);
    };

    this.leave = function leave(request, response) {
        if (request.body.alias == false) {
            utils.statusResponse(400, response);
            return;
        }

        utils.emptyResponse(response);

        var alias = connect.utils.escape(request.body.alias);
        chatroom.leave(alias);
    };

    this.alias = function alias(request, response) {
        if (request.body.previousAlias == false || request.body.newAlias == false) {
            utils.statusResponse(400, response);
            return;
        }

        utils.emptyResponse(response);

        var previousAlias = connect.utils.escape(request.body.previousAlias);
        var newAlias = connect.utils.escape(request.body.newAlias);
        chatroom.changeAlias(previousAlias, newAlias);
    };

    this.status = function status(request, response) {
        if (request.body.alias == false || request.body.status == false) {
            utils.statusResponse(400, response);
            return;
        }

        utils.emptyResponse(response);

        var alias = connect.utils.escape(request.body.alias);
        var status = connect.utils.escape(request.body.status);
        chatroom.changeStatus(alias, status);
    };

    this.send = function send(request, response) {
        if (request.body.alias == false || request.body.content == false) {
            utils.statusResponse(400, response);
            return;
        }

        utils.emptyResponse(response);

        var content = connect.utils.escape(request.body.content);
        var alias = connect.utils.escape(request.body.alias);

        chatroom.sendMessage(alias, content);
    };
};

module.exports = chatController;
