describe('QChat Initialize', function() {

  beforeEach(function() {
    qchat.initialize('messages', 'messageTextbox', 'postMessage', 'alias');
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
    qchat.initialize('messages', 'messageTextbox', 'postMessage', 'alias');
    qchat.MessageTextBox.val('This is a test message');
    qchat.MessagesPanel.children().empty();
  });
  
  it('Should clear textbox value.', function() {    
    qchat.PostMessageButton.click();
    expect(qchat.MessageTextBox.val()).toEqual('');
  });
});

describe('Recieve Message', function() {  
  
  beforeEach(function() {
    qchat.initialize('messages', 'messageTextbox', 'postMessage', 'alias');
  });
    
  it('Should add message to display div', function() {
    qchat.MessagesPanel.children();
    
    var fakeMessages = [{nickname : 'Tim', content : 'Send a message', timestamp : new Date()},
                        {nickname : 'Derek', content : 'This is a test message', timestamp : new Date()}];
    qchat.MessageReceived(fakeMessages);    
    expect(qchat.MessagesPanel.text()).toContain('This is a test message');
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