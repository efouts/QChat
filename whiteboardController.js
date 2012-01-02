var connect = require('connect');
var utils = require('./utilities.js');

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
        
        var entry = { type: 'edit-whiteboard', edit: edit };
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
        //removeEditsBeforeClear();
    };
    
    var removeEditsBeforeClear = function removeEditsBeforeClear() {
        var entries = activityLog.findAllEntries();
        
        for (i = entries.length - 1; i > 0; i--) {
            if (entries[i].type === 'edit-whiteboard') {
                activityLog.removeEntry(i);
            }
        }
    };
};

module.exports = whiteboardController;
