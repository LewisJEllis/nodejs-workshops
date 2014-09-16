var express = require('express');
var mailer = require('./mailer');
var router = express.Router();

var ObjectID = require('mongodb').ObjectID;

router.get('/', function(req, res) {
  req.db.collection('notes').find().toArray(function(err, notes) {
    return res.render('index', {
      title: 'Codeweekend Notes',
      notes: notes
    });
  });
});

router.get('/db', function(req, res) {
  req.db.collection('test').find().toArray(function(err, items) {
    return res.send(items);
  });
});

router.get('/:id', function(req, res) {
  req.db.collection('notes').findOne({_id: ObjectID(req.params.id)}, function(err, note) {
    if (err || !note) {
      req.session.message = 'That note does not exist!';
      return res.redirect('/');
    }

    return res.render('note', {
      note: note
    })
  });
});

router.post('/create', function(req, res) {
  if (!(req.body.title && req.body.body)) {
    req.session.message = 'You must provide a title and a body!';
    return res.redirect('/');
  }

  req.db.collection('notes').insert({
    title: req.body.title,
    body: req.body.body
  }, function(err, result) {
    console.log('result: ' + result);
    req.session.message = 'Note created!';
    return res.redirect('/');
  });
});

router.post('/email', function(req, res, next) {
  if (!req.body.email && req.body.note) {
    req.session.message = 'You must provide an email address!';
    res.redirect('/');
  }

  req.db.collection('notes').findOne({_id: ObjectID(req.body.note)}, function(err, note) {
    if (err) {
      req.session.message = 'That note does not exist!';
      return res.redirect('/');
    }

    var mailOptions = {
      from: 'Code Weekend <codeweekenddemo@gmail.com>',
      to: req.body.email,
      subject: note.title,
      text: note.body
    };

    mailer.sendMail(mailOptions, function(err, info) {
      if (err) {
        next(err);
      } else {
        req.session.message = 'Message sent successfully!';
        res.redirect('/' + note.id);
      }
    });
  });
});

module.exports = router;
