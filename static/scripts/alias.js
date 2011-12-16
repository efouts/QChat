function alias(view, client) {
    var currentAlias = undefined;
    var aliasTextBox = view.aliasTextBox;
    var messageTextArea = view.messageTextArea;

    this.getCurrentAlias = function getCurrentAlias() {
        return currentAlias;
    };

    aliasTextBox.keydown(function () {
        if (aliasTextBox.val() !== '')
            messageTextArea.removeAttr('disabled').removeAttr('readOnly').val('');
        else
            messageTextArea.attr('disabled', true).attr('readOnly', true).val('Please type your name into the "Alias" box above to get started');
    });

    aliasTextBox.change(function () {
        var aliasTextBoxValue = aliasTextBox.val();

        if (currentAlias === undefined)
            client.join(aliasTextBoxValue);
        else
            client.changeAlias(currentAlias, aliasTextBoxValue);

        currentAlias = aliasTextBoxValue;
    });

    aliasTextBox.val('').focus();
};