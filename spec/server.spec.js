var assert = require('assert');

exports.sendReturnsEmptyResponse = function() {	
	var httpServer = require('../server.js').httpServer;	
	var request = { url: '/send', method: 'POST', data: 'message' };
	var expectedResponse = { status: 200 };
	assert.response(httpServer, request, expectedResponse);
};
