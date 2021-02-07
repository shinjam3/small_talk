const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const jwt_decode = require('jwt-decode');

const Group = require('../models/Group');
const {User} = require('../models/User');

const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');


// fetches all groups for a specific user by their _id
router.get('/:id', [auth, validateObjectId], async (req, res) => {	
	let result = await Group.find({ 'members._id': mongoose.Types.ObjectId(req.params.id) });
	res.send(result);
});


// create new group with specific user as a member
router.post('/create-group/:id', [auth, validateObjectId], async (req, res) => {
	let decoded = jwt_decode(req.header('x-auth-token'));
	
	let newUser = {
		firstName: decoded.firstName,
		lastName: decoded.lastName,
		_id: req.params.id
	}
	
	let group = new Group({
		members: [newUser],
		dateCreated: new Date(),
		dateString: new Date().toLocaleDateString(),
		timeString: new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})
	});
	
	await group.save(function(err, group) {
    if (err) return res.send(err);
    res.json(group);
  });
});


// creates a new group with the user and their friend
router.post('/create-group-with-friend/:id/:friend', [auth, validateObjectId], async (req, res) => {
	let decoded = jwt_decode(req.header('x-auth-token'));
	let newUser = {
		firstName: decoded.firstName,
		lastName: decoded.lastName,
		_id: req.params.id
	};
	
	let friend = await User.findOne({ _id: mongoose.Types.ObjectId(req.params.friend) });
	let friendUser = {
		firstName: friend.firstName,
		lastName: friend.lastName,
		_id: req.params.friend
	};
	
	let group = new Group({
		members: [newUser, friendUser],
		dateCreated: new Date(),
		dateString: new Date().toLocaleDateString(),
		timeString: new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})
	});
	
	await group.save(function(err, group) {
    if (err) return res.send(err);
    res.json(group);
  });
})


// adds specific user to specific group
router.put('/add-member/:group/:user', auth, async (req, res) => {
	let user = await User.findOne({ _id: mongoose.Types.ObjectId(req.params.user) });
	let group = await Group.findOne({ _id: mongoose.Types.ObjectId(req.params.group) });
	
	let tempUser = {
		_id: user._id,
		firstName: user.firstName,
		lastName: user.lastName
	}
	
	group.members.push(tempUser);
	await group.save();
	
	res.send('Success');
})


// removes specific user from specific group
router.put('/leave-group/:group/:id', [auth, validateObjectId], async (req, res) => {	
	let group = await Group.findOne({ _id: mongoose.Types.ObjectId(req.params.group) });
	await group.members.pull({ _id: mongoose.Types.ObjectId(req.params.id) })
	await group.save();
	
	let result = await Group.find({ 'members._id': mongoose.Types.ObjectId(req.params.id) });
	res.send(result);
});


module.exports = router; 