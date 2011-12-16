var chatClient = new client();
var testData = undefined;

describe('Join', function () {
    testData = undefined;

    it('Should call callback function.', function () {
        chatClient.join('alias', callback);
        expect(testData).toBeDefined();
    });
});

describe('Change Alias', function () {
    testData = undefined;
    
    it('Should call callback function.', function () {
        chatClient.changeAlias('palias', 'nalias', callback);
        assertTestDataIsDefined();
    });
});

describe('Leave', function () {
    testData = undefined;

    it('Should call callback function.', function () {
        chatClient.leave('palias', callback);
        assertTestDataIsDefined();
    });
});

describe('Update', function () {
    testData = undefined;

    it('Should call callback function.', function () {
        chatClient.update(new Date(), callback);
        assertTestDataIsDefined();
    });
});

describe('Send', function () {
    testData = undefined;

    it('Should call callback function.', function () {
        chatClient.send('alias', 'jdhfsjdh', callback);
        assertTestDataIsDefined();
    });
});

describe('Status', function () {
    testData = undefined;

    it('Should call callback function.', function () {
        chatClient.status('alias', 'jdhfsjdh', callback);
        assertTestDataIsDefined();
    });
});

function callback() {
    testData = 'test'; 
}

function assertTestDataIsDefined() {
    expect(testData).toBeDefined();
}