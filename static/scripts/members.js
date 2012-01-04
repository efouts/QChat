function members(view) {
    var membersList = view.membersList;

    this.displayActivity = function displayActivity(activity) {
        if (activity.type == 'join')
            addNewMember(activity.alias);
        else if (activity.type == 'leave')
            removeMember(activity.alias);
        else if (activity.type == 'alias')
            updateMemberAlias(activity.previousAlias, activity.newAlias);
        else if (activity.type == 'status')
            updateMemberStatus(activity.alias, activity.status);
    };

    var addNewMember = function addNewMember(alias) {
        membersList.append($('<li data="' + alias + '"><p><em>' + alias + '</em></p></li>'));
    };

    var removeMember = function removeMember(alias) {
        view.getMemberListItem(alias).remove();
    };

    var updateMemberAlias = function updateMemberAlias(previousAlias, newAlias) {
        var memberListItem = view.getMemberListItem(previousAlias);
        var memberText = view.getMemberText(previousAlias);

        memberListItem.attr('data', newAlias);
        memberText.html(newAlias);
    };

    var updateMemberStatus = function updateMemberStatus(alias, status) {
        var memberText = view.getMemberText(alias);

        if (status == 'typing')
            status = '<img src="images/typing-bubble-small.png" />';
        else if (status == 'drawing')
            status = '<img src="images/marker-icon.png" />';
        else
            status = '';

        memberText.html(alias + status);
    };
};