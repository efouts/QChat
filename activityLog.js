var nodeModules = {
    events: require('events'),
    util: require('util')
};

var utils = require('./utilities.js');

var activityLog = function activityLog() {
    nodeModules.events.EventEmitter.call(this);
    var log = [];
    var self = this;

    this.addEntry = function addEntry(entry) {
        entry.timestamp = new Date();
        log.push(entry);
        self.emit('activity');
    };

    this.removeEntry = function removeEntry(index) {
        log.splice(index, 1);
    };

    this.findAllEntries = function findAllEntries() {
        return log;
    }; 

    this.findEntries = function findEntries(since) {
        var entries = [];
        var i = log.length - 1;

        while (i >= 0 && log[i].timestamp > since)
            entries.unshift(log[i--]);

        return entries;        
    };
};

nodeModules.util.inherits(activityLog, nodeModules.events.EventEmitter);
module.exports = activityLog;
