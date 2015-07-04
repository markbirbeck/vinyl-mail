var path = require('path');
var _ = require('lodash');
var filters = require('adapter-filters');
var helpers = filters('liquid');

/**
 * Setup an email transporter:
 */

var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var handlebars = require('express-handlebars');

function Mailer(opt) {
  if (!(this instanceof Mailer)) {
    return new Mailer(opt);
  }
  opt = opt || {};

  this.transporter = nodemailer.createTransport({
    service: opt.service,
    auth: opt.auth
  });

  /**
   * Attach the Handlebars processor to the transporter:
   */

  this.transporter.use('compile', hbs({
    viewEngine: handlebars.create({
      defaultLayout: opt.layout,
      helpers: helpers
    }),
    viewPath: opt.viewPath || path.resolve(__dirname, 'views')
  }));

  this.globalOptions = {
    from: opt.from,
    template: opt.template
  };
}

Mailer.prototype.sendMail = function(mailOptions, cb) {
  this.transporter.sendMail(_.merge({}, this.globalOptions, mailOptions), cb);
};

module.exports = Mailer;

