var ontime = function ontime() {
    this.apply = function apply(action) {
        if (action.type !== 'message')
            return action;
    
        var defectRegex = /%d([0-9]+)/gi;        
        var featureRegex = /%f([0-9]+)/gi;
        
        action.content = action.content.replace(defectRegex, replaceDefect)
                                       .replace(featureRegex, replaceFeature);        

        return action;
    };

    var replaceDefect = function replaceDefect(match, backReference1) {
        return '<a href="ontime:0_' + backReference1 + '" target="_blank">OnTime Defect #' + backReference1 + '</a>';
    };

    var replaceFeature = function replaceFeature(match, backReference1) {
        return '<a href="ontime:1_' + backReference1 + '" target="_blank">OnTime Feature #' + backReference1 + '</a>';
    };
};

module.exports = ontime;
