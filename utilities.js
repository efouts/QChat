module.exports.htmlEncode = function htmlEncode(string) {
    return String(string)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}; 

module.exports.jsonResponse = function jsonResponse(data, response) {
    var jsonData = JSON.stringify(data);
    response.writeHead(200, 'application/json');
    response.end(jsonData);	
};

module.exports.emptyResponse = function emptyResponse(response) {
    response.writeHead(200);
    response.end();
};

module.exports.statusResponse = function statusResponse(status, response) {
    response.writeHead(status);
    response.end();
};

module.exports.clone = function clone(object) {
	var clone = {};
	
	for(var prop in object)
		clone[prop] = object[prop];
		
	return clone;
};
