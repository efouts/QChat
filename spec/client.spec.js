describe('QChat Initialize', function() {

  function displayContinuedMessage() {}
  function displayNewMessage() {}
  function displayNewMember() {}
  function removeMemberFromDisplay() {}
  function updateMemberInDisplay() {}
  function updateMemberStatusInDisplay() {}

  beforeEach(function() {
    qchat.initialize($('#messageTextbox'), $('#postMessage'), $('#alias'), displayContinuedMessage, displayNewMessage, displayNewMember, removeMemberFromDisplay, updateMemberInDisplay, updateMemberStatusInDisplay);
  });

  it('Should define Textbox', function() {
    expect(qchat.messageTextBox).toBeDefined();
  });
  it('Should define Post Button', function() {
    expect(qchat.postMessageButton).toBeDefined();
  });
  it('Should define alias', function() {
    expect(qchat.aliasTextBox).toBeDefined();
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

describe('Recieve Message', function() {
  var messageData = undefined;

  function displayContinuedMessage() { messageData = 'whatever';}
  function displayNewMessage() { messageData = 'whatever'; }
  function displayNewMember() { messageData = 'whatever'; }
  function removeMemberFromDisplay() { messageData = 'whatever'; }
  function updateMemberInDisplay() { messageData = 'whatever'; }
  function updateMemberStatusInDisplay() { messageData = 'whatever'; }

  beforeEach(function() {
    messageData = undefined;
    qchat.initialize($('#messageTextbox'), $('#postMessage'), $('#alias'), displayContinuedMessage, displayNewMessage, displayNewMember, removeMemberFromDisplay, updateMemberInDisplay, updateMemberStatusInDisplay);
  });

  it('Should call callback function.', function() {

    var fakeMessages = [{type: 'message', alias : 'Tim', content : 'Send a message', timestamp : new Date()},
                        {type: 'message', alias : 'Derek', content : 'This is a test message', timestamp : new Date()}];

    qchat.dataReceived(fakeMessages);

    expect(messageData).toBeDefined();
    //expect(qchat.messagesPanel.text()).toContain('This is a test message');
  });
});