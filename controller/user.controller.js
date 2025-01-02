const express = require('express');
const userModel = require('../models/user.schema');
const jwt = require('jsonwebtoken');

const userRouter = express.Router();
require('dotenv').config();
const checkPasswordorEmail = require('../middlewares/emailPasswordverification.middleware');
const { hashPassword, comparePassword } = require('../helpers/hashPassword');

userRouter.post('/signup', checkPasswordorEmail, async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const signupUser = await userModel.findOne({ email });

    if (signupUser) {
      return res.send({
        masg: 'user is alredy registerd',
      });
    } else {
      const bcryptPassword = await hashPassword(password);
      const newUser = await userModel.create({
        name,
        email,
        password: bcryptPassword,
      });

      return res.status(200).send({
        msg: 'User successfull registerd',
        newUser,
      });
    }
  } catch (e) {
    res.status(500).send({
      msg: 'user is not created something went wrong',
    });
  }
});

// --------- login api------------------

userRouter.post('/login', checkPasswordorEmail, async (req, res) => {
  const { email, password } = req.body;

  try {
    const find_user = await userModel.findOne({ email });

    if (!find_user) {
      return res.status(401).send('Invalid User or User is not registerd ');
    }
    const comparedPassword = await comparePassword(password, find_user.password);

    if (!comparedPassword) {
      return res.status(401).send('Invalid email or password');
    }

    const name = find_user.email.split('@')[0];
    const token = jwt.sign({ id: find_user._id }, process.env.SECRET_KEY, {
      expiresIn: '7 days',
    });

    return res.status(200).send({
      msg: 'Login successfull',
      token,
      name,
    });
  } catch (e) {
    res.status(500).send({
      masg: 'something went wrong',
      e,
    });
  }
});



module.exports = userRouter;