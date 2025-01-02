const express = require('express');
const commentRouter = express.Router();
const authenticateToken = require('../middlewares/auth.middleware');
const Comment = require('../models/comment.schema');

commentRouter.get('/blogs/comment', authenticateToken, async (req, res) => {
  try {
    const Allcomments = await Comment.find();

    return res.json({
      masg: 'geting All Your comment',
      Allcomments,
    });
  } catch (e) {
    return res.json({
      masg: 'Something went wrong',
      e,
    });
  }
});

module.exports = commentRouter;