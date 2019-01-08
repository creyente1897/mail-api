var mongoose = require('mongoose');

var Mail = mongoose.model('Mail',{
  to:{
    type: String,
    required: true,
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
    default: null
  }
});

module.exports = {Mail};
