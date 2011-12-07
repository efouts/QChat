var connect = require('connect'); 
var room = require('./room.js');

var chatroom = new room();
var waitingRequests = [];

var send = function send(req, res) {
	res.writeHead(200);
	res.end();

	var content = req.body.content;
	var nickname = req.body.nickname;
	var timestamp = new Date();

	var message = chatroom.createMessage(content, nickname, timestamp);
	chatroom.sendMessage(message);

	while(waitingRequests.length > 0)
		writeMessagesToResponse([ message ], waitingRequests.pop().response);
};

var messages = function messages(request, response) {
	var since = request.query.since;
	var messagesSince = chatroom.getMessages(since);

	if (messagesSince.length) 
		writeMessagesToResponse(messagesSince, response);
	else
		waitingRequests.push({ response: response, timestamp: new Date() });	
};

var writeMessagesToResponse = function writeMessagesToResponse(messages, response) {
	var messageData = JSON.stringify(messages);
	response.writeHead(200, 'application/json');
	response.end(messageData);	
};

var endOldRequests = function endOldRequests() {
	var now = new Date();

	for(i = 0; i < waitingRequests.length; i++) 
		if (now - waitingRequests[i].timestamp > 15000)
			writeMessagesToResponse([], waitingRequests[i].response);	
};

setInterval(endOldRequests, 15000);

var registerRoutes = function registerRoutes(routes) {
	routes.post('/send', send);
	routes.get('/messages', messages);
};

var server = connect.createServer();
server.use(connect.query());
server.use(connect.bodyParser());
server.use(connect.router(registerRoutes));
server.use(connect.static(__dirname + '/static'));

server.listen(8080);

module.exports.httpServer = server;
