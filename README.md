# vinyl-mail
Send Vinyl files as email.

## Example

The first thing to do is to create a Mail stream:

```javascript
var path = require('path');
var es = require('event-stream');
var Mail = require('vinyl-mail');
var mail = new Mail({
  from: process.env.SEND_FROM,
  layout: 'email',
  template: 'email',
  viewPath: path.resolve(__dirname, 'views'),
  service: process.env.TRANSPORTER_SERVICE,
  auth: {
    user: process.env.TRANSPORTER_AUTH_USER,
    pass: process.env.TRANSPORTER_AUTH_PASS
  }
});
```

The `from` value is a default, but if omitted will need to be provided when sending each email.

The `layout` and `template` values indicate which template to use to create the email, and which layout to place that template into. The location of the templates is provided by the `viewPath` value.

The values in `service` and `auth` specify which email service to use, and these values are passed to [nodemailer](http://npmjs.org/package/nodemailer).

A typical use of the mail stream would be to provide a destination for a Gulp task. Continuing the example, we'll first create a Vinyl file that contains an email body as its `contents` value:

```javascript
var gulp = require('gulp');
var File = require('vinyl');
gulp.task('send', function() {
  var file = new File({
    contents: new Buffer('Hello, World!')
  });
```

Next we augment the file with a `meta` property which contains the target email address, the subject of the email, and a `content` property which will be passed in to the template processor:

```javascript
  file.meta = {
    to: 'the.world@gmail.com',
    subject: 'Hello!',
    context: {
      name: 'World'
    }
  };
```

Now all we need to do is pipe this file to the mail stream's destination, and the file will be sent as an email:

```javascript
  es.readable(function(count, callback) {
      this.emit('data', file);
    })
    .pipe(mail.dest());
```

Each successfully sent email emits a `sent` event with information about the transaction:

```javascript
  es.readable(function(count, callback) {
      this.emit('data', file);
    })
    .pipe(mail.dest())
    .on('sent', function(msg) {
      console.log('Sent email:', msg);
    });
```
