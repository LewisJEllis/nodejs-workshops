var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'codeweekenddemo@gmail.com',
        pass: 'cod3w33k3nd'
    }
});

module.exports = transporter;
