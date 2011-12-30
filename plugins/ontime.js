var ontime = function ontime() {
    this.apply = function apply(action) {
        if (action.type !== 'message')
            return action;

        var defectRegex = /%d([0-9]+)/gi;
        var featureRegex = /%f([0-9]+)/gi;
        var taskRegex = /%t([0-9]+)/gi;
        var incidentRegex = /%i([0-9]+)/gi;

        action.content = action.content.replace(defectRegex, replaceDefect)
                                       .replace(featureRegex, replaceFeature)
                                       .replace(taskRegex, replaceTask);

        return action;
    };

    var replaceDefect = function replaceDefect(match, backReference1) {
        return generateLink(0, backReference1, "Defect");
    };

    var replaceFeature = function replaceFeature(match, backReference1) {
        return generateLink(1, backReference1, "Feature");
    };

    var replaceTask = function replaceTask(match, backReference1) {
        return generateLink(2, backReference1, "Task");
    };

    var generateLink = function generateLink(onTimePrefixNumber, onTimeItemNumber, onTimeItemName) {
        return '<a href="ontime:' + onTimePrefixNumber + '_' + onTimeItemNumber + '" target="_blank">OnTime ' + onTimeItemName + ' #' + onTimeItemNumber + '</a>';
    };
};

module.exports = ontime;
