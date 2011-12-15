var utils = require('./utilities.js');

var activityController = function activityController(activityLog, connectionPool, plugins) {
    this.update = function update(request, response) {
        var entries = null;

        if (request.query.since === undefined) {
            entries = activityLog.findAllEntries();
        } else { 
            var since = new Date(request.query.since);
            entries = activityLog.findEntries(since);
        }

        entries = entries.map(applyPlugins);

        if (entries.length)
            utils.jsonResponse(entries, response);
        else 
            connectionPool.add(response, since);
    };

    var applyPlugins = function applyPlugins(entry) {
        var clone = utils.clone(entry);

        for (var name in plugins)
            clone = tryApply(plugins[name], clone);

        return clone;
    };

    var tryApply = function tryApply(plugin, entry) {
        if (!plugin.apply)
            return entry;

        try {
            return plugin.apply(entry);
        } catch (err) {
            console.log(err.message);
        }
    };

    var onActivity = function onActivity() {
        connectionPool.endAll(writeEntries);
    };

    var writeEntries = function writeEntries(response, since) {
        var entries = activityLog.findEntries(since)
                                 .map(applyPlugins);

        utils.jsonResponse(entries, response);
    };

    activityLog.on('activity', onActivity);
};

module.exports = activityController;
