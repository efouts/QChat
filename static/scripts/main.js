var client = new chatClient();

$(document).ready(function () {
    var chat = $('#chat');
    var messageTextArea = $('#messageTextArea');
    var sendButton = $('#sendButton');    
    var alias = $('#alias');
    var membersHeader = $('#membersHeader');
    var members = $('#members');

    client.initialize(chat, messageTextArea, sendButton, alias, displayContinuedMessage, displayNewMessage, displayNewMember, removeMemberFromDisplay, updateMemberInDisplay);

    alias.focus();
    chat.mousewheel(scrollChat);
    membersHeader.click(membersHeaderClick);
    $(window).keydown(windowKeyDown);
});

function displayContinuedMessage(message) {
    var messageHtml = message.content.replace(/\n/g, '<br />');
    var chatMessage = $('#chat').children('.message').last();
    
    chatMessage.append($('<div class="message-divider"></div>'));        
    chatMessage.append($(getInnerMessageHtml(message)));
}

function displayNewMessage(message) {
    var newMessage = $('<div class="shadowed message">' + getInnerMessageHtml(message) + '</div>');        
    var newAvatarWrapper = $('<div class="avatar-wrapper"><p>' + message.alias + '</p></div>');
        
    if (message.alias == client.alias) {
        newMessage.addClass('message-right');
        newAvatarWrapper.addClass('avatar-wrapper-right');
    }
    else {
        newMessage.addClass('message-left');
        newAvatarWrapper.addClass('avatar-wrapper-left');
    }
    
    var chat = $('#chat');
    
    chat.append(newMessage);    
    chat.append(newAvatarWrapper);
}

function getInnerMessageHtml(data) {
    var timestamp = format12HourTime(new Date(data.timestamp));
    var messageHtml = data.content.replace(/\n/g, '<br />');
    
    return '<span class="timestamp">(' + timestamp + '): </span><span>' + messageHtml + '</span>';
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

function displayNewMember(data) {
    var membersList = $('#members ol');
    membersList.append($('<li data="' + data.alias + '"><p><em>' + data.alias + '</em></p></li>'));
}

function removeMemberFromDisplay(data) {
    $('#members ol li[data="' + data.alias + '"]').remove();
}

function updateMemberInDisplay(data) {
    var memberListItem = $('#members ol li[data="' + data.previousAlias + '"]');
    var memberText = memberListItem.children('p').children('em');
    
    memberListItem.attr('data', data.newAlias);
    memberText.html(data.newAlias);
}

function scrollChat(event, delta, deltaX, deltaY) {
    var chat = $("#chat");

    chat.scrollTop(chat.scrollTop() - (deltaY * 200));
}

function windowKeyDown(event) {
    if (event.which == 40)
        scrollChat(null, -1, 0, -1);
    else if (event.which == 38)
        scrollChat(null, 1, 0, 1);
}

function membersHeaderClick() {
    var chatWrapper = $('#chatWrapper');
    var membersWrapper = $('#membersWrapper');
    var members = $('#members');

    if (members.hasClass('members-pinned'))
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