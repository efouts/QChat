var chatClient = new client();

describe('Join', function () {
    it('Should call callback function.', function () {
        chatClient.join('alias', callback);        
        waitsFor(callback, 'Callback timed out for the join method.', 1000);
    });
});

describe('Change Alias', function () {    
    it('Should call callback function.', function () {
        chatClient.changeAlias('palias', 'nalias', callback);
        waitsFor(callback, 'Callback timed out for the changeAlias method.', 1000);
    });
});

describe('Leave', function () {
    it('Should call callback function.', function () {
        chatClient.leave('palias', callback);
        waitsFor(callback, 'Callback timed out for the leave method.', 1000);
    });
});

describe('Update', function () {
    it('Should call callback function.', function () {
        chatClient.update(new Date(), callback);
        waitsFor(callback, 'Callback timed out for the update method.', 1000);
    });
});

describe('Send', function () {
    it('Should call callback function.', function () {
        chatClient.send('alias', 'jdhfsjdh', callback);
        waitsFor(callback, 'Callback timed out for the send method.', 1000);
    });
});

describe('Status', function () {
    it('Should call callback function.', function () {
        chatClient.status('alias', 'jdhfsjdh', callback);
        waitsFor(callback, 'Callback timed out for the status method.', 1000);
    });
});

function callback() {
    return true;
}