var mongoose = require('mongoose');
var d;
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/MailApp');

var Mail = mongoose.model('Mail',{
  from:{
    type: String,
    lowercase: true,
    required: [true, "can't be blank"],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    trim: true

  },
  to:{
    type: String,
    lowercase: true,
    required: [true, "can't be blank"],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    trim: true,
  },
  subject:{
    type: String
  },
  body: {
    type: String,
    required: [true, "can't be blank"],
    minlength: 1,
    trim: true
  },
  sentAt:{
    type: Number
  }
});

var newMail = new Mail({
  from:'ay@ayush.com',
  to: 'gh',
  subject: 'asdlkalsd',
  body:'dad asd as d'

});

newMail.save().then((doc) => {
  console.log('Sent mail', doc);
}, (e) => {
  console.log('unable to send mail');
});
