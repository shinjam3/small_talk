const request = require('supertest');
const mongoose = require('mongoose');
const { parse } = require('cookie');

const { User } = require('../models/User');
const Group = require('../models/Group');
const Message = require('../models/Message');

let server;

//const testIdOne = '5fc1821bcfa3332088feef6c';
const testObjectIdOne = new mongoose.Types.ObjectId('5fc1821bcfa3332088feef6c');
//const testIdTwo = '56cb91bdc3464f14678934ca';
const testObjectIdTwo = new mongoose.Types.ObjectId('56cb91bdc3464f14678934ca');
const testObjectIdThree = new mongoose.Types.ObjectId('5cabe64dcf0d4447fa60f5e2');

const testUserOne = new User({
  _id: testObjectIdOne,
  firstName: 'testOneFirst',
  lastName: 'testOneLast',
  email: 'testone@test.com',
  pass: 'Testing1!',
  friends: [
    {
      firstName: 'testTwoFirst',
      lastName: 'testTwoLast',
      _id: testObjectIdTwo,
    },
  ],
  notifications: [],
});

const testUserTwo = new User({
  _id: testObjectIdTwo,
  firstName: 'testTwoFirst',
  lastName: 'testTwoLast',
  email: 'testtwo@test.com',
  pass: 'Testing2!',
  friends: [
    {
      firstName: 'testOneFirst',
      lastName: 'testOneLast',
      _id: testObjectIdOne,
    },
  ],
  notifications: [],
});

const testUserThree = new User({
  _id: testObjectIdThree,
  firstName: 'testThreeFirst',
  lastName: 'testThreeLast',
  email: 'testthree@test.com',
  pass: 'Testing3!',
  friends: [],
  notifications: [],
});

const tokenOne = testUserOne.generateAuthToken();
const cookieOne = `token=${tokenOne}; Path=/; HttpOnly; Secure; SameSite=None`;

const tokenTwo = testUserTwo.generateAuthToken();
const cookieTwo = `token=${tokenTwo}; Path=/; HttpOnly; Secure; SameSite=None`;

const tokenThree = testUserThree.generateAuthToken();
const cookieThree = `token=${tokenThree}; Path=/; HttpOnly; Secure; SameSite=None`;

//['token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDhiZGY1MDM5NTk4ZGM2YjgyNTMzM2YiLCJpYXQiOjE2ODY4ODgyNzJ9.HIZyoCpsyT5lgsGZ28KHGJQo65rf2K1anux0FtjvM68; Path=/; HttpOnly; Secure; SameSite=None']

describe('/users', () => {
  beforeEach(async () => {
    server = require('../index');
    // populate database with test users
    await User.insertMany([testUserOne, testUserTwo, testUserThree]);
  });

  afterEach(async () => {
    await User.deleteMany({
      firstName: {
        $in: ['testOneFirst', 'testTwoFirst', 'testThreeFirst', 'Registered Test', 'newFirstName'],
      },
    });
    server.close();
  });

  // registration testing
  describe('POST /users/register', () => {
    it('should return 400 status if the user info does not satisfy Joi validation requirement(s)', async () => {
      const res = await request(server).post('/users/register').send({
        firstName: 'a',
        lastName: 'b',
        email: 'qwerty',
        pass: 'qwerty',
      });

      expect(res.status).toBe(400);
    });

    it('should return 400 status if the user submits an existing email', async () => {
      const res = await request(server).post('/users/register').send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'testone@test.com',
        pass: 'Loremipsum1!',
        friends: [],
        notifications: [],
      });

      expect(res.status).toBe(400);
      expect(res.text).toEqual('User already registered.');
    });

    it('should get the registered user from the database if registration is successful', async () => {
      const user = {
        firstName: 'Registered Test',
        lastName: 'User',
        email: 'registertest@test.com',
        pass: 'Loremipsum1!',
        friends: [],
        notifications: [],
      };

      const temp = {
        firstName: 'Registered Test',
        lastName: 'User',
        email: 'registertest@test.com',
      };

      await request(server).post('/users/register').send(user);
      const result = await User.findOne({
        email: 'registertest@test.com',
      }).select('-pass -notifications -friends');

      // expecting objectContaining(temp), not user because two empty arrays are not equal
      expect(result).toEqual(expect.objectContaining(temp));
    });
  });

  // login testing
  describe('POST /users/login', () => {
    it('should return a 400 status if the user sends a non-existing email', async () => {
      const res = await request(server)
        .post('/users/login')
        .send({
          email: 'registertest@test.com',
          pass: 'Loremipsum1!',
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(res.status).toBe(400);
      expect(res.text).toEqual('Invalid email or password.');
    });

    it('should return a 400 status if the user sends an existing email and an incorrect password', async () => {
      const res = await request(server).post('/users/login').send({
        email: 'testone@test.com',
        pass: 'incorrecttest',
      });

      expect(res.status).toBe(400);
      expect(res.text).toEqual('Invalid email or password.');
    });

    it('should return a 200 response status with a "set-cookie" response header', async () => {
      // registers a user with an encrypted password to the db
      await request(server).post('/users/register').send({
        firstName: 'Registered Test',
        lastName: 'User',
        email: 'registertest@test.com',
        pass: 'Loremipsum1!',
        friends: [],
        notifications: [],
      });

      const res = await request(server).post('/users/login').send({
        email: 'registertest@test.com',
        pass: 'Loremipsum1!',
      });
      const cookies = res.header['set-cookie'];
      const parsedCookie = cookies.length ? parse(cookies[0]) : undefined;

      expect(res.status).toBe(200);
      expect(res.header).toHaveProperty('set-cookie');
      expect(cookies.length).toBeGreaterThan(0);
      expect(parsedCookie?.token).not.toBe('');
    });
  });

  // user logged in testing
  describe('GET /users/loggedin', () => {
    it('should return false if user is not logged in', async () => {
      const res = await request(server).get('/users/loggedin');
      expect(res.body).toBeFalsy();
    });

    it('should return true if user is logged in', async () => {
      const res = await request(server).get('/users/loggedin').set('Cookie', cookieOne);
      expect(res.status).toBe(200);
      expect(res.body).toBeTruthy();
    });
  });

  describe('GET /users/logout', () => {
    it('should clear the cookie', async () => {
      const res = await request(server).get('/users/logout').set('Cookie', cookieOne);
      expect(res.status).toBe(200);

      const cookies = res.header['set-cookie'];
      const parsedCookie = cookies.length ? parse(cookies[0]) : undefined;

      expect(res.status).toBe(200);
      expect(res.header).toHaveProperty('set-cookie');
      expect(parsedCookie?.token).toBe('');
    });
  });

  // fetching updated user info for logged in user testing
  describe('GET /users/current-user', () => {
    it('should match the test user object with the result from the db', async () => {
      const testUser = {
        firstName: 'testOneFirst',
        lastName: 'testOneLast',
        email: 'testone@test.com',
      };

      const res = await request(server).get('/users/current-user').set('Cookie', cookieOne);

      expect(res.body).toEqual(expect.objectContaining(testUser));
    });
  });

  // auth and validateObjectId middleware testing & fetching all users testing
  describe('GET /users', () => {
    it('should return a 401 status response if the client sends a request without a cookie from server', async () => {
      const res = await request(server).get(`/users`);
      expect(res.status).toBe(401);
      expect(res.text).toEqual('Unauthorized.');
    });

    it('should return a 400 status response if the client sends a request with an invalid authentication JWT', async () => {
      const res = await request(server).get(`/users`).set('Cookie', 'invalid cookie');
      expect(res.status).toBe(401);
      expect(res.text).toEqual('Unauthorized.');
    });

    it('should return a 404 status response if the client sends a request with an invalid objectId in the route path', async () => {
      const invalidCookie = 'token=invalidId; Path=/; HttpOnly; Secure; SameSite=None';
      const res = await request(server).get('/users').set('Cookie', invalidCookie);
      expect(res.status).toBe(401);
      expect(res.text).toEqual('Unauthorized.');
    });

    it('should return all the registered users', async () => {
      const res = await request(server).get(`/users`).set('Cookie', cookieOne);
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            firstName: 'testThreeFirst',
            lastName: 'testThreeLast',
          }),
        ])
      );
    });
  });

  // friend request notification testing
  describe('POST /users/send-friend-request', () => {
    it("should return a 200 status response and the test user's notification array should have a new object", async () => {
      const res = await request(server)
        .post(`/users/send-friend-request`)
        .set('Cookie', cookieOne)
        .send({ otherUserId: testObjectIdThree.toString() });
      const userTo = await User.findOne({ _id: testObjectIdThree });
      expect(res.status).toBe(200);
      expect(userTo.notifications[0].from.firstName).toEqual('testOneFirst');
    });
  });

  // friend request acceptance testing
  describe('POST /users/request-accepted', () => {
    it("should return a 200 status response, both test users should be in each other's friends array, and the request recipient's notification array should be empty", async () => {
      // 1st test user sends friend request to 3rd test user
      await request(server)
        .post(`/users/send-friend-request`)
        .set('Cookie', cookieOne)
        .send({ otherUserId: testObjectIdThree });

      let userTo = await User.findOne({ _id: testObjectIdThree });
      let userFrom = await User.findOne({ _id: testObjectIdOne });
      const notification = userTo.notifications[0];

      // 3rd test user accepts friend request form 1st test user
      const res = await request(server).post('/users/request-accepted').set('Cookie', cookieThree).send({
        userFromId: notification?.from?._id,
        notificationId: notification._id,
      });
      userTo = await User.findOne({ _id: testObjectIdThree });
      userFrom = await User.findOne({ _id: testObjectIdOne });

      expect(res.status).toBe(200);
      expect(userTo.notifications.length).toEqual(0);
      expect(userTo.friends).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            firstName: 'testOneFirst',
            lastName: 'testOneLast',
          }),
        ])
      );
      expect(userFrom.friends).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            firstName: 'testThreeFirst',
            lastName: 'testThreeLast',
          }),
        ])
      );
    });
  });

  // removing notification after declining friend request testing
  describe('POST /users/request-declined/:notificationId', () => {
    it("should return a 200 status response and the request recipient's notification array should be empty", async () => {
      // test user 1 sends friend request to test user 3
      await request(server).post('/users/send-friend-request').set('Cookie', cookieOne).send({
        otherUserId: testObjectIdThree,
      });
      let userTo = await User.findOne({ _id: testObjectIdThree });
      const notificationId = userTo.notifications[0]._id;

      const res = await request(server).post(`/users/request-declined/${notificationId}`).set('Cookie', cookieThree);
      userTo = await User.findOne({ _id: testObjectIdThree });

      expect(res.status).toBe(200);
      expect(userTo.notifications.length).toEqual(0);
    });
  });

  // removing a friend from specific user testing
  describe('POST /users/remove-friend', () => {
    it('should return an updated test user object with an empty friends array', async () => {
      // test user 1 removes test user 2 from friends list
      const res = await request(server)
        .post('/users/remove-friend/')
        .set('Cookie', cookieOne)
        .send({ friendId: testObjectIdTwo });
      expect(res.body.friends.length).toBe(0);
    });
  });

  // updating user info testing
  describe('POST /users/update-profile', () => {
    it("should update test user's information, update any friend arrays that have the test user as an element, update groups with test user as a member, and update messages sent by test user", async () => {
      const newInfo = {
        firstName: 'newFirstName',
        lastName: 'newLastName',
        email: 'newemail@test.com',
        pass: 'Newpass1!',
      };

      let testGroup = new Group({
        _id: new mongoose.Types.ObjectId('5ff67a3f08d41be847028fdd'),
        members: [
          {
            firstName: 'testOneFirst',
            lastName: 'testOneLast',
            _id: testObjectIdOne,
          },
        ],
        dateCreated: new Date(),
        dateString: new Date().toLocaleDateString(),
        timeString: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
      await testGroup.save();

      let testMessage = new Message({
        groupId: new mongoose.Types.ObjectId('5ff67a3f08d41be847028fdd'),
        sentById: testObjectIdOne,
        sentBy: 'testOneFirst',
        body: 'test',
        dateCreated: new Date(),
        dateSent: new Date().toLocaleDateString(),
        timeSent: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
      await testMessage.save();

      await request(server).post('/users/update-profile/').set('Cookie', cookieOne).send(newInfo);
      delete newInfo.pass;

      const testUser = await User.findOne({ _id: testObjectIdOne });
      //await User.deleteOne({ _id: testObjectIdOne });

      testGroup = await Group.findOne({
        _id: new mongoose.Types.ObjectId('5ff67a3f08d41be847028fdd'),
      });
      await Group.deleteOne({
        _id: new mongoose.Types.ObjectId('5ff67a3f08d41be847028fdd'),
      });

      testMessage = await Message.findOne({
        groupId: new mongoose.Types.ObjectId('5ff67a3f08d41be847028fdd'),
      });
      await Message.deleteOne({
        groupId: new mongoose.Types.ObjectId('5ff67a3f08d41be847028fdd'),
      });

      let testFriendUser = await User.findOne({ _id: testObjectIdTwo });

      expect(testUser).toEqual(expect.objectContaining(newInfo));
      expect(testGroup.members[0].firstName).toEqual('newFirstName');
      expect(testMessage.sentBy).toEqual('newFirstName');
      expect(testFriendUser.friends[0].firstName).toEqual('newFirstName');
    });
  });

  // deleting user's account from db testing
  describe('POST /users/delete-account/:id', () => {
    it('should return a 400 status response if the password from the client to confirm the account deletion is incorrect', async () => {
      // registers a user with an encrypted password to the db
      await request(server).post('/users/register').send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'registertest@test.com',
        pass: 'Loremipsum1!',
        friends: [],
        notifications: [],
      });

      const testUser = await User.findOne({
        email: 'registertest@test.com',
      });
      const testToken = testUser.generateAuthToken();
      const testCookie = `token=${testToken}; Path=/; HttpOnly; Secure; SameSite=None`;

      const res = await request(server)
        .post('/users/delete-account')
        .set('Cookie', testCookie)
        .send({ pass: 'incorrectPass' });
      expect(res.status).toBe(400);
      expect(res.text).toBe('Invalid.');
    });

    it('should return an empty array when querying for the deleted test user', async () => {
      // registers a user with an encrypted password to the db
      await request(server).post('/users/register').send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'registertest@test.com',
        pass: 'Loremipsum1!',
        friends: [],
        notifications: [],
      });

      let testUser = await User.findOne({
        email: 'registertest@test.com',
      });
      const testToken = testUser.generateAuthToken();
      const testCookie = `token=${testToken}; Path=/; HttpOnly; Secure; SameSite=None`;

      await request(server).post('/users/delete-account').set('Cookie', testCookie).send({ pass: 'Loremipsum1!' });
      testUser = await User.find({
        email: 'registertest@test.com',
      });
      expect(testUser.length).toBe(0);
    });
  });
});
