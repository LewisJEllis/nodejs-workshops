var path = require('path');
var logger = require('morgan');
var express = require('express');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.set('port', process.env.PORT || 3000);

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  return res.render('index', {
    title: 'Codeweekend Notes'
  });
});

// If no routes activated by now, catch the 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Handle any errors by rendering the error page
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    errorMessage: err.message,
    error: app.get('env') === 'development' ? err : {}
  });
});

// Start listening for requests
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
