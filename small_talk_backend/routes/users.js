const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const {User, validate} = require('../models/User');
const Message = require('../models/Message');
const Group = require('../models/Group');

const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const config = require('config');


// insert new registered user information into database
router.post('/register', async (req, res) => {
	// verifies if submitted information meets requirements
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	
	// verifies if a user with the submitted email already exists
	const result = await User.find({ email: req.body.email }).limit(1);
	if (result.length) {
		return res.status(400).send('User already registered.');
	}
	else {
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
router.put('/login', async (req, res) => {
	const result = await User.find({ email: req.body.email }).limit(1);

	if (!result.length) return res.status(400).send('Invalid email or password.');
	
	let user = result[0];
	const validPassword = await bcrypt.compare(req.body.pass, user.pass);
	if (!validPassword) return res.status(400).send('Invalid email or password.');

	const token = user.generateAuthToken();
	
	res.header('x-auth-token', token)
	.header('access-control-expose-headers', 'x-auth-token')
	.send('Log in successful');
});


// get all users for adding friends
router.get('/:id', [auth, validateObjectId], async (req, res) => {
	let result = await User.find({ _id: {$ne: mongoose.Types.ObjectId(req.params.id)} }, '_id firstName lastName friends notifications').exec();
	res.send(result);
});


// sets new notification object for recipient user
router.put('/send-friend-request/:to/:from', auth, async (req, res) => {
	let userTo = await User.findOne({ _id: mongoose.Types.ObjectId(req.params.to) });
	let userFrom = await User.findOne({ _id: mongoose.Types.ObjectId(req.params.from) }, '_id firstName lastName');	
	let notificationObj = {
		from: userFrom,
		content: 'Friend Request',
		body: userFrom.firstName + ' ' + userFrom.lastName + ' sent you a friend request.',
		dateCreated: new Date().toLocaleDateString(),
		timeCreated: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
	}
	
	userTo.notifications.push(notificationObj);
	await userTo.save();
	
	res.send('Success');
});


// pushes two users into each other's friends array after a user accepts friend request, then removes notification
router.put('/request-accepted/:from/:to/:id', auth, async (req, res) => {
	let userTo, userFrom, tempUser;
	
	userTo = await User.findOne({ _id: mongoose.Types.ObjectId(req.params.to) });
	/*
		if the user that sent a request is already in the recipient's friends list, then remove the notification and end the request
		else, add each user as friends
	*/
	if (userTo.friends.some(friend => friend._id.equals(mongoose.Types.ObjectId(req.params.from)))) {
		// finds the user with a specific _id, then uses $pull to remove the notification object by its _id in the notifications array
		await User.updateOne(
			{_id: mongoose.Types.ObjectId(req.params.to)}, 
			{$pull: {
				notifications: {_id: mongoose.Types.ObjectId(req.params.id)}
			}}
		);
		res.end();
	}
	else {
		userFrom = await User.findOne({ _id: mongoose.Types.ObjectId(req.params.from) });		
	
		tempUser = {
			firstName: userTo.firstName,
			lastName: userTo.lastName,
			_id: userTo._id
		}
		userFrom.friends.push(tempUser);
		await userFrom.save();
		
		tempUser = {
			firstName: userFrom.firstName,
			lastName: userFrom.lastName,
			_id: userFrom._id
		}
		userTo.friends.push(tempUser);
		await userTo.save();	
		
		await User.updateOne(
			{_id: mongoose.Types.ObjectId(req.params.to)}, 
			{$pull: {
				notifications: {_id: mongoose.Types.ObjectId(req.params.id)}
			}}
		);
		res.end();
	}
});


// removes notification after user declines friend request
router.put('/request-declined/:id/:notificationId', [auth, validateObjectId], async (req, res) => {
	// finds the user with a specific _id, then uses $pull to remove an object by its _id in the notifications array
	await User.updateOne(
		{_id: mongoose.Types.ObjectId(req.params.id)}, 
		{$pull: {
			notifications: {_id: mongoose.Types.ObjectId(req.params.notificationId)}
		}}
	);
	
	res.end();
})


// gets updated user info for logged in user
router.get('/current-user/:id', [auth, validateObjectId], async (req, res) => {
	let user = await User.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
	res.json(user);
});


// removes a friend from specific user
router.put('/remove-friend/:friend/:id', [auth, validateObjectId], async (req, res) => {
	let friend = await User.findOne({ _id: mongoose.Types.ObjectId(req.params.friend) });
	friend.friends.pull({ _id: mongoose.Types.ObjectId(req.params.id) });
	await friend.save();
	
	let user = await User.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
	user.friends.pull({ _id: mongoose.Types.ObjectId(req.params.friend) });
	await user.save();
	
	res.json(user);
});


/* 
	updates current user info with new info.
	other users that have current user as a friend will have updated information.
	messages and groups will also be updated with current user's new info
*/
router.put('/update-profile/:id', [auth, validateObjectId], async (req, res) => {
	const salt = await bcrypt.genSalt(10);
	const newPass = await bcrypt.hash(req.body.pass, salt);
	
	let updatedUser = await User.findOneAndUpdate(
		{ _id: mongoose.Types.ObjectId(req.params.id) }, 
		{
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			pass: newPass
		},
		{ new: true }
	);
	
	await Message.updateMany({ sentById: updatedUser._id }, { sentBy: req.body.firstName });

	await Group.updateMany(
		{ 'members._id': updatedUser._id }, 
		{ '$set': {
			'members.$.firstName': updatedUser.firstName,
			'members.$.lastName': updatedUser.lastName
		}}
	);
	
	await User.updateMany(
		{ 'friends._id': updatedUser._id },
		{ '$set': {
			'friends.$.firstName': updatedUser.firstName,
			'friends.$.lastName': updatedUser.lastName
		}}
	);

	res.end();
});


// deletes user's account in db and removes deleted user from groups and other users' friends/notifications lists
router.put('/delete-account/:id', [auth, validateObjectId], async (req, res) => {
	let user = await User.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
	let validPass = await bcrypt.compare(req.body.pass, user.pass);
	
	if (!validPass) return res.status(400).send('Invalid.');
	await User.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) });
	
	await User.updateMany(
		{$pull: {
			friends: {_id: mongoose.Types.ObjectId(req.params.id)}
		}}
	);
	
	await User.updateMany(
		{$pull: {
			notifications: {'from._id': mongoose.Types.ObjectId(req.params.id)}
		}}
	);
	
	await Group.updateMany(
		{$pull: {
			members: {_id: mongoose.Types.ObjectId(req.params.id)} 
		}}
	);
	
	res.end();
})


module.exports = router; 