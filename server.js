var express = require('express');
var lessMiddleware = require('less-middleware');
var utils = require('./utilities.js');
var pluginLoader = require('./pluginLoader.js');
var connectionPool = require('./connectionPool.js');
var chatroom = require('./chatroom.js');
var activityLog = require('./activityLog.js');
var activityController = require('./activityController.js');
var chatController = require('./chatController.js');
var pluginsController = require('./pluginsController.js');
var filesController = require('./filesController.js');
var whiteboardController = require('./whiteboardController.js');

var _activityLog = new activityLog();
var _connectionPool = new connectionPool();
var _chatroom = new chatroom(_activityLog);

_chatroom.sendMessage('Server', 'Room created.');

var plugins = pluginLoader.load();

var _activityController = new activityController(_activityLog, _connectionPool, plugins);
var _chatController = new chatController(_chatroom);
var _pluginsController = new pluginsController(_activityLog, plugins, _chatroom);
var _filesController = new filesController(_activityLog);
var _whiteboardController = new whiteboardController(_activityLog);

var app = express();
app.use(express.query());
app.use(express.bodyParser());

app.post('/send', _chatController.send);
app.post('/join', _chatController.join);
app.post('/leave', _chatController.leave);
app.post('/alias', _chatController.alias);
app.post('/status', _chatController.status);
app.post('/whiteboard/edit', _whiteboardController.edit);
app.post('/whiteboard/clear', _whiteboardController.clear);
app.get('/update', _activityController.update);
app.post('/plugins/:name', _pluginsController.plugins);
app.post('/upload', _filesController.upload);
app.get('/download/:id', _filesController.download);

app.use(lessMiddleware({
    src: __dirname + '/static'
}));

app.use(express.static('static'));

var port = 8080;

if (process.argv[2])
  port = process.argv[2];

app.listen(port);
console.log('QChat now running on port ' + port);

