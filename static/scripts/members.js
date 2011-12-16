function members(view) {
    var membersList = view.membersList;

    this.displayNewMember = function displayNewMember(data) {
        membersList.append($('<li data="' + data.alias + '"><p><em>' + data.alias + '</em></p></li>'));
    };

    this.removeMemberFromDisplay = function removeMemberFromDisplay(data) {
        view.getMemberListItem(data.alias).remove();
    };

    this.updateMemberInDisplay = function updateMemberInDisplay(data) {
        var memberListItem = view.getMemberListItem(data.previousAlias);
        var memberText = view.getMemberText(data.previousAlias);

        memberListItem.attr('data', data.newAlias);
        memberText.html(data.newAlias);
    };

    this.updateMemberStatusInDisplay = function updateMemberStatusInDisplay(data) {
        var memberText = view.getMemberText(data.alias);
        var statusToShow = data.status;

        if (statusToShow == 'ready')
            statusToShow = '';

        memberText.html(data.alias + ' ' + statusToShow);
    };
};