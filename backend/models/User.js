const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Joi = require("joi");
const jwt = require("jsonwebtoken");

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 200,
      unique: true,
    },
    pass: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 200,
    },
    friends: [
      {
        firstName: String,
        lastName: String,
        _id: Schema.Types.ObjectId,
      },
    ],
    notifications: [
      {
        from: {
          _id: Schema.Types.ObjectId,
          firstName: String,
          lastName: String,
        },
        content: String,
        body: String,
        dateCreated: String,
        timeCreated: String,
      },
    ],
  },
  { collection: "users" }
);

// generate an authentication token with JSON web token
UserSchema.methods.generateAuthToken = function () {
  //firstName: this.firstName,
      //lastName: this.lastName,
      //email: this.email,
      //friends: this.friends,
      //notifications: this.notifications,
  const token = jwt.sign(
    {
      _id: this._id,
    },
    process.env.ST_JWTPRIVATEKEY
  );
  return token;
};

// requirement validation
function validateUser(user) {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(5).max(200).required().email(),
    pass: Joi.string().min(8).max(200).required(),
    friends: Joi.array().required(),
    notifications: Joi.array().required(),
  });

  return schema.validate(user);
}

module.exports.User = User = mongoose.model("users", UserSchema);
module.exports.validate = validateUser;
