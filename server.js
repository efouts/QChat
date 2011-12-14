var connect = require('connect'); 
var utils = require('./utilities.js');
var connectionPool = require('./connectionPool.js');
var chatroom = require('./chatroom.js');
var controller = require('./controller.js');
var pluginLoader = require('./pluginLoader.js');

var plugins = pluginLoader.load();

var _connectionPool = new connectionPool();
var _chatroom = new chatroom(plugins);
var _controller = new controller(_chatroom, _connectionPool);

_chatroom.sendMessage('Server', 'Room created.');

var registerRoutes = function registerRoutes(routes) {
	routes.post('/send', _controller.send);
	routes.get('/update', _controller.update);
    routes.post('/join', _controller.join);
    routes.post('/leave', _controller.leave);
    routes.post('/alias', _controller.alias);
	routes.post('/status', _controller.status);

    routes.post('/plugins/:name', function(request, response) {
        var name = request.params.name;
        var plugin = plugins[name];

        if (plugin.handle)
            plugin.handle(request, response, _chatroom);
    });
};

var server = connect.createServer();
server.use(connect.query());
server.use(connect.bodyParser());
server.use(connect.router(registerRoutes));
server.use(connect.static(__dirname + '/static'));

if (!process.argv[2]) {
    console.log('Specify a port via commandline');	
} else {
    var port = process.argv[2];
    server.listen(port);
    console.log('QChat now running on port ' + port);
}
