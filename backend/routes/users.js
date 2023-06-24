const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const { User, validate } = require('../models/User');
const Message = require('../models/Message');
const Group = require('../models/Group');

const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

// insert new registered user information into database
router.post('/register', async (req, res) => {
  // verifies if submitted information meets requirements
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // verifies if a user with the submitted email already exists
  const result = await User.find({ email: req.body.email }).limit(1);
  if (result.length) {
    return res.status(400).send('User already registered.');
  } else {
    let user = new User(_.pick(req.body, ['firstName', 'lastName', 'email', 'pass', 'friends', 'notifications']));

    // generates a salt (random encrypted string)
    // then bcrypt will encrypt the password with the salt included
    // then reset the user's password as the encrypted password
    const salt = await bcrypt.genSalt(10);
    user.pass = await bcrypt.hash(user.pass, salt);
    await user.save();
  }

  res.send('Success');
});

// verifies login information submitted by the user
router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(req.body.pass, user.pass);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = user.generateAuthToken();
  res
    .cookie('token', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })
    .send();
});

// verify if user is logged in by checking if client sends cookie
router.get('/loggedin', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json(false);
    jwt.verify(token, process.env.ST_JWTPRIVATEKEY);
    res.json(true);
  } catch (err) {
    res.json(false);
  }
});

// clear the http cookie
router.get('/logout', [auth, validateObjectId], (req, res) => {
  res
    .cookie('token', '', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      expires: new Date(0),
    })
    .end();
});

// gets user info for logged in user
router.get('/current-user', [auth, validateObjectId], async (req, res) => {
  let user = await User.findOne(
    {
      _id: new mongoose.Types.ObjectId(req.userId),
    },
    { _id: 0, pass: 0 }
  );
  res.json(user);
});

// get all users for adding friends
router.get('/', [auth, validateObjectId], async (req, res) => {
  const user = await User.findOne({ _id: new mongoose.Types.ObjectId(req.userId) }, 'friends._id');
  const friendsIdList = user.friends.map((friend) => friend._id);
  friendsIdList.push(new mongoose.Types.ObjectId(req.userId)); // exclude user ID in the user list

  const result = await User.find(
    { _id: { $nin: friendsIdList } },
    '_id firstName lastName friends notifications'
  ).exec();
  res.send(result);
});

// sets new notification object for recipient user
router.post('/send-friend-request', [auth, validateObjectId], async (req, res) => {
  const { otherUserId } = req.body;
  const userTo = await User.findOne({
    _id: new mongoose.Types.ObjectId(otherUserId),
  });
  const userFrom = await User.findOne({ _id: new mongoose.Types.ObjectId(req.userId) }, '_id firstName lastName');
  const notificationObj = {
    from: userFrom,
    content: 'Friend Request',
    body: userFrom.firstName + ' ' + userFrom.lastName + ' sent you a friend request.',
    dateCreated: new Date().toLocaleDateString(),
    timeCreated: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  userTo.notifications.push(notificationObj);
  await userTo.save();

  res.send('Success');
});

// pushes two users into each other's friends array after a user accepts friend request, then removes notification
router.post('/request-accepted', [auth, validateObjectId], async (req, res) => {
  const user = await User.findOne({
    _id: new mongoose.Types.ObjectId(req.userId),
  });
  /*
		if the user that sent a request is already in the recipient's friends list, then remove the notification and end the request
		else, add each user as friends
	*/
  if (user.friends.some((friend) => friend._id.equals(new mongoose.Types.ObjectId(req.body.userFromId)))) {
    // finds the user with a specific _id, then uses $pull to remove the notification object by its _id in the notifications array
    await User.updateOne(
      { _id: new mongoose.Types.ObjectId(req.userId) },
      {
        $pull: {
          notifications: { _id: new mongoose.Types.ObjectId(req.body.notificationId) },
        },
      }
    );
    res.end();
  } else {
    const userFrom = await User.findOne({
      _id: new mongoose.Types.ObjectId(req.body.userFromId),
    });

    const tempUserTo = {
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    };
    userFrom.friends.push(tempUserTo);
    await userFrom.save();

    const tempUserFrom = {
      firstName: userFrom.firstName,
      lastName: userFrom.lastName,
      _id: userFrom._id,
    };
    user.friends.push(tempUserFrom);
    await user.save();

    await User.updateOne(
      { _id: new mongoose.Types.ObjectId(req.userId) },
      {
        $pull: {
          notifications: { _id: new mongoose.Types.ObjectId(req.body.notificationId) },
        },
      }
    );
    res.end();
  }
});

// removes notification after user declines friend request
router.post('/request-declined/:notificationId', [auth, validateObjectId], async (req, res) => {
  // finds the user with a specific _id, then uses $pull to remove an object by its _id in the notifications array
  await User.updateOne(
    { _id: new mongoose.Types.ObjectId(req.userId) },
    {
      $pull: {
        notifications: {
          _id: new mongoose.Types.ObjectId(req.params.notificationId),
        },
      },
    }
  );

  res.end();
});

// removes a friend from specific user
router.post('/remove-friend', [auth, validateObjectId], async (req, res) => {
  const friend = await User.findOne({
    _id: new mongoose.Types.ObjectId(req.body.friendId),
  });
  friend.friends.pull({ _id: new mongoose.Types.ObjectId(req.userId) });
  await friend.save();

  const user = await User.findOne({
    _id: new mongoose.Types.ObjectId(req.userId),
  });
  user.friends.pull({ _id: new mongoose.Types.ObjectId(req.body.friendId) });
  await user.save();

  const userCopy = JSON.parse(JSON.stringify(user));
  delete userCopy._id;
  delete userCopy.pass;
  res.json(userCopy);
});

/* 
	updates current user info with new info.
	other users that have current user as a friend will have updated information.
	messages and groups will also be updated with current user's new info
*/
router.post('/update-profile', [auth, validateObjectId], async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const newPass = await bcrypt.hash(req.body.pass, salt);

  let updatedUser = await User.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(req.userId) },
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      pass: newPass,
    },
    { new: true }
  );

  await Message.updateMany({ sentById: updatedUser._id }, { sentBy: req.body.firstName });

  await Group.updateMany(
    { 'members._id': updatedUser._id },
    {
      $set: {
        'members.$.firstName': updatedUser.firstName,
        'members.$.lastName': updatedUser.lastName,
      },
    }
  );

  await User.updateMany(
    { 'friends._id': updatedUser._id },
    {
      $set: {
        'friends.$.firstName': updatedUser.firstName,
        'friends.$.lastName': updatedUser.lastName,
      },
    }
  );

  res.end();
});

// deletes user's account in db and removes deleted user from groups and other users' friends/notifications lists
router.post('/delete-account', [auth, validateObjectId], async (req, res) => {
  const user = await User.findOne({
    _id: new mongoose.Types.ObjectId(req.userId),
  });
  const validPass = await bcrypt.compare(req.body.pass, user.pass);

  if (!validPass) return res.status(400).send('Invalid.');
  await User.deleteOne({ _id: new mongoose.Types.ObjectId(req.userId) });

  await User.updateMany({
    $pull: {
      friends: { _id: new mongoose.Types.ObjectId(req.userId) },
    },
  });

  await User.updateMany({
    $pull: {
      notifications: {
        'from._id': new mongoose.Types.ObjectId(req.userId),
      },
    },
  });

  await Group.updateMany({
    $pull: {
      members: { _id: new mongoose.Types.ObjectId(req.userId) },
    },
  });

  res.end();
});

module.exports = router;
