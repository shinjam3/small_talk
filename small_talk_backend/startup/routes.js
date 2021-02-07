const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const users = require('../routes/users');
const groups = require('../routes/groups');
const messages = require('../routes/messages');

module.exports = function(app) {
	app.use(express.json());
	app.use(bodyParser.json());
	app.use(cors());
	
	app.use('/users', users);
	app.use('/groups', groups);
	app.use('/messages', messages);
}