var fileSystem = require('fs');

module.exports.load = function load() {        
    var pluginDirectory = './plugins/';
    var filenames = fileSystem.readdirSync(pluginDirectory);
    var plugins = [];

    for(i = 0; i < filenames.length; i++) {
        var name = filenames[i].substr(0, filenames[i].lastIndexOf('.')) || filenames[i];
        var plugin = require(pluginDirectory + filenames[i]);
        plugins[name] = new plugin();
    }

    return plugins;
};
