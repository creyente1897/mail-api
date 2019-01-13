const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Mail} = require('./models/mail');
var {authenticate} = require('./middleware/authenticate');

var app = express();

app.use(bodyParser.json());

app.post('/mails',authenticate, (req,res) => {
  var mail = new Mail({
    to: req.body.to,
    subject: req.body.subject,
    body: req.body.body,
    _creator: req.user._id
  });

  mail.save().then((doc) => {
      res.send(doc);
    }, (e) => {
      res.status(400).send(e);
  });
});

app.get('/mails',authenticate, (req,res) => {
  Mail.find({
    _creator: req.user._id
  }).then((mails) => {
    res.send({mails});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/mails/:id',authenticate, (req,res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Mail.findOne({
    _id: id,
    _creator: req.user._id
  }).then((mail) =>{
    if(!mail){
      return res.status(404).send();
    }

    res.send({mail});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/mails/:id', authenticate, (req,res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
      return res.status(404).send();
  }

  Mail.findOneAndDelete({
    _id: id,
    _creator: req.user._id
  }).then((mail) => {
    if(!mail){
      return res.status(404).send();
    }

    res.send({mail});
  }).catch((e) => {
    res.status(404).send();
  });
});

app.patch('/mails/:id', authenticate, (req,res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['to', 'subject', 'body']);

  if(!ObjectID.isValid(id)){
      return res.status(404).send();
  }

  Mail.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((mail) => {
    if(!mail){
      return res.status(404).send();
    }else{
      mail.body.sentAt = new Date().getTime();
      res.send({mail});
    }
  }).catch((e) => {
    res.status(404).send();
  });
});

app.post('/users', (req,res) => {
  var body = _.pick(req.body, ['email','password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.get('/users/me', authenticate, (req,res) => {
  res.send(req.user);
});

app.post('/users/login', (req,res) => {
  var body = _.pick(req.body, ['email', 'password']);

User.findByCredentials(body.email, body.password).then((user) => {
  return user.generateAuthToken().then((token) => {
    res.header('x-auth', token).send(user);
  });
}).catch((e) => {
  res.status(400).send();
});
});

app.delete('/users/me/token', authenticate, (req,res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  })
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});
