var connect = require('express/node_modules/connect');
var utils = require('./utilities.js');

var interval;

var whiteboardController = function whiteboardController(activityLog) {    
    this.edit = function edit(request, response) {
        var alias = request.body.alias;
        var edit = request.body.edit;
        
        if (utils.isAvailable([ alias, edit ]) == false) {
            utils.statusResponse(400, response);
            return;
        }
        
        utils.emptyResponse(response);        
        alias = connect.utils.escape(alias);
        
        var entry = { type: 'edit-whiteboard', alias: alias, edit: edit };
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
        removeAllWhiteboardEntries();
        activityLog.addEntry(entry);            
    };
    
    var removeAllWhiteboardEntries = function removeAllWhiteboardEntries() {
        var entries = activityLog.findAllEntries();
        
        for (i = entries.length - 1; i >= 0; i--) {
            if (isWhiteboardEntry(entries[i])) {
                activityLog.removeEntry(i);
            }
        }
    };   
    
    var isWhiteboardEntry = function isWhiteboardEntry(entry) {
        return entry.type == 'edit-whiteboard' ||
               entry.type == 'clear-whiteboard';
    };
};

module.exports = whiteboardController;
