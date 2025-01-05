const express = require('express');
const blogsRouter = express.Router();
const Comment = require('../models/comment.schema');
const blogModel = require('../models/blog.schema');
const authenticateToken = require('../middlewares/auth.middleware');

blogsRouter.get('/blogs', authenticateToken, async (req, res) => {
  try {
    const { filter, page = 1, limit = 10, orderBy = 'title', order = 'asc' } = req.query;

    const skip = (page - 1) * limit;

   
    const search = filter
      ? {
          $or: [{ title: { $regex: filter, $options: 'i' } }],
        }
      : {};
    
    const result = await blogModel
      .find(search)
      .populate({
        path: 'likes',
        select: 'name', 
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'user', 
          select: 'name', 
        },
      })
      .populate('author', 'name') 
      .skip(skip)
      .limit(parseInt(limit)) 
      .sort({ [orderBy]: order === 'asc' ? 1 : -1 });

    res.status(200).json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'An error occurred while fetching blogs.' });
  }
});

// single post

blogsRouter.get('/single-blogs/:id', authenticateToken, async (req, res) => {
  try {
    const blog = await blogModel.findOne({
      _id: req.params.id,
    });

    if (!blog) {
      return res.status(404).send('blogs not found');
    }

    await blogModel.findById(blog._id);

    res.status(200).json({ message: ' single blogs get successfully', blog});
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


blogsRouter.post('/add-blogs', authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    const blogs = new blogModel({
      title,
      content,
      author: req.user.id,
    });

    await blogs.save();

    res.json({
      id: blogs._id,
      title: blogs.title,
      content: blogs.content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// update blogs

blogsRouter.patch('/update-blogs/:id', authenticateToken,async (req, res) => {
  try {
    const blogs = await blogModel.findOne({
      _id: req.params.id,
      author: req.user.id,
    });

    if (!blogs) {
      return res.status(404).send('blogs not found');
    }

    await blogModel.findByIdAndUpdate(blogs._id || blogs.author, req.body, {
      new: true,
    });

    res.status(200).json({ message: 'blogs updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// delete blogs

blogsRouter.delete('/delete-blogs/delete/:id', authenticateToken, async (req, res) => {
  try {
    const blogs = await blogModel.findOne({
      _id: req.params.id,
      author: req.user.id,
    });

    if (!blogs) {
      return res.status(404).send('blogs not found');
    }

    await blogModel.findByIdAndDelete(blogs._id || blogs.author);

    res.status(200).json({ message: 'blogs deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// like pots

blogsRouter.get('/blogs/like/:id',authenticateToken, async (req, res) => {
  console.log(req.user);
  try {
    const post = await blogModel.findById(req.params.id);

    if (!post) {
      return res.status(404).send('Post not found');
    }

    if (post.likes.includes(req.user.id)) {
      return res.status(400).send('Post already liked');
    }

    post.likes.push(req.user.id);

    await post.save();

    res.status(200).json({ message: 'Post liked successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// comment on post


// comment on post

blogsRouter.post('/blogs/comment/:id',authenticateToken,async (req, res) => {
  try {
    const { comment } = req.body;

    const blogs = await blogModel.findById(req.params.id);

    if (!blogs) {
      return res.status(404).send('blogs not found');
    }

    const newComment = new Comment({
      comment,
      user: req.user.id,
    });

    await newComment.save();

    blogs.comments.push(newComment._id);
    await blogs.save();

    res.status(200).json({
      comment: newComment._id,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
}
);

module.exports = blogsRouter;