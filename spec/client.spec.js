describe('QChat Initialize', function() {

  beforeEach(function() {
    qchat.initialize('messages', 'messageTextbox', 'postMessage', 'alias');
  });
  
  it('Should define MessagesPanel', function() {
    expect(qchat.messagesPanel).toBeDefined();  
  });
  it('Should define Textbox', function() {
    expect(qchat.messageTextBox).toBeDefined();  
  });
  it('Should define Button', function() {
    expect(qchat.postMessageButton).toBeDefined();  
  });
  it('Should create onClick handler for button', function() {
    expect(qchat.postMessageButton.click).toBeDefined();
  });
  it('Should leave last message received time undefined', function() {
    expect(qchat.lastMessageReceivedDate).toBeUndefined();
  });
  it('Should leave last message user undefined', function() {
    expect(qchat.lastMessageUser).toBeUndefined();
  });
});

describe('Post Message', function() {

  beforeEach(function() {
    qchat.initialize('messages', 'messageTextbox', 'postMessage', 'alias');
    qchat.messageTextBox.val('This is a test message');
    qchat.messagesPanel.children().empty();
  });
  
  it('Should clear textbox value.', function() {    
    qchat.postMessageButton.click();
    expect(qchat.messageTextBox.val()).toEqual('');
  });
});

describe('Recieve Message', function() {  
  
  beforeEach(function() {
    qchat.initialize('messages', 'messageTextbox', 'postMessage', 'alias');
  });
    
  it('Should add message to display div', function() {
    qchat.messagesPanel.children();
    
    var fakeMessages = [{nickname : 'Tim', content : 'Send a message', timestamp : new Date()},
                        {nickname : 'Derek', content : 'This is a test message', timestamp : new Date()}];
    qchat.messageReceived(fakeMessages);    
    expect(qchat.messagesPanel.text()).toContain('Send a message');
    expect(qchat.messagesPanel.text()).toContain('This is a test message');
  });  
});

describe('Formatting functions', function() {
	
  beforeEach(function() {
      qchat.initialize('messages', 'messageTextbox', 'postMessage', 'alias');
   });
  
  it('Should format time in 12 hour format.', function() {
    var formattedDate = qchat.Format12HourTime(new Date(11, 12, 6, 18, 30, 0));
    expect(formattedDate).toEqual('6:30:00 pm');
  });
});