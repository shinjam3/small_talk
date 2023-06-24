const jwt = require('jsonwebtoken');
const _ = require('lodash');
const mongoose = require('mongoose');
const Message = require('./models/Message');
const { User } = require('./models/User');
const { parse } = require('cookie');

const server = require('./index');

const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// middleware to verify user authentication
io.use(async (socket, next) => {
  try {
    const cookie = parse(socket.handshake.headers.cookie);
    const payload = jwt.verify(cookie.token, process.env.ST_JWTPRIVATEKEY);
    socket.userId = payload._id;
    next();
  } catch (err) {
    console.log(err);
  }
});

io.on('connection', (socket) => {
  socket.on('logOut', () => {
    socket.disconnect();
  });

  socket.on('joinGroup', ({ groupId }) => {
    socket.join(groupId);
  });

  socket.on('exitGroup', ({ groupId }) => {
    socket.leave(groupId);
  });

  socket.on('sendMessage', async ({ message }) => {
    const user = await User.findOne({ _id: new mongoose.Types.ObjectId(socket.userId) });
    const newMessage = new Message(_.pick(message, ['groupId', 'body', 'sentBy', 'dateSent', 'timeSent']));
    newMessage.dateCreated = new Date();
    newMessage.sentById = socket.userId;
    newMessage.sentBy = newMessage.sentBy === 'smalltalk_system' ? '' : user.firstName;
    io.in(message.groupId).emit('newMessage', newMessage);
    await newMessage.save();
  });
});
