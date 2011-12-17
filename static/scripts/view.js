function view() {
    this.aliasTextBox = $('#alias');
    this.messageTextArea = $('#messageTextArea');
    this.chat = $('#chat');
    this.members = $('#members');
    this.chatWrapper = $('#chatWrapper');
    this.membersWrapper = $('#membersWrapper');
    this.membersList = $('#members ol');
    this.membersHeader = $('#membersHeader');
    this.fileUploader = $('#fileUploader');

    this.getMemberListItem = function (alias) {
        return this.membersList.children('li[data="' + alias + '"]').first();
    };

    this.getMemberText = function (alias) {
        return this.getMemberListItem(alias).children('p').children('em');
    };
};