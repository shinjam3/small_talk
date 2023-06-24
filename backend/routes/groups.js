const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const jwt_decode = require('jwt-decode');

const Group = require('../models/Group');
const { User } = require('../models/User');

const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

// fetches all groups for a specific user by their _id
router.get('/', [auth, validateObjectId], async (req, res) => {
  const result = await Group.find({
    'members._id': new mongoose.Types.ObjectId(req.userId),
  });
  res.send(result);
});

// create new group with specific user as a member
router.post('/create-group/', [auth, validateObjectId], async (req, res) => {
  const user = await User.findOne({ _id: new mongoose.Types.ObjectId(req.userId) });
  const newUser = {
    firstName: user.firstName,
    lastName: user.lastName,
    _id: req.userId,
  };

  const group = new Group({
    members: [newUser],
    dateCreated: new Date(),
    dateString: new Date().toLocaleDateString(),
    timeString: new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  });

  try {
    const savedGroup = await group.save();
    res.json(savedGroup);
  } catch (err) {
    res.status(400).send(err);
  }
});

// creates a new group with the user and their friend
router.post('/create-group-with-friend', [auth, validateObjectId], async (req, res) => {
  const user = await User.findOne({
    _id: new mongoose.Types.ObjectId(req.userId),
  });
  const currentUser = {
    firstName: user.firstName,
    lastName: user.lastName,
    _id: req.userId,
  };

  const friend = await User.findOne({
    _id: new mongoose.Types.ObjectId(req.body.friendId),
  });
  const friendUser = {
    firstName: friend.firstName,
    lastName: friend.lastName,
    _id: req.body.friendId,
  };

  const group = new Group({
    members: [currentUser, friendUser],
    dateCreated: new Date(),
    dateString: new Date().toLocaleDateString(),
    timeString: new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  });

  try {
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(400).send(err);
  }
});

// adds specific user to specific group
router.post('/add-member', [auth, validateObjectId], async (req, res) => {
  const user = await User.findOne({
    _id: new mongoose.Types.ObjectId(req.body.userId),
  });
  const group = await Group.findOne({
    _id: new mongoose.Types.ObjectId(req.body.groupId),
  });

  const tempUser = {
    _id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
  };

  group.members.push(tempUser);
  await group.save();

  res.end();
});

// removes specific user from specific group
router.post('/leave-group', [auth, validateObjectId], async (req, res) => {
  let group = await Group.findOne({
    _id: new mongoose.Types.ObjectId(req.body.groupId),
  });
  await group.members.pull({ _id: new mongoose.Types.ObjectId(req.userId) });
  if (group.members.length) await group.save();
  // delete the group if no members are left
  else
    await Group.deleteOne({
      _id: new mongoose.Types.ObjectId(req.body.groupId),
    });

  const groups = await Group.find({
    'members._id': new mongoose.Types.ObjectId(req.userId),
  });
  res.send(groups);
});

module.exports = router;
