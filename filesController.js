var utils = require('./utilities.js');

var uploads = [];
var idCount = 0;

var filesController = function filesController(activityLog) {
    this.upload = function (request, response) {
        var filename = request.headers['x-filename'];
        var contentLength = request.headers['content-length'];
        var alias = request.headers['x-alias'];

        if (utils.isAvailable([ filename, contentLength, alias ]) == false) {
            utils.statusResponse(400, response);
            return;
        }

        var upload = {
            id: idCount++,
            name: filename,
            contentLength: contentLength,
            data: []
        };

        var fileIsImage = isImage(filename);

        var entry = {
            type: fileIsImage ? 'image' : 'file',
            alias: alias,
            name: filename,
            path: '/download/' + upload.id,
            fileId: upload.id
        };

        request.on('data', function (chunk) {
            upload.data.push(chunk);
        });

        request.on('end', function () {
            uploads.push(upload);
            activityLog.addEntry(entry);
            utils.emptyResponse(response);
        });
    };

    var isImage = function (filename) {
        return filename.match(/\.(jpg|gif|png|bmp|jpeg)$/i);
    };

    this.download = function (request, response) {
        var id = request.params.id;

        if (utils.isAvailable([ id ]) == false) {
          utils.statusResponse(400, response);
          return;
        }

        var upload = uploads[id];

        if (!upload) {
            response.writeHead(404);
            response.end('Cannot get /download/' + id);
            return;
        }

        var headers = {
            'Content-Length': upload.contentLength,
            'Content-Disposition': 'inline; filename="' + upload.name + '"'
        };

        response.writeHead(200, headers);

        for (i = 0; i < upload.data.length; i++)
            response.write(upload.data[i]);
        
        response.end();
    };
};

module.exports = filesController;
