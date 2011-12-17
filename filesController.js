var multipart = require('multipart');
var utils = require('./utilities.js');

var filesController = function filesController(activityLog) {
  this.upload = function (request, response) {
    request.setBodyEncoding('binary');
    var stream = new multipart.Stream(request);
    
    stream.addListener('part', function(part) {
      part.addListener('body', function(chunk) {
        var progress = (stream.bytesReceived / stream.bytesTotal * 100).toFixed(20);
        console.log(progress '% complete');
      });
    });

    stream.addListener('complete', function() {
      utils.emptyResponse(response);

      var entry = { type: 'file' };
      activityLog.addEntry(entry);
    });
  };

  this.download = function(request, response) {

  };
};

module.exports = filesController;
