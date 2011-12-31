var connect = require('connect');
var utils = require('./utilities.js');

var whiteboardController = function whiteboardController(activityLog) {    
    this.edit = function edit(request, response) {
        var alias = request.body.alias;
        var points = request.body.points;
        var size = request.body.size;
        var color = request.body.color;
        var tool = request.body.tool
        
        if (utils.isAvailable([ alias, points, size, color, tool ]) == false) {
            utils.statusResponse(400, response);
            return;
        }
        
        utils.emptyResponse(response);        
        alias = connect.utils.escape(alias);
        
        var entry = { type: 'edit-whiteboard', alias: alias, points: points, size: size, color: color, tool: tool };
        activityLog.addEntry(entry);
    };
    
    this.clear = function clear(request, response) {
        var alias = request.body.alias;
        
        if (utils.isAvailable([ alias ]) == false) {
            utils.statusResponse(400, response);
            return;
        }
        
        utils.emptyResponse(response);        
        alias = connect.utils.escape(alias);
        
        var entry = { type: 'clear-whiteboard', alias: alias };
        activityLog.addEntry(entry);
    };
};

module.exports = whiteboardController;
