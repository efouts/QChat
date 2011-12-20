var emoticonsPlugin = function emoticonsPlugin() {
    this.apply = function apply(action) {
        if (action.type !== 'message')
            return action;

        
        action.content = action.content.replace(regex, replaceWithEmoticon);

        return action;
    };

    var buildRegex = function buildRegex() {
        var keys = [];

        for (var key in emoticons)
            keys.push(escapeKey(key));

        return new RegExp('(' + keys.join('|') + ')');
    };

    var escapeKey = function escapeKey(key) {
        return key.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }

    var replaceWithEmoticon = function replaceWithEmoticon(match) {
        return '<img src="images/emoticons/' + emoticons[match] + '" />';
    };

    var emoticons = { ':)': 'happy.gif' };
    var regex = buildRegex();
};

module.exports = emoticonsPlugin;
