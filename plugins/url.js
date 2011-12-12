var urlPlugin = function urlPlugin() {
    this.apply = function apply(action) {
        if (action.type !== 'message')
            return action;

        var urlRegex = /((?:http|https):\/\/[a-z0-9\/\?=_#&%~-]+(\.[a-z0-9\/\?=_#&%~-]+)+)|(www(\.[a-z0-9\/\?=_#&%~-]+){2,})/gi;
        action.content = action.content.replace(urlRegex, replaceUrl);

        return action;
    };

    var replaceUrl = function replaceUrl(match, backReference1) {
        return '<a href="' + backReference1 + '" target="_blank">' + backReference1 + '</a>';
    };
};

module.exports = urlPlugin;
