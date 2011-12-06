describe('QChat Initialize', function() {

  beforeEach(function() {
    qchat.initialize('messages', 'messageTextbox', 'postMessage', 'derek');
  });
  
  it('Should define MessagesPanel', function() {
    expect(qchat.MessagesPanel).toBeDefined();  
  });
  it('Should define Textbox', function() {
    expect(qchat.MessageTextBox).toBeDefined();  
  });
  it('Should define Button', function() {
    expect(qchat.PostMessageButton).toBeDefined();  
  });
  it('Should create onClick handler for button', function() {
    expect(qchat.PostMessageButton.click).toBeDefined();
  });
  it('Should leave last message received time undefined', function() {
    expect(qchat.LastMessageReceivedDate).toBeUndefined();
  })
});

describe('Post Message', function() {

  beforeEach(function() {
    qchat.initialize('messages', 'messageTextbox', 'postMessage', 'derek');
    qchat.MessageTextBox.val('This is a test message');
    qchat.MessagesPanel.children().empty();
  });
  
  it('Should clear textbox value.', function() {    
    qchat.PostMessageButton.click();
    //qchat.PostMessageButtonClick();
    expect(qchat.MessageTextBox.val()).toEqual('');
  });
});

describe('Recieve Message', function() {
  // TODO: figure out how to fake receiving a message from the server  
  
  beforeEach(function() {
    qchat.initialize('messages', 'messageTextbox', 'postMessage', 'derek');
  });
    
  it('Should add message to display div', function() {
    qchat.MessagesPanel.children();    
    
    var fakeMessages = [{nickname : 'Tim', content : 'Send a message', timestamp : '1'},
                        {nickname : 'Derek', content : 'This is a test message', timestamp : '1'}];
    qchat.MessageReceived(fakeMessages);    
    expect(qchat.MessagesPanel.text()).toContain('This is a test message');
  });  
});