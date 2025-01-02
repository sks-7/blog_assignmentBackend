const express = require('express');
const cors = require('cors');
const connect = require('./config/database.connection');
const userRouter = require('./controller/user.controller');
const blogsRouter = require('./controller/blog.controller');
const commentRouter = require('./controller/comment.controller');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 8080; 

app.get('/', (req, res) => {
  res.send('welcome to my blog');
});

// using middleware

app.use(express.json());
app.use(cors());

// user APi EndPoint

app.use('/api', userRouter);
app.use('/api', blogsRouter);
app.use('/api', commentRouter);

app.listen(port, async () => {
  await connect();
  console.log('database connected ');
  console.log('server is running ', port);
});