const config = require("config");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const server = require("./index");
const io = require("socket.io")(server, {
  cors: { origin: "*" },
});

// middleware to verify user authentication
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token;
    const payload = jwt.verify(token, config.get("jwtPrivateKey"));
    socket.userId = payload.id;
    next();
  } catch (err) {}
});

io.on("connection", (socket) => {
  socket.on("logOut", () => {
    socket.disconnect();
  });

  socket.on("joinGroup", ({ groupId }) => {
    socket.join(groupId);
  });

  socket.on("exitGroup", ({ groupId }) => {
    socket.leave(groupId);
  });

  socket.on("sendMessage", ({ message }) => {
    const newMessage = new Message(
      _.pick(message, ["groupId", "sentById", "sentBy", "body", "dateSent", "timeSent"])
    );
    newMessage.dateCreated = new Date();
    io.in(message.groupId).emit("newMessage", newMessage);
    newMessage.save();
  });
});
