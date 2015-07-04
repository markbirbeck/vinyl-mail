var _ = require('lodash');
var es = require('event-stream');
var Mailer = require('./mailer');

function Mail(opt) {
  if (!(this instanceof Mail)) {
    return new Mail(opt);
  }
  this.mailer = new Mailer(opt);
}

Mail.prototype.dest = function(glob, opt) {
  var m = this;

  opt = opt || {};

  return es.through(function write(file) {
    var self = this;

    if (file.contents) {
      var data = {};

      _.extend(data, file.meta);

      data.context.content = file.contents.toString();

      m.mailer.sendMail(data, function(error, info) {
        if (error) {
          self.emit('error', error);
        } else {
          self.emit('sent', info.response);
          self.emit('data', file);
        }
      });
    } else {
      self.emit('data', file);
    }
  });
};

module.exports = Mail;
