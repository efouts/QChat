function client() {
    this.join = function join(alias, callback) {
        var data = { alias: alias };
        $.post('/join', data).complete(callback);
    };

    this.changeAlias = function changeAlias(previousAlias, newAlias, callback) {
        var data = { previousAlias: previousAlias, newAlias: newAlias };
        $.post('/alias', data).complete(callback);
    };

    this.leave = function leave(alias, callback) {
        var data = { alias: alias };
        $.ajax({ url : '/leave', async: false, type: 'POST', data: { alias: alias }});
        callback();
    };

    this.update = function update(since, callback) {
        var data = { since: since };
        $.getJSON('/update', data, callback);
    };

    this.send = function send(alias, content, callback) {
        var data = { alias: alias, content: content };
        $.post('/send', data).complete(callback);
    };

    this.status = function status(alias, status, callback) {
        var data = { alias: alias, status: status };
        $.post('/status', data).complete(callback);
    };
};