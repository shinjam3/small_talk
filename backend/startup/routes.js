const users = require('../routes/users');
const groups = require('../routes/groups');
const messages = require('../routes/messages');

module.exports = function (app) {
  app.use('/users', users);
  app.use('/groups', groups);
  app.use('/messages', messages);
};
