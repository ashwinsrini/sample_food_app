const mongoose = require('mongoose');

const user = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'modified_at' },
    versionKey: false
  }
);

module.exports = mongoose.model('user', user);
