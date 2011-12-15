var chatroom = function chatroom(activityLog) {
    var messageCount = 0;

    this.join = function join(alias) {
        var entry = { type: 'join', alias: alias};
        activityLog.addEntry(entry);    
    };

    this.leave = function leave(alias) {
        var entry = { type: 'leave', alias: alias };
        activityLog.addEntry(entry);
    };

    this.changeAlias = function changeAlias(previousAlias, newAlias) {
        var entry = { type: 'alias', previousAlias: previousAlias, newAlias: newAlias };
        activityLog.addEntry(entry);
    };
	
	this.changeStatus = function changeStatus(alias, status) {
		var entry = { type: 'status', alias: alias, status: status };
        activityLog.addEntry(entry);
	};

    this.sendMessage = function sendMessage(alias, content) {
        var entry = { type: 'message', alias: alias, content: content };		
        activityLog.addEntry(entry);

        if (messageCount === 1000)
            trimOldestMessage();
        else 
            messageCount++;
    };

    var trimOldestMessageEntry = function trimOldestMessageEntry() {
        var entries = activityLog.findAllEntries();

        for (i = 0; i < entries.length; i++) {
            if (entries[i].type === 'message') {
                activityLog.removeEntry(i);
                break;
            }
        }
    };
};

module.exports = chatroom;
