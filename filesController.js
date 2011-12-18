var utils = require('./utilities.js');

var uploads = [];

var filesController = function filesController(activityLog) {
  this.upload = function (request, response) {
    var upload = {
      id: uploads.length,
      name: request.headers['x-filename'],
      contentType: request.headers['content-type'] || 'application/octet-stream',
      contentLength: request.headers['content-length'],
      data: [],
    };

    var entry = {
      type: 'file',
      path: '/download/' + upload.id
    };
  
    request.on('data', function(chunk) {
      upload.data.push(chunk);
    });
  
    request.on('end', function() {    
      uploads.push(upload);
      activityLog.addEntry(entry);
      utils.emptyResponse(response);
    });
  };

  this.download = function(request, response) {
    var upload = uploads[request.params.id];

    if (!upload) {
      response.writeHead(404);
      response.end('Cannot get /download/' + request.params.id);
      return;      
    }

    var headers = {
      'Content-Length': upload.contentLength,
      'Content-Disposition': 'attachment; filename="' + upload.name + '"'
    };

    response.writeHead(200, headers);

    for(i = 0; i < upload.data.length; i++)
      response.write(upload.data[i]);

    response.end();
  };
};

module.exports = filesController;
