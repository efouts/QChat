var connect = require('connect'); 
var chatroom = require('./chatroom.js');
var messagesController = require('./messagesController.js');
var aliasesController = require('./aliasesController.js');

var _chatroom = new chatroom();
var _messagesController = new messagesController(_chatroom);
var _aliasesController = new aliasesController(_chatroom);

var registerRoutes = function registerRoutes(routes) {
	routes.post('/send', _messagesController.sendMessage);
	routes.get('/messages', _messagesController.getMessages);
    routes.post('/enter', _aliasesController.enter);
    routes.post('/exit', _aliasesController.exit);
    routes.post('/alias', _aliasesController.alias);
};

var server = connect.createServer();
server.use(connect.query());
server.use(connect.bodyParser());
server.use(connect.router(registerRoutes));
server.use(connect.static(__dirname + '/static'));

server.listen(8080);
