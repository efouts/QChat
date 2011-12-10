var connect = require('connect'); 
var utils = require('./utilities.js');
var connectionPool = require('./connectionPool.js');
var chatroom = require('./chatroom.js');
var chatController = require('./chatController.js');
var plugins = require('./plugins.js');

var _connectionPool = new connectionPool();
var _chatroom = new chatroom();

var onMessage = function onMessage() {
    _connectionPool.endAll(sendMessagesSince);
};

var sendMessagesSince = function sendMessagesSince(response, since) {
    var activity = _chatroom.findActivity(since);
    utils.jsonResponse(activity, response);
};

_chatroom.on('activity', onMessage);
_chatroom.sendMessage('Server', 'Room created.');

var _plugins = new plugins();
var formatters = _plugins.load();

var _chatController = new chatController(_chatroom, _connectionPool, formatters);

var registerRoutes = function registerRoutes(routes) {
	routes.post('/send', _chatController.send);
	routes.get('/update', _chatController.update);
    routes.post('/join', _chatController.join);
    routes.post('/leave', _chatController.leave);
    routes.post('/alias', _chatController.alias);
};

var server = connect.createServer();
server.use(connect.query());
server.use(connect.bodyParser());
server.use(connect.router(registerRoutes));
server.use(connect.static(__dirname + '/static'));

server.listen(8080);
