module.exports.create = function create(alias, content, timestamp, type) {
    return {
        alias: alias,
        content: content,
        timestamp: timestamp,
        type: type
    };
};

module.exports.types = {
    user: 'user',
    join: 'join',
    leave: 'leave',
    alias: 'alias',
    server: 'server'
};
