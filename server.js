var connect = require('connect'); 
var utils = require('./utilities.js');
var connectionPool = require('./connectionPool.js');
var chatroom = require('./chatroom.js');
var activityLog = require('./activityLog.js');
var activityController = require('./activityController.js');
var chatController = require('./chatController.js');
var pluginsController = require('./pluginsController.js');
var pluginLoader = require('./pluginLoader.js');

var _activityLog = new activityLog();
var _connectionPool = new connectionPool();
var _chatroom = new chatroom(_activityLog);

_chatroom.sendMessage('Server', 'Room created.');

var plugins = pluginLoader.load();

var _activityController = new activityController(_activityLog, _connectionPool, plugins);
var _chatController = new chatController(_chatroom);
var _pluginsController = new pluginsController(plugins);

var registerRoutes = function registerRoutes(routes) {
	routes.post('/send', _chatController.send);
    routes.post('/join', _chatController.join);
    routes.post('/leave', _chatController.leave);
    routes.post('/alias', _chatController.alias);
	routes.post('/status', _chatController.status);
	routes.get('/update', _activityController.update);
    routes.get('/plugins/:name', _pluginsController.plugins);
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
