var utils = require('./utilities.js');

var connectionPool = function connectionPool() {
    var connections = [];    

    this.add = function add(response, since) {        
        connections.push({ response: response, since: since, timestamp: new Date() });
    };

    this.endAll = function endAll(callback) {
        while(connections.length) {
            var connection = connections.shift();
            callback(connection.response, connection.since);                
        }
    };

    var endStaleConnections = function endStaleConnection() {
        while(connections.length && isStale(connections[0]))
            utils.jsonResponse([], connections.shift().response);
    };

    var isStale = function isStale(connection) {
        var now = new Date();
        return now - connection.timestamp > 15000;
    };    

    setInterval(endStaleConnections, 15000);
};

module.exports = connectionPool;
