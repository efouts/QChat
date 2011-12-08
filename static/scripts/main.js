$(document).ready(function () {
    var messageTextArea = $("#messageTextArea");
    var chat = $("#chat");
    var membersHeader = $("#membersHeader");

    var client = new chatClient();
    client.initialize('chat', 'messageTextArea', 'sendButton', 'alias');

    messageTextArea.focus();
    chat.mousewheel(chatMouseWheel);
    chat.keyup(chatKeyPress);
    membersHeader.click(membersHeaderClick);
});

function chatMouseWheel(event, delta, deltaX, deltaY) {
    var chat = $("#chat");

    chat.scrollTop(chat.scrollTop() - (deltaY * 200));
}

function chatKeyPress(event) {
    if (event.which == 40)
        chatMouseWheel(null, -1, 0, -1);
    else if (event.which == 38)
        chatMouseWheel(null, 1, 0, 1);
}

function membersHeaderClick() {
    var members = $("#members");

    if (members.hasClass("members-pinned"))
        unpinMembers(members);
    else 
        pinMembers(members);
}

function unpinMembers(members) {
    members.animate({
        marginLeft: "10px",
        marginRight: "20px",
        width: "85%"
    }, {
        duration: 500,
        complete: function () {
            $(this).animate({
                height: "100%"
            }, 300);
        }
    });

    members.removeClass("members-pinned");
}

function pinMembers(members) {
    members.animate({
        height: "50px"
    }, {
        duration: 300,
        complete: function () {
            $(this).animate({
                marginLeft: "170px",
                marginRight: "-160px",
                width: "55px"
            }, 500);

            $(this).addClass("members-pinned");
        }
    });
}