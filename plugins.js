var fileSystem = require('fs');

var plugins = function plugins() {
    this.load = function load() {        
        var filenames = fileSystem.readdirSync('./plugins/');
        var plugins = [];

        for(i = 0; i < filenames.length; i++) {
            var plugin = require('./plugins/' + filenames[i]);
            plugins.push(new plugin());
        }

        return plugins;
    };
};

module.exports = plugins;
