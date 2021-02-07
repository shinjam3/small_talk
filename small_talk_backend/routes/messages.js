const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const _ = require('lodash');

const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

const Message = require('../models/Message');

// fetches all messages for specific group
router.get('/:id', [auth, validateObjectId], async (req, res) => {
	let result = await Message.find({ groupId: mongoose.Types.ObjectId(req.params.id) }).sort({ dateCreated: 'desc' });
	res.send(result);
});

module.exports = router;