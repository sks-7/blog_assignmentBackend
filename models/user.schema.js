const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      default: 'https://img.freepik.com/free-icon/user_318-159711.jpg',
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
