const mongoose = require('mongoose');
const validator = require('validator');

var Mail = mongoose.model('Mail',{
  to:{
    type: String,
    lowercase: true,
    required: [true, "can't be blank"],
    trim: true,
    minlength: 1,
    unique: true,
    validate:{
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  subject:{
    type: String
  },
  body: {
    type: String,
    required: true,
    trim: true
  },
  sentAt:{
    type: Number,
    default: new Date().getTime()
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required:true
  }
});

module.exports = {Mail};
