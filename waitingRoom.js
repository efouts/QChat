var utils = require('./utilities.js');

var waitingRoom = function waitingRoom(staleCallback) {
    var items = [];    

    this.add = function add(item) {        
        items.push({ value: item, timestamp: new Date() });
    };

    this.serviceAll = function serviceAll(serviceCallback) {
        while(items.length)
            serviceCallback(items.pop().value);                
    };

    var serviceStaleItems = function serviceStaleItems() {
        for(i = 0; i < items.length; i++) 
            if (isStale(items[i].timestamp))
                staleCallback(items[i].value);
    };

    var isStale = function isStale(itemTimestamp) {
        var now = new Date();
        return now - itemTimestamp > 15000;
    };    

    setInterval(serviceStaleItems, 15000);
};

module.exports = waitingRoom;
