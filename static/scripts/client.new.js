function client(options) {
    this.join = function join(alias, callback) {
        var data = { alias: alias };
        $.post('/join', data, callback);
    };

    this.changeAlias = function changeAlias(previousAlias, newAlias, callback) {
        var data = { previousAlias: previousAlias, newAlias: newAlias };
        $.post('/alias', data, callback);
    };

    this.leave = function leave(alias, callback) {
        var data = { alias: alias };
        $.post('/leave', data, callback);
    };

    this.update = function update(since, callback) {
        var data = { since: since };
        $.getJSON('/update', data, callback);
    };

    this.send = function send(alias, content, callback) {
        var data = { alias: alias, content: content };
        $.post('/send', data, callback);
    };
};

