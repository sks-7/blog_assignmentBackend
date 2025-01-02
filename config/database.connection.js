const mongose = require('mongoose');
require('dotenv').config();

const connect = () => {
  return mongose.connect(process.env.mongo_url);
};

module.exports = connect;