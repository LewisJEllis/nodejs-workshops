var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  return res.render('index', {
    title: 'Codeweekend Notes'
  });
});

router.get('/:message', function(req, res) {
  req.session.message = req.params.message;
  return res.redirect('/');
});

module.exports = router;
