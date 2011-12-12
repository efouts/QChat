var urlPlugin = function urlPlugin() {
    this.apply = function apply(action) {
        if (action.type !== 'message')
            return action;

        var urlRegex = /(((http|ftp|https):\/\/)|www\.)[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#!]*[\w\-\@?^=%&/~\+#])?/gi;
        action.content = action.content.replace(urlRegex, replaceUrl);

        return action;
    };

    var replaceUrl = function replaceUrl(match) {
        return '<a href="' + match + '" target="_blank">' + match + '</a>';
    };
};

module.exports = urlPlugin;
