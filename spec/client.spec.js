var chatClient = new client();
var testData = undefined;

describe('Join', function () {
    testData = undefined;

    it('Should call callback function.', function () {
        chatClient.join('alias', callback);        
        waitsFor(callback, 'Callback timed out for the join method.', 1000);
    });
});

describe('Change Alias', function () {
    testData = undefined;
    
    it('Should call callback function.', function () {
        chatClient.changeAlias('palias', 'nalias', callback);
        waitsFor(callback, 'Callback timed out for the changeAlias method.', 1000);
    });
});

describe('Leave', function () {
    testData = undefined;

    it('Should call callback function.', function () {
        chatClient.leave('palias', callback);
        waitsFor(callback, 'Callback timed out for the leave method.', 1000);
    });
});

describe('Update', function () {
    testData = undefined;

    it('Should call callback function.', function () {
        chatClient.update(new Date(), callback);
        waitsFor(callback, 'Callback timed out for the update method.', 1000);
    });
});

describe('Send', function () {
    testData = undefined;

    it('Should call callback function.', function () {
        chatClient.send('alias', 'jdhfsjdh', callback);
        waitsFor(callback, 'Callback timed out for the send method.', 1000);
    });
});

describe('Status', function () {
    testData = undefined;

    it('Should call callback function.', function () {
        chatClient.status('alias', 'jdhfsjdh', callback);
        waitsFor(callback, 'Callback timed out for the status method.', 1000);
    });
});

function callback() {
    return true;
}