var formidable = require('formidable');
var utils = require('./utilities.js');

var filesController = function filesController(activityLog) {
  this.upload = function (request, response) {
    var form = new formidable.IncomingForm();
    form.parse(request, function (err, fields, files) {
      utils.emptyResponse(response);
      console.log('fields: ' + fields);
      console.log('files: ' + files);
    });
  };

  this.download = function(request, response) {

  };
};

module.exports = filesController;
