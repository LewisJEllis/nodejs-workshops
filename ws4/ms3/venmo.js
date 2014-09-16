var request = require('request');
var express = require('express');
var router = express.Router();

var clientId = 0; // FILL ME IN FROM YOUR ACCOUNT
var clientSecret = 'FILL ME IN FROM YOUR ACCOUNT';
var authorizeUrl = 'https://api.venmo.com/v1/oauth/authorize?client_id=' + clientId + '&scope=make_payments%20access_profile&response_type=code';
var accessTokenUrl = 'https://api.venmo.com/v1/oauth/access_token';
var paymentUrl = 'https://api.venmo.com/v1/payments';

router.get('/', function(req, res) {
  var venmoUser = false;
  if (req.session.venmo) {
    venmoUser = req.session.venmo.user;
  }

  req.db.collection('payments').find().toArray(function(err, payments) {
    if (err || !payments) {
      payments = false;
    }

    payments.forEach(function(payment) {
      payment.formattedDate = Date(payment.date);
    });

    return res.render('venmo', {
      venmoUser: venmoUser,
      venmoPayments: payments
    });
  })
});

router.get('/authorize', function(req, res) {
  return res.redirect(authorizeUrl);
});

router.get('/oauth', function(req, res) {
  if (!req.query.code) {
    return res.send('no code provided');
  }

  request.post({
    url: accessTokenUrl,
    form: {
      client_id: clientId,
      client_secret: clientSecret,
      code: req.query.code
    }
  }, function(err, response, body) {
    req.session.venmo = JSON.parse(body);
    req.session.message = 'Authenticated Venmo successfully!';
    return res.redirect('/venmo');
  });
});

router.post('/send', function(req, res, next) {
  var amount = req.body.amount;
  var phone = req.body.phone;
  var note = req.body.note;

  if (!(amount && phone && note)) {
    req.session.message = 'You must provide all three fields!';
    return res.redirect('/venmo');
  }

  request.post({
    url: paymentUrl,
    form: {
      access_token: req.session.venmo.access_token,
      phone: phone,
      amount: amount,
      note: note
    }
  }, function(err, response, body) {
    if (err) {
      next(err);
    }

    var recipient = JSON.parse(body).data.payment.target.user.display_name;
    req.db.collection('payments').insert({
      amount: amount,
      phone: phone,
      note: note,
      recipient: recipient,
      date: Date.now()
    }, function(err, result) {
      req.session.message = 'Sent $' + amount + ' to ' + recipient + ' successfully!';
      return res.redirect('/venmo');
    });
  });
});

module.exports = router;
