const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users', // Matches the user model name
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Matches the user model name
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment', // Matches the comment model name
      },
    ],
  },
  { timestamps: true }
);

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;
