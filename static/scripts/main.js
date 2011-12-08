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
    var chatWrapper = $("#chatWrapper");
    var membersWrapper = $("#membersWrapper");
    var members = $("#members");

    if (members.hasClass("members-pinned"))
        unpinMembers(chatWrapper, membersWrapper, members);
    else
        pinMembers(chatWrapper, membersWrapper, members);
}

function unpinMembers(chatWrapper, membersWrapper, members) {
    chatWrapper.css("width", "78%");
    membersWrapper.css("width", "22%");

    members.animate({
        width: "90%"
    }, {
        duration: 400,
        complete: function () {
            $(this).animate({
                height: "100%"
            }, 200); 
        }
    });

    members.removeClass("members-pinned");
}

function pinMembers(chatWrapper, membersWrapper, members) {
    members.animate({
        height: "50px"
    }, {
        duration: 200,
        complete: function () {
            $(this).animate({
                width: "55px"
            }, {
                duration: 400,
                complete: function () {
                    membersWrapper.css("width", "10%");
                    chatWrapper.css("width", "90%");
                }
            });

            $(this).addClass("members-pinned");
        }
    });
}