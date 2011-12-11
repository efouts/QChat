var ontime = function ontime() {
    this.format = function format(content) {
        var defectRegex = /%d([0-9]+)/gi;        
        var featureRegex = /%f([0-9]+)/gi;
        
        return content.replace(defectRegex, replaceDefect)
                      .replace(featureRegex, replaceFeature);        
    };

    var replaceDefect = function replaceDefect(match, backReference1) {
        return '<a href="ontime:0_' + backReference1 + '">OnTime Defect #' + backReference1 + '</a>';
    };

    var replaceFeature = function replaceFeature(match, backReference1) {
        return '<a href="ontime:1_' + backReference1 + '">OnTime Feature #' + backReference1 + '</a>';
    };
};

module.exports = ontime;
