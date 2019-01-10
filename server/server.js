var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Mail} = require('./models/mail');

var app = express();

app.use(bodyParser.json());

app.post('/mails', (req,res) => {
  var mail = new Mail({
    to: req.body.to,
    subject: req.body.subject,
    body: req.body.body,

  });

  mail.save().then((doc) => {
      res.send(doc);
    }, (e) => {
      res.status(400).send(e);
  });
});

app.get('/mails', (req,res) => {
  Mail.find().then((mails) => {
    res.send({mails});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/mails/:id', (req,res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Mail.findById(id).then((mail) =>{
    if(!mail){
      return res.status(404).send();
    }

    res.send({mail});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/mails/:id', (req,res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
      return res.status(404).send();
  }

  Mail.findByIdAndDelete(id).then((mail) => {
    if(!mail){
      return res.status(404).send();
    }

    res.send({mail});
  }).catch((e) => {
    res.status(404).send();
  });
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});
