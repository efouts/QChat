var url = function url() {
    this.format = function format(content) {
        var urlRegex = /((?:http|https):\/\/[a-z0-9\/\?=_#&%~-]+(\.[a-z0-9\/\?=_#&%~-]+)+)|(www(\.[a-z0-9\/\?=_#&%~-]+){2,})/gi;
        return content.replace(urlRegex, replace);
    };

    var replace = function replace(str, group1) {        
        return '<a href="' + group1 + '" target="_blank">' + group1 + '</a>';
    };
};

module.exports = url;
