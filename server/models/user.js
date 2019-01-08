var mongoose = require('mongoose');

var User = mongoose.model('User',{
  email:{
    type: String,
    lowercase: true,
    required: [true, "can't be blank"],
    trim: true
  }
});

module.exports = {User};
