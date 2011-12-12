var fileSystem = require('fs');

module.exports.load = function load() {        
    var pluginDirectory = './plugins/';
    var filenames = fileSystem.readdirSync(pluginDirectory);
    var plugins = [];

    for(i = 0; i < filenames.length; i++) {
        var plugin = require(pluginDirectory + filenames[i]);
        plugins.push(new plugin());
    }

    return plugins;
};
