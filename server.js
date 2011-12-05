var connect = require('connect');
var room = require('./room.js');

var chatroom = new room();
var callbacks = [];

var registerRoutes = function registerRoutes(routes) {
	routes.get('/', index);
	routes.post('/send', send);
	routes.get('/messages', messages);
};

var index = function index(req, res) {
	res.writeHead(200);
	res.end();
};

var send = function send(req, res) {
	var content = req.body.content;
	var nickname = req.body.nickname;
	var timestamp = new Date();

	var message = chatroom.createMessage(content, nickname, timestamp);
	chatroom.sendMessage(message);

	res.writeHead(200);
	res.end();

	while(callbacks.length  > 0)
		callbacks.pop()([ message ]);
};

var messages = function messages(req, res) {
	var since = req.query.since;
	
	var messagesSince = chatroom.getMessages(since);

	var callback = function(messagesToSend) {
		res.writeHead(200, 'application/json');
		res.end(JSON.stringify(messagesToSend));
	};

	if (messagesSince.length) {
		callback(messagesSince);
	} else {
		callbacks.push(callback);
	}
};

var server = connect.createServer();
server.use(connect.query());
server.use(connect.bodyParser());
server.use(connect.router(registerRoutes));
server.use(connect.static(__dirname + '/static'));

server.listen(8080);

module.exports.httpServer = server; 
//module.exports.room = room;
