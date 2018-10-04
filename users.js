const mongoose = require('mongoose');
const User = require('./models/user');

exports.get = function (id, callback) {
  if (!id) {
    return callback(new Error('Invalid ID'));
  }

  User.findById(id, function (err, result) {
    if(err) {
      return callback(err);
    }
    return callback(null, result);
  });
}