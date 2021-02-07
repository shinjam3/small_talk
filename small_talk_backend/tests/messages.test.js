const request = require('supertest');
const mongoose = require('mongoose');

const {User} = require('../models/User');
const Group = require('../models/Group');
const Message = require('../models/Message');

let server;
const token = new User().generateAuthToken();

const userId = '5fc1821bcfa3332088feef6c';
const userObjectId = mongoose.Types.ObjectId(userId);

const groupId = '578e5cbd5b080fbfb7bed3d0';
const groupObjectId = mongoose.Types.ObjectId(groupId);

const msgIdOne = '56cb91bdc3464f14678934ca';
const msgObjectIdOne = mongoose.Types.ObjectId(msgIdOne);

const msgIdTwo = '578df3efb618f5141202a196';
const msgObjectIdTwo = mongoose.Types.ObjectId(msgIdTwo);

const testGroup = new Group({
	_id: groupObjectId,
	members: [{
		_id: userObjectId,
		firstName: 'firstName',
		lastName: 'lastName'
	}],
	dateCreated: new Date(),
	dateString: new Date().toLocaleDateString(),
	timeString: new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})
});

const msgOne = new Message({
	groupId: groupObjectId,
	sentById: userObjectId,
	sentBy: 'firstName',
	body: 'test body one',
	dateCreated: new Date(),
	dateSent: new Date().toLocaleDateString(),
	timeSent: new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})
});

const msgTwo = new Message({
	groupId: groupObjectId,
	sentById: userObjectId,
	sentBy: 'firstName',
	body: 'test body two',
	dateCreated: new Date(),
	dateSent: new Date().toLocaleDateString(),
	timeSent: new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})
});


describe('/user', () => {
	beforeEach(async () => {
		server = require('../index');		
		
		// populate database with a test group
		await Group.collection.insertOne(testGroup);
		
		// populate database with 2 test messages for the test group
		await Message.collection.insertMany([msgOne, msgTwo]);
	});
	
	afterEach(async () => {
		await Group.deleteOne({ _id: groupObjectId });
		await Message.deleteMany({ sentById: userObjectId }); 
		server.close();
	});
	

	// fetching all messages for specific group testing
	describe('GET /messages/:id', () => {
		it('should return an array of all messages for the test group', async () => {
			const res = await request(server).get(`/messages/${groupId}`).set('x-auth-token', token);
			expect(res.body.length).toBe(2);
			expect(res.body[0].sentBy==='firstName' && res.body[1].sentBy==='firstName').toBe(true);
		});
	});
});