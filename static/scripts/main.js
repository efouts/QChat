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

function sendMessage() {
    var chat = $("#chat");
    var aliasText = $("#alias").val();

    if (aliasText == "")
        aliasText = "User name here";

    aliasText += ": ";

    chat.append(
        $("<div></div>")
        .addClass("bubble bubble-right shadowed")
        .append(
            $("<span></span>")
            .addClass("user")
            .html(aliasText))
        .append(
            $("<span></span>")
            .html($("#messageTextArea").val().replace(/\n/g, "<br />"))));

    chat.append(
        $("<div></div>")
        .addClass("avatar-wrapper avatar-wrapper-right")
        .append(
            $("<img></img>")
            .attr("src", "Images/Luigi.png")));

    chat.scrollTop(chat.attr("scrollHeight"));
    $("#messageTextArea").val("").focus();
}

function chatMouseWheel(event, delta, deltaX, deltaY) {
    var chat = $("#chat");

    chat.scrollTop(chat.scrollTop() - (deltaY * 200));
}
