const request = require('supertest');
const mongoose = require('mongoose');

const { User } = require('../models/User');
const Group = require('../models/Group');

let server;

const userOneId = '5fc1821bcfa3332088feef6c';
const userOneObjectId = new mongoose.Types.ObjectId(userOneId);

const userTwoId = '56cb91bdc3464f14678934ca';
const userTwoObjectId = new mongoose.Types.ObjectId(userTwoId);

const groupOneId = '578e5cbd5b080fbfb7bed3d0';
const groupOneObjectId = new mongoose.Types.ObjectId(groupOneId);

const groupTwoId = '578df3efb618f5141202a196';
const groupTwoObjectId = new mongoose.Types.ObjectId(groupTwoId);

const testUserOne = new User({
  _id: userOneObjectId,
  firstName: 'firstNameOne',
  lastName: 'lastNameOne',
  email: 'testone@test.com',
  pass: 'Testing1!',
  friends: [
    {
      firstName: 'firstNameTwo',
      lastName: 'lastNameTwo',
      _id: userTwoObjectId,
    },
  ],
  notifications: [],
});

const tokenOne = testUserOne.generateAuthToken();
const cookieOne = `token=${tokenOne}; Path=/; HttpOnly; Secure; SameSite=None`;

const testUserTwo = new User({
  _id: userTwoObjectId,
  firstName: 'firstNameTwo',
  lastName: 'lastNameTwo',
  email: 'testtwo@test.com',
  pass: 'Testing2!',
  friends: [
    {
      firstName: 'firstNameOne',
      lastName: 'lastNameOne',
      _id: userOneObjectId,
    },
  ],
  notifications: [],
});

const groupMemberOne = {
  _id: userOneObjectId,
  firstName: 'firstNameOne',
  lastName: 'lastNameOne',
};

const testGroupOne = new Group({
  _id: groupOneObjectId,
  members: [groupMemberOne],
  dateCreated: new Date(),
  dateString: new Date().toLocaleDateString(),
  timeString: new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }),
});

const testGroupTwo = new Group({
  _id: groupTwoObjectId,
  members: [groupMemberOne],
  dateCreated: new Date(),
  dateString: new Date().toLocaleDateString(),
  timeString: new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }),
});

describe('/groups', () => {
  beforeEach(async () => {
    server = require('../index');

    // populate database with 2 test groups
    await Group.collection.insertMany([testGroupOne, testGroupTwo]);

    // populate database with 2 test users
    await User.collection.insertMany([testUserOne, testUserTwo]);
  });

  afterEach(async () => {
    await Group.deleteMany({
      _id: { $in: [groupOneObjectId, groupTwoObjectId] },
    });
    await Group.deleteMany({
      'members._id': { $in: [userOneObjectId, userTwoObjectId] },
    });
    await User.deleteMany({
      email: { $in: ['testone@test.com', 'testtwo@test.com'] },
    });
    server.close();
  });

  // fetching all groups for specific user testing
  describe('GET /groups', () => {
    it('should return an array of two groups with the test user as a member in each', async () => {
      const res = await request(server).get('/groups').set('Cookie', cookieOne);
      expect(res.body.length).toBe(2);
      expect(res.body[0].members[0].firstName).toEqual('firstNameOne');
      expect(res.body[1].members[0].firstName).toEqual('firstNameOne');
    });
  });

  // creating a new group with a specific user as a member testing
  describe('POST /groups/create-group', () => {
    it('should return a group that contains the test user as a member', async () => {
      const res = await request(server).post('/groups/create-group').set('Cookie', cookieOne);
      expect(res.body.members[0].firstName).toEqual('firstNameOne');
    });
  });

  // creating a new group with test user and friend testing
  describe('POST /groups/create-group-with-friend', () => {
    it('should return a group that contains the test user and friend as members', async () => {
      const res = await request(server)
        .post('/groups/create-group-with-friend')
        .set('Cookie', cookieOne)
        .send({ friendId: userTwoId });
      expect(res.body.members.length).toBe(2);
      expect(
        (res.body.members[0].firstName === 'firstNameOne' && res.body.members[1].firstName === 'firstNameTwo') ||
          (res.body.members[1].firstName === 'firstNameOne' && res.body.members[0].firstName === 'firstNameTwo')
      ).toBe(true);
    });
  });

  // adding specific user to specific group testing
  describe('POST /groups/add-member', () => {
    it('should return a 200 status and the test group with the test member should be added to the db', async () => {
      const res = await request(server)
        .post('/groups/add-member')
        .set('Cookie', cookieOne)
        .send({ userId: userTwoId, groupId: groupOneId });
      const group = await Group.findOne({ _id: groupOneObjectId });
      expect(res.status).toBe(200);
      expect(group.members[0].firstName === 'firstNameTwo' || group.members[1].firstName === 'firstNameTwo').toBe(true);
    });
  });

  // removing specific user from specific group testing
  describe('PUT /groups/leave-group', () => {
    it('should return an array of groups that have the test user as a member, except for the group that the test user left', async () => {
      const res = await request(server)
        .post('/groups/leave-group')
        .set('Cookie', cookieOne)
        .send({ groupId: groupOneId });
      expect(res.body.length).toBe(1); // expect 1 group because test user left 1 of 2 groups
    });
  });
});
