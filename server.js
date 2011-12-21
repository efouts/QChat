var connect = require('connect'); 
var utils = require('./utilities.js');
var pluginLoader = require('./pluginLoader.js');
var connectionPool = require('./connectionPool.js');
var chatroom = require('./chatroom.js');
var activityLog = require('./activityLog.js');
var activityController = require('./activityController.js');
var chatController = require('./chatController.js');
var pluginsController = require('./pluginsController.js');
var filesController = require('./filesController.js');

var _activityLog = new activityLog();
var _connectionPool = new connectionPool();
var _chatroom = new chatroom(_activityLog);

_chatroom.sendMessage('Server', 'Room created.');

var plugins = pluginLoader.load();

var _activityController = new activityController(_activityLog, _connectionPool, plugins);
var _chatController = new chatController(_chatroom);
var _pluginsController = new pluginsController(plugins);
var _filesController = new filesController(_activityLog);

var registerRoutes = function registerRoutes(routes) {
  routes.post('/send', _chatController.send);
  routes.post('/join', _chatController.join);
  routes.post('/leave', _chatController.leave);
  routes.post('/alias', _chatController.alias);
	routes.post('/status', _chatController.status);
	routes.get('/update', _activityController.update);
  routes.post('/plugins/:name', _pluginsController.plugins);
  routes.post('/upload', _filesController.upload);
  routes.get('/download/:id', _filesController.download);    
};

var server = connect.createServer();
server.use(connect.query());
server.use(connect.bodyParser());
server.use(connect.router(registerRoutes));
server.use(connect.static(__dirname + '/static'));

var port = 8080;

if (process.argv[2])
  port = process.argv[2];

server.listen(port);
console.log('QChat now running on port ' + port);

