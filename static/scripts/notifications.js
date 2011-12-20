function notifications() {
    this.enableNotificationsCheckbox = undefined;
    var chromeNotify = undefined;
    var pinnedSite = undefined;
    var isWindowHidden = false;
    var unreadMessagesCount = 0;

    this.initialize = function initialize(enableNotificationsCheckbox) {
        this.enableNotificationsCheckbox = enableNotificationsCheckbox;

        chromeNotify = new chromeNotifications();
        chromeNotify.initialize(enableNotificationsCheckbox);
        pinnedSite = new pinnableSite();

        if (/*@cc_on!@*/false) {
            document.onfocusin = onWindowFocus;
            document.onfocusout = onWindowBlur;
        } else {
            window.onfocus = onWindowFocus;
            window.onblur = onWindowBlur;
        }
    }

    function onWindowFocus() {
        isWindowHidden = false;
        pinnedSite.clearOverlayIcon();
    }

    function onWindowBlur() {
        isWindowHidden = true;
    }

    this.showNotification = function showNotification(message) {
        if (this.enableNotificationsCheckbox.attr('checked') !== 'checked' || !isWindowHidden)
        {
            unreadMessagesCount = 0;
            pinnedSite.clearOverlayIcon();
            return;
        }

        unreadMessagesCount++;

        chromeNotify.showWebkitToast(message);
        pinnedSite.setOverlayIcon(getIconUrl(unreadMessagesCount), 'You have ' + unreadMessagesCount + ' unread messages.');

        if (unreadMessagesCount > 9)
            pinnedSite.flashWindow();
    }

    var getIconUrl = function getIconUrl(messageCount) {
        var url = undefined;
        if (messageCount > 0 && messageCount < 10)
            url = '/images/' + unreadMessagesCount + '.ico';
        else if (messageCount > 9)
            url = '/images/more.ico';
        return url;
    }

    var chromeNotifications = function chromeNotifications() {
        var webkitToastPermissions = undefined;

        var webkitPermissionAllowed = 0;
        var webkitPermissionNotAllowed = 1;
        var webkitPermissionDenied = 2;

        this.initialize = function initialize(enableNotificationsCheckbox) {
            enableNotificationsCheckbox.click(this.checkForNotificationPermissions);
            this.checkForNotificationPermissions();
        }

        this.showWebkitToast = function showWebkitToast(message) {
            if (!this.hasNotificationPermission())
                return;

            if (message.type !== 'message')
                return;

            var notification = webkitNotifications.createNotification(
                'images/q-logo.png',
                message.alias,
                message.content
            );

            notification.show();
            setTimeout(closeWebkitToast, 5000, notification);
        }

        var closeWebkitToast = function closeWebkitToast(notification) {
            notification.cancel();
        }

        this.checkForNotificationPermissions = function checkForNotificationPermissions() {
            try {
                webkitToastPermissions = webkitNotifications.checkPermission();

                if (webkitToastPermissions === webkitPermissionNotAllowed)
                    webkitNotifications.requestPermission(permissionsCheckReturn);
            }
            catch (err) {
                webkitToastPermissions = webkitPermissionDenied;
            }
        }

        function permissionsCheckReturn() {
            webkitToastPermissions = webkitNotifications.checkPermission();
        }

        this.hasNotificationPermission = function hasNotificationPermission() {
            return webkitToastPermissions === webkitPermissionAllowed;
        }
    }

    var pinnableSite = function pinnableSite() {
        this.flashWindow = function flashWindow() {
            if (!isPinnedSite())
                return;

            window.external.msSiteModeActivate();
        }

        this.clearOverlayIcon = function clearOverlayIcon() {
            if (!isPinnedSite())
                return;

            window.external.msSiteModeClearIconOverlay();
        }

        this.setOverlayIcon = function setOverlayIcon(iconUri, descText) {
            if (!isPinnedSite())
                return;

            if (iconUri !== undefined)
                window.external.msSiteModeSetIconOverlay(iconUri, descText);
        }

        var isPinnedSite = function isPinnedSite() {
            try {
                if (window.external.msIsSiteMode())
                    return true;
                else
                    return false;
            }
            catch (ex) {
                return false;
            }
        }
    }
}

$(document).ready(function() {
    window.notify = new notifications();
    window.notify.initialize($('#enableNotifications'));
});
