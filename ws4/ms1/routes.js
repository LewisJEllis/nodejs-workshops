var express = require('express');
var mailer = require('./mailer');
var router = express.Router();

router.get('/', function(req, res) {
  return res.render('index', {
    title: 'Codeweekend Notes',
    notes: req.session.notes
  });
});

router.get('/db', function(req, res) {
  req.db.collection('test').find().toArray(function(err, items) {
    return res.send(items);
  });
});

router.get('/:id', function(req, res) {
  var noteId = Number(req.params.id);
  if (isNaN(noteId) || noteId < 1 || noteId > req.session.notes.length) {
    req.session.message = 'That note does not exist!';
    return res.redirect('/');
  }

  return res.render('note', {
    note: req.session.notes[noteId - 1]
  });
});

router.post('/create', function(req, res) {
  if (!(req.body.title && req.body.body)) {
    req.session.message = 'You must provide a title and a body!';
    return res.redirect('/');
  }

  req.session.notes.push({
    id: req.session.notes.length + 1,
    title: req.body.title,
    body: req.body.body
  });

  req.session.message = 'Note created!';
  return res.redirect('/');
});

router.post('/email', function(req, res, next) {
  if (!req.body.email && req.body.note) {
    req.session.message = 'You must provide an email address!';
    res.redirect('/');
  }

  var note = req.session.notes[req.body.note - 1];
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

module.exports = router;
