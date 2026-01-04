'use strict';

// Export all Mongoose models
module.exports = {
    User: require('./User'),
    Accounts: require('./Account'),
    Office: require('./Office'),
    Service: require('./Service'),
    QueueTicket: require('./QueueTicket'),
    Notification: require('./Notification'),
    Session: require('./Session')
};
