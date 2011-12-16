function membersAnimator(view) {
    var members = view.members;
    var membersHeader = view.membersHeader;
    var chatWrapper = view.chatWrapper;
    var membersWrapper = view.membersWrapper;

    membersHeader.click(function membersHeaderClick() {
        if (members.hasClass('members-pinned'))
            maximizeMembers();
        else
            minimizeMembers();
    });

    var maximizeMembers = function maximizeMembers() {
        chatWrapper.css('width', '78%');
        membersWrapper.css('width', '22%');

        members.animate(
        { width: '90%' },
        {
            duration: 400,
            complete: function () { $(this).animate({ height: '100%' }, 200); }
        });

        members.removeClass('members-pinned');
    };

    var minimizeMembers = function minimizeMembers() {
        members.animate(
        { height: '50px' },
        {
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
    };
};