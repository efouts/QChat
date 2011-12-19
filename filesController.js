var utils = require('./utilities.js');

var uploads = [];

var filesController = function filesController(activityLog) {
  this.upload = function (request, response) {
    var upload = {
      id: uploads.length,
      name: request.headers['x-filename'],      
      contentLength: request.headers['content-length'],
      data: []
    };

    var fileIsImage = isImage(request.headers['content-type']);    

    var entry = {
      type: fileIsImage ? 'image' : 'file',
      alias: request.headers['x-alias'],
      name: request.headers['x-filename'],
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

  var isImage = function(contentType) {
    return contentType === 'image/jpeg' || contentType === 'image/gif' || contentType === 'image/png';    
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
      'Content-Disposition': 'inline; filename="' + upload.name + '"'
    };

    response.writeHead(200, headers);

    for(i = 0; i < upload.data.length; i++)
      response.write(upload.data[i]);

    response.end();
  };
};

module.exports = filesController;
