const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    sentById: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    sentBy: {
      type: String,
      required: false,
    },
    body: {
      type: String,
      required: true,
      minlength: 1,
    },
    dateCreated: {
      type: Date,
      required: true,
    },
    dateSent: {
      type: String,
      required: true,
    },
    timeSent: {
      type: String,
      required: true,
    },
  },
  { collection: "messages" }
);

module.exports = Message = mongoose.model("messages", MessageSchema);
