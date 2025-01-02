const jwt = require('jsonwebtoken');
require('dotenv').config();
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send('Access token not found');
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    console.log(user);
    if (err) {
      return res.status(403).send('Invalid access token');
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;