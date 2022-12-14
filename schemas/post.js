const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

module.exports = mongoose.model("Post", postSchema);