var emoticonsPlugin = function emoticonsPlugin() {
    this.apply = function apply(action) {
        if (action.type === 'message')
            action.content = action.content.replace(emoticonRegex, replaceWithEmoticon);        

        return action;
    };

    var buildRegex = function buildRegex() {
        var keys = [];

        for (var key in emoticons)
            keys.push(escapeKey(key));

        return new RegExp('(' + keys.join('|') + ')', 'g');
    };

    var escapeKey = function escapeKey(key) {
        return key.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }

    var replaceWithEmoticon = function replaceWithEmoticon(match) {
        return '<img src="images/emoticons/' + emoticons[match] + '" />';
    };

    var emoticons = {
        ':)': 'happy.gif',
        ':(': 'sad.gif',
        ';)': 'winking.gif',
        ':D': 'big_grin.gif',
        ';;)': 'eyelashes.gif',
        '>:D<': 'big_hug.gif',
        ':-/': 'confused.gif',
        ':x': 'love_struck.gif',
        ':">': 'blushing.gif',
        ':P': 'tongue.gif',
        ':-*': 'kiss.gif',
        '=((': 'broken_heart.gif',
        ':-O': 'surprise.gif',
        'X(': 'angry.gif',
        ':>': 'smug.gif',
        'B-)': 'cool.gif',
        ':-S': 'worried.gif',
        '#:-S': 'whew.gif',
        '>:)': 'devil.gif',
        ':((': 'crying.gif',
        ':))': 'laughing.gif',
        ':|': 'straight_face.gif',
        '/:)': 'raised_eyebrows.gif',
        '=))': 'rotfl.gif',
        'O:-)': 'angel.gif',
        ':-B': 'nerd.gif',
        '=;': 'talk_to_the_hand.gif',
        ':-c': 'call_me.gif',
        ':)]': 'on_the_phone.gif',
        '~X(': 'at_wits_end.gif',
        ':-h': 'wave.gif',
        ':-t': 'time_out.gif',
        ':8->': 'day_dreaming.gif',
        'I-)': 'sleepy.gif',
        '8-|': 'rolling_eyes.gif',
        'L-)': 'loser.gif',
        ':-&': 'sick.gif',
        ':-$': 'dont_tell.gif',
        '[-(': 'no_talking.gif',
        ':O)': 'clown.gif',
        '8-}': 'silly.gif',
        '<:-P': 'party.gif',
        '(:|': 'yawn.gif',
        '=P~': 'drooling.gif',
        ':-?': 'thinking.gif',
        '#-o': 'doh.gif',
        '=D>': 'applause.gif',
        ':-SS': 'nail_biting.gif',
        '@-)': 'hyptonized.gif',
        ':^o': 'liar.gif',
        ':-w': 'waiting.gif',
        ':-<': 'sigh.gif',
        '>:P': 'phbbbbt.gif',
        '<):)': 'cowboy.gif',
        'X_X': 'dont_wanna_see.gif',
        ':!!': 'hurry_up.gif',
        '\m/': 'rock_on.gif',
        ':-q': 'thumbs_down.gif',
        ':-bd': 'thumbs_up.gif',
        '^#(^': 'it_wasnt_me.gif',
        ':ar!': 'pirate.gif'
    };

    var emoticonRegex = buildRegex();
};

module.exports = emoticonsPlugin;
