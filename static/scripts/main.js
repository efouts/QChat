var client = new chatClient();

$(document).ready(function () {
    var chat = $('#chat');
    var messageTextArea = $('#messageTextArea');
    var sendButton = $('#sendButton');    
    var alias = $('#alias');
    var membersHeader = $('#membersHeader');

    client.initialize(chat, messageTextArea, sendButton, alias, displayContinuedMessage, displayNewMessage);

    alias.focus();
    chat.mousewheel(chatMouseWheel);
    chat.keypress(chatKeyPress);
    membersHeader.click(membersHeaderClick);
});

function displayContinuedMessage(message) {
    var messageHtml = message.content.replace(/\n/g, '<br />');
    var chatBubble = $('#chat').children('.bubble').last();
    
    chatBubble.append($('<div class="message-divider"></div>'));
        
    chatBubble.append($('<span class="user"></span>')
        .html('(' + format12HourTime(new Date(message.timestamp)) + '): '));

    chatBubble.append($("<span></span>")
        .html(messageHtml));
}

function displayNewMessage(message) {
    var messageHtml = message.content.replace(/\n/g, '<br />');
    var chat = $('#chat');
    var newMessage = $('<div class="shadowed bubble"><span class="user">' + 
        '(' + format12HourTime(new Date(message.timestamp)) + '): ' + '</span><span>' + messageHtml + '</span></div>');
        
    var newAvatarWrapper = $('<div class="avatar-wrapper"><p>' + message.alias + '</p></div>');
        
    if (message.alias == client.alias) {
        newMessage.addClass('bubble-right');
        newAvatarWrapper.addClass('avatar-wrapper-right');
    }
    else {
        newMessage.addClass('bubble-left');
        newAvatarWrapper.addClass('avatar-wrapper-left');
    }
    
    chat.append(newMessage);    
    chat.append(newAvatarWrapper);
}

function format12HourTime(dateTime){
    var hours = dateTime.getHours();
    var ampm = 'AM';
    
    if (hours >= 12) 
    {
        ampm = 'PM';
        hours -= 12;
    }
    
    if (hours === 0)
        hours = 12;
    
    var minutes = dateTime.getMinutes();
    if (minutes < 10)
        minutes = '0' + minutes;

    var seconds = dateTime.getSeconds();
    if (seconds < 10)
        seconds = '0' + seconds;
    
    return hours + ':' + minutes + ':' + seconds + ' ' + ampm; 
}

function chatMouseWheel(event, delta, deltaX, deltaY) {
    var chat = $("#chat");

    chat.scrollTop(chat.scrollTop() - (deltaY * 200));
}

function chatKeyPress(event) {
    alert(event.which);
    if (event.which == 40)
        chatMouseWheel(null, -1, 0, -1);
    else if (event.which == 38)
        chatMouseWheel(null, 1, 0, 1);
}

function membersHeaderClick() {
    var chatWrapper = $('#chatWrapper');
    var membersWrapper = $('#membersWrapper');
    var members = $('#members');

    if (members.hasClass("members-pinned"))
        maximizeMembers(chatWrapper, membersWrapper, members);
    else
        minimizeMembers(chatWrapper, membersWrapper, members);
}

function maximizeMembers(chatWrapper, membersWrapper, members) {
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

function minimizeMembers(chatWrapper, membersWrapper, members) {
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