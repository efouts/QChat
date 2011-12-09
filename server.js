var connect = require('connect'); 
var utils = require('./utilities.js');
var connectionPool = require('./connectionPool.js');
var chatroom = require('./chatroom.js');
var chatController = require('./chatController.js');
var message = require('./message.js');

var _connectionPool = new connectionPool();
var _chatroom = new chatroom();

var onMessage = function onMessage() {
    _connectionPool.endAll(sendMessagesSince);
};

var sendMessagesSince = function sendMessagesSince(response, since) {
    var messages = _chatroom.findMessages(since);
    utils.jsonResponse(messages, response);
};

_chatroom.on('message', onMessage);
_chatroom.sendMessage('Server', 'Room created.', new Date(), message.types.server);

var _chatController = new chatController(_chatroom, _connectionPool);

var registerRoutes = function registerRoutes(routes) {
	routes.post('/send', _chatController.send);
	routes.get('/messages', _chatController.messages);
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
