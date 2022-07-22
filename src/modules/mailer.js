const path = require('path');
const nodemailer = require('nodemailer');
const nodemailerhbs = require('nodemailer-express-handlebars');
const { host, port, user, pass} = require('../config/mail.json');
const exphbs = require ('express-handlebars');

const transport = nodemailer.createTransport({
  host,
  port,
  auth: {user,pass },
});



transport.use(
  'compile',
  nodemailerhbs({
    viewEngine: exphbs.create({
      layoutsDir: path.resolve('./src/app/resources/mail/'),
      partialsDir: path.resolve('./src/app/resources/mail/'),
      defaultLayout: 'default',
      extname: '.hbs',
    }),
  })
);



module.exports = transport;