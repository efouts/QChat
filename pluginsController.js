var utils = require('./utilities.js');

var pluginsController = function pluginsController(activityLog, plugins) {
    this.plugins = function (request, response) {
        utils.emptyResponse(response);

        var name = request.params.name;
        var plugin = plugins[name];

        if (!plugin.handle)
            console.log('Plugin ' + name + ' does not have a handle method.');

        plugin.handle(request, response, chatroom);
    };
};

module.exports = pluginsController;
