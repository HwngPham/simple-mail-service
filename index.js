require('dotenv').config();
const express = require('express')
const app = express()
const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const flash = require('connect-flash')
const { sendMail } = require('./services/mailer')

app.use(cookieParser('my secret'))
app.use(session({
  cookie: {
    maxAge: 60000,
  }
}))
app.use(flash())
app.use(fileUpload())
app.use(bodyParser.urlencoded({ extended: true  }))
app.set('view engine', 'ejs')
app.listen(3000, () => {
  console.log('Mail server is running on http://localhost:3000/')
})

app.get('/', (req, res) => {
  res.render('index', {
    successMsg: req.flash('successMsg'),
    errorMsg: req.flash('errorMsg'),
  })
})

app.post('/send-mail', (req, res) => {
  const {  to, subject } = req.body
  const { template } = req.files

  sendMail({
    to: to || process.env.EMAIL,
    subject,
    html: template.data,
  })
    .then(() => {
      req.flash('successMsg', `The email has been sent to ${to || process.env.EMAIL}`)
    })
    .catch(error => {
      req.flash('errorMsg', `Sending email failed: ${error}`)
    })
    .finally(() => {
      res.redirect('/')
    })
})
