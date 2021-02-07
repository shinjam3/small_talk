const request = require('supertest');
const mongoose = require('mongoose');

const {User} = require('../models/User');
const Group = require('../models/Group');
const Message = require('../models/Message');

let server;
const token = new User().generateAuthToken();

const testIdOne = '5fc1821bcfa3332088feef6c';
const testObjectIdOne = mongoose.Types.ObjectId(testIdOne);

const testIdTwo = '56cb91bdc3464f14678934ca';
const testObjectIdTwo = mongoose.Types.ObjectId(testIdTwo);

const testUserOne = new User({
	_id: testObjectIdOne,
	firstName: 'testOneFirst',
	lastName: 'testOneLast',
	email: 'testone@test.com',
	pass: 'Testing1!',
	friends: [{
		firstName: 'testTwoFirst',
		lastName: 'testTwoLast',
		_id: testObjectIdTwo
	}],
	notifications: []
});
		
const testUserTwo = new User({
	_id: testObjectIdTwo,
	firstName: "testTwoFirst",
	lastName: "testTwoLast",
	email: "testtwo@test.com",
	pass: "Testing2!",
	friends: [{
		firstName: 'testOneFirst',
		lastName: 'testOneLast',
		_id: testObjectIdOne
	}],
	notifications: []
});

describe('/user', () => {
	beforeEach(async () => {
		server = require('../index');		
		// populate database with test users
		User.collection.insertMany([testUserOne, testUserTwo]);
	});
	
	
	afterEach(async () => {
		await User.deleteMany({ email: {$in: ['testone@test.com', 'testtwo@test.com', 'registertest@test.com']} });
		server.close();
	});
	


	// registration testing
	describe('POST /users/register', () => {
		// test 1
		it('should return 400 status if the user info does not satisfy Joi validation requirement(s)', async () => {
			const res = await request(server).post('/users/register').send(
				{
					firstName: 'a',
					lastName: 'b',
					email: 'qwerty',
					pass: 'qwerty'
				}
			);
			
			expect(res.status).toBe(400);
		});
		
		// test 2
		it('should return 400 status if the user submits an existing email', async () => {			
			const res = await request(server).post('/users/register').send(
				{
					firstName: 'John',
					lastName: 'Doe',
					email: 'testone@test.com',
					pass: 'Loremipsum1!',
					friends: [],
					notifications: []
				}
			);
						
			expect(res.status).toBe(400);
			expect(res.text).toEqual('User already registered.');
		});
		
		// test 3
		it('should get the registered user from the database if registration is successful', async () => {
			let user = {
				firstName: 'John',
				lastName: 'Doe',
				email: 'registertest@test.com',
				pass: 'Loremipsum1!',
				friends: [],
				notifications: []
			};
			
			let temp = {
				firstName: 'John',
				lastName: 'Doe',
				email: 'registertest@test.com'
			};
			
			await request(server).post('/users/register').send(user);
			const result = await User.findOne({ email: 'registertest@test.com' }).select('-pass -notifications -friends');			
			
			// expecting objectContaining(temp), not user because two empty arrays are not equal
			expect(result).toEqual(
				expect.objectContaining(temp)
			);
		});
	});
	
	
	
	// login testing
	describe('PUT /users/login', () => {
		// test 4
		it('should return a 400 status if the user sends a non-existing email', async () => {
			const res = await request(server).put('/users/login').send({
				email: 'registertest@test.com',
				pass: 'Loremipsum1!'
			});
			
			expect(res.status).toBe(400);
			expect(res.text).toEqual('Invalid email or password.');
		});
		
		// test 5
		it('should return a 400 status if the user sends an existing email and an incorrect password', async () => {
			const res = await request(server).put('/users/login').send({
				email: 'testone@test.com',
				pass: 'incorrecttest'
			});
			
			expect(res.status).toBe(400);
			expect(res.text).toEqual('Invalid email or password.');
		});
		
		// test 6
		it('should return a 200 response status with an x-auth-token response header', async () => {
			// registers a user with an encrypted password to the db
			await request(server).post('/users/register').send({
				firstName: 'John',
				lastName: 'Doe',
				email: 'registertest@test.com',
				pass: 'Loremipsum1!',
				friends: [],
				notifications: []
			});
			
			const res = await request(server).put('/users/login').send({
				email: 'registertest@test.com',
				pass: 'Loremipsum1!'
			});
			
			expect(res.status).toBe(200);
			expect(res.text).toEqual('Log in successful');
			expect(res.header).toHaveProperty('x-auth-token');
		});
	});
	
	
	
	// auth and validateObjectId middleware testing & fetching all users testing
	describe('GET /users/:id', () =>{
		// test 7
		it('should return a 401 status response if the client sends a request without the x-auth-token header', async () => {
			const res = await request(server).get(`/users/${testIdOne}`);
			expect(res.status).toBe(401);
			expect(res.text).toEqual('Access denied. No token provided.');
		});
		
		// test 8
		it('should return a 400 status response if the client sends a request with an invalid authentication JWT', async () => {
			const res = await request(server).get(`/users/${testIdOne}`).set('x-auth-token', 'invalidToken');
			expect(res.status).toBe(400);
			expect(res.text).toEqual('Invalid token.');
		});
		
		// test 9
		it('should return a 404 status response if the client sends a request with an invalid objectId in the route path', async () => {
			const res = await request(server).get('/users/123456789').set('x-auth-token', token);
			expect(res.status).toBe(404);
			expect(res.text).toEqual('Invalid ID.');
		});
		
		// test 10
		it('should return all the registered users', async () => {
			const res = await request(server).get(`/users/${testIdOne}`).set('x-auth-token', token);
			expect(res.status).toBe(200);
			expect(res.body.length).toBeGreaterThan(0);
		});
	});
	
	
	
	// friend request notification testing
	describe('PUT /users/send-friend-request/:to/:from', () => {
		// test 11
		it("should return a 200 status response and the test user's notification array should have a new object", async () => {
			const res = await request(server).put(`/users/send-friend-request/${testIdOne}/${testIdTwo}`).set('x-auth-token', token);
			let userTo = await User.findOne({ _id: testObjectIdOne });
			expect(res.status).toBe(200);
			expect(userTo.notifications[0].from.firstName).toEqual('testTwoFirst');
		});
	});
	
	
	
	// friend request acceptance testing
	describe('PUT /users/request-accepted/:from/:to/:id', () => {
		// test 12
		it("should return a 200 status response, both test users should be in each other's friends array, and the request recipient's notification array should be empty", async () => {
			// 2nd test user sends friend request to 1st test user
			await request(server).put(`/users/send-friend-request/${testIdOne}/${testIdTwo}`).set('x-auth-token', token);
			let userTo = await User.findOne({ _id: testObjectIdOne });
			let userFrom;
			let notification = userTo.notifications[0];
			
			const res = await request(server).put(`/users/request-accepted/${notification.from._id}/${testIdOne}/${notification._id}`).set('x-auth-token', token);
			userTo = await User.findOne({ _id: testObjectIdOne });
			userFrom = await User.findOne({ _id: testObjectIdTwo });
			
			expect(res.status).toBe(200);
			expect(userTo.friends[0].firstName).toEqual('testTwoFirst');
			expect(userFrom.friends[0].firstName).toEqual('testOneFirst');
			expect(userTo.notifications.length).toEqual(0);
		});
	});
	
	
	
	// removing notification after declining friend request testing
	describe('PUT /users/request-declined/:id/:notificationId', () => {
		// test 13
		it("should return a 200 status response and the request recipient's notification array should be empty", async () => {
			// test user 2 sends friend request to test user 1
			await request(server).put(`/users/send-friend-request/${testIdOne}/${testIdTwo}`).set('x-auth-token', token);
			let userTo = await User.findOne({ _id: testObjectIdOne });
			let notificationId = userTo.notifications[0]._id;
			
			const res = await request(server).put(`/users/request-declined/${testIdOne}/${notificationId}`).set('x-auth-token', token);
			userTo = await User.findOne({ _id: testObjectIdOne });
			
			expect(res.status).toBe(200);
			expect(userTo.notifications.length).toEqual(0);
		});
	});
	
	
	
	// fetching updated user info for logged in user testing
	describe('GET /users/current-user/:id', () => {
		// test 14
		it("should match the test user object with the result from the db", async () => {
			let testUser = {
				firstName: 'testOneFirst',
				lastName: 'testOneLast',
				email: 'testone@test.com'
			};
			
			const res = await request(server).get(`/users/current-user/${testIdOne}`).set('x-auth-token', token);
			
			expect(res.body).toEqual(
				expect.objectContaining(testUser)
			);
		});
	});
	
	
	
	// removing a friend from specific user testing
	describe('PUT /users/remove-friend/:friend/:id', () => {
		// test 15
		it('should return an updated test user object with an empty friends array', async () => {
			// inserts test user 2 as a friend into test user 1's friend array
			let testUser = await User.findOne({ _id: testObjectIdOne });
			testUser.friends.push({
				firstName: 'testTwoFirst',
				lastName: 'testTwoLast',
				_id: testObjectIdTwo
			});
			await testUser.save();
			
			const res = await request(server).put(`/users/remove-friend/${testIdTwo}/${testIdOne}`).set('x-auth-token', token);
			expect(res.body.friends.length).toBe(0);
		});
	});
	
	
	
	// updating user info testing
	describe('PUT /users/update-profile/:id', () => {
		// test 16
		it("should update test user's information, update any friend arrays that have the test user as an element, update groups with test user as a member, and update messages sent by test user", async () => {
			let newInfo = {
				firstName: 'newFirstName',
				lastName: 'newLastName',
				email: 'newemail@test.com',
				pass: 'Newpass1!'
			};
			
			let testGroup = new Group({
				_id: mongoose.Types.ObjectId('5ff67a3f08d41be847028fdd'),
				members: [{
					firstName: 'testOneFirst',
					lastName: 'testOneLast',
					_id: testObjectIdOne
				}],
				dateCreated: new Date(),
				dateString: new Date().toLocaleDateString(),
				timeString: new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})
			});
			await testGroup.save();
			
			let testMessage = new Message({
				groupId: mongoose.Types.ObjectId('5ff67a3f08d41be847028fdd'),
				sentById: testObjectIdOne,
				sentBy: 'testOneFirst',
				body: 'test',
				dateCreated: new Date(),
				dateSent: new Date().toLocaleDateString(),
				timeSent: new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})
			});
			await testMessage.save();
			
			const res = await request(server).put(`/users/update-profile/${testIdOne}`).set('x-auth-token', token).send(newInfo);
			
			delete newInfo.pass;
			let testUser = await User.findOne({ _id: testObjectIdOne });
			await User.deleteOne({ _id: testObjectIdOne });
			
			testGroup = await Group.findOne({ _id: mongoose.Types.ObjectId('5ff67a3f08d41be847028fdd') });
			await Group.deleteOne({ _id: mongoose.Types.ObjectId('5ff67a3f08d41be847028fdd') });
			
			testMessage = await Message.findOne({ groupId: mongoose.Types.ObjectId('5ff67a3f08d41be847028fdd') });
			await Message.deleteOne({ groupId: mongoose.Types.ObjectId('5ff67a3f08d41be847028fdd') });
			
			let testFriendUser = await User.findOne({ _id: testObjectIdTwo });
						
			expect(testUser).toEqual(
				expect.objectContaining(newInfo)
			);
			expect(testGroup.members[0].firstName).toEqual('newFirstName');
			expect(testMessage.sentBy).toEqual('newFirstName');
			expect(testFriendUser.friends[0].firstName).toEqual('newFirstName');
		});
	});
	
	
	
	// deleting user's account from db testing
	describe('PUT /users/delete-account/:id', () => {
		// test 17
		it('should return a 400 status response if the password from the client to confirm the account deletion is incorrect', async () => {
			// registers a user with an encrypted password to the db
			await request(server).post('/users/register').send({
				firstName: 'John',
				lastName: 'Doe',
				email: 'registertest@test.com',
				pass: 'Loremipsum1!',
				friends: [],
				notifications: []
			});
			let testId = await User.findOne({ email: 'registertest@test.com' }).select('_id');
			
			const res = await request(server).put(`/users/delete-account/${testId._id}`).set('x-auth-token', token).send({"pass": "incorrectPass"}); 
			expect(res.status).toBe(400);
			expect(res.text).toBe('Invalid.');
		});
		
		// test 18
		it('should return an empty array when querying for the deleted test user', async () => {
			// registers a user with an encrypted password to the db
			await request(server).post('/users/register').send({
				firstName: 'John',
				lastName: 'Doe',
				email: 'registertest@test.com',
				pass: 'Loremipsum1!',
				friends: [],
				notifications: []
			});
			let testId = await User.findOne({ email: 'registertest@test.com' }).select('_id');
			
			let res = await request(server).put(`/users/delete-account/${testId._id}`).set('x-auth-token', token).send({pass: 'Loremipsum1!'});
			let result = await User.find({ _id: mongoose.Types.ObjectId(testId._id) });
			expect(result.length).toBe(0);
		});
	});
});