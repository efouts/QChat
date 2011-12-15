var utils = require('./utilities.js);

var filesController = function filesController(activityLog) {
    this.upload = function (request, response) {
        var entry = { };
        activityLog.addEntry(entry);
    };

    this.download = function(request, response) {

    };
};

module.exports = filesController;
