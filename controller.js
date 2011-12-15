var utils = require('./utilities.js');

var controller = function controller(chatroom, connectionPool, plugins) {
    var onActivity = function onMessage() {
        connectionPool.endAll(function (response, since) {
            var activity = chatroom.findActivity(since)
                                   .map(applyPlugins);

            utils.jsonResponse(activity, response);
        });
    };

    chatroom.on('activity', onActivity);

    this.join = function join(request, response) {
        utils.emptyResponse(response);
        
        var alias = utils.htmlEncode(request.body.alias);
        chatroom.join(alias);
    };

    this.leave = function leave(request, response) {
        if (!request.body.alias)
            utils.statusResponse(403, response);

        utils.emptyResponse(response);
        
        var alias = utils.htmlEncode(request.body.alias);
        chatroom.leave(alias);
    };

    this.alias = function alias(request, response) {
        utils.emptyResponse(response);
        
        var previousAlias = utils.htmlEncode(request.body.previousAlias);
        var newAlias = utils.htmlEncode(request.body.newAlias);
        chatroom.changeAlias(previousAlias, newAlias);
    };
	
	this.status = function status(request, response) {
		utils.emptyResponse(response);
		
		var alias = utils.htmlEncode(request.body.alias);
		var status = utils.htmlEncode(request.body.status);
		chatroom.changeStatus(alias, status);
	};

    this.send = function send(request, response) {
        utils.emptyResponse(response);

        var content = utils.htmlEncode(request.body.content);
        var alias = utils.htmlEncode(request.body.alias);

        chatroom.sendMessage(alias, content);
    };

    this.update = function update(request, response) {
        var activity = null;

        if (request.query.since === undefined) {
            activity = chatroom.findAllActivity();
        } else {
            var since = new Date(request.query.since);
            activity = chatroom.findActivity(since);
        }

        activity = activity.map(applyPlugins);

        if (activity.length)
            utils.jsonResponse(activity, response);
        else 
            connectionPool.add(response, since);
    };
	
    this.plugins = function (request, response) {
        var name = request.params.name;
        var plugin = plugins[name];

        if (!plugin.handle)
            console.log('Plugin ' + name + ' does not have a handle method.');

        plugin.handle(request, response, chatroom)
    };
	
    var applyPlugins = function applyPlugins(action) {
		var clonedAction = utils.clone(action);
		
        for(var name in plugins)
            clonedAction = tryApplyPlugin(plugins[name], clonedAction);
        
        return clonedAction;
    };

    var tryApplyPlugin = function tryApplyPlugin(plugin, action) {
        if (!plugin.apply)
            return action;

        try {
            return plugin.apply(action);
        } catch (err) {
            console.log(err.message);
        }
    };
};

module.exports = controller;
