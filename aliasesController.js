var utils = require('./utilities.js');

var aliasesController = function aliasesController(chatroom) {
    this.enter = function enter(request, response) {
        utils.emptyResponse(response);
    
        var alias = request.body.alias;
        chatroom.enter(alias);
    };

    this.exit = function exit(request, response) {
        utils.emptyResponse(response);
    
        var alias = request.body.alias;
        chatroom.exit(alias);
    };

    this.alias = function alias(request, response) {
        utils.emptyResponse(response);
        
        var previousAlias = request.body.previousAlias;
        var newAlias = request.body.newAlias;
        chatroom.alias(previousAlias, newAlias);    
    };
};

module.exports = aliasesController;
