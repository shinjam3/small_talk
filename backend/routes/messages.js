const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const _ = require('lodash');

const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

const Message = require('../models/Message');

// fetches all messages for specific group
router.post('/', [auth, validateObjectId], async (req, res) => {
  let result;
  if (req.body.preview) {
    result = await Message.findOne({
      groupId: new mongoose.Types.ObjectId(req.body.groupId),
    }).sort({ dateCreated: 'desc' });
  } else {
    result = await Message.find({
      groupId: new mongoose.Types.ObjectId(req.body.groupId),
    }).sort({ dateCreated: 'desc' });
  }
  res.send(result === null ? false : result);
});

module.exports = router;
