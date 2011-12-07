$(document).ready(function () {

    var sendButton = $("#sendButton");
    var messageTextArea = $("#messageTextArea");
    var chat = $("#chat");

	 var client = new chatClient();
	 client.initialize('chat', 'messageTextArea', 'sendButton', 'alias');

    messageTextArea.focus();
    chat.mousewheel(chatMouseWheel);
    chat.keyup(chatKeyPress);
});

function chatKeyPress(event) {
    alert(event.which);
    if (event.which == 40) {
        chatMouseWheel(null, -1, 0, -1);
    }
    else if (event.which == 38) {
        chatMouseWheel(null, 1, 0, 1);
    }
}

function chatMouseWheel(event, delta, deltaX, deltaY) {
    var chat = $("#chat");

    chat.scrollTop(chat.scrollTop() - (deltaY * 200));
}
