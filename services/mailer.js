const mailer = require('nodemailer')
const configs = require('../configs')

const transporter = mailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: configs.email,
    pass: configs.password,
  },
  tls: {
    rejectUnauthorized: false,
  },
})

let defaultMailOptions = {
  to: process.env.EMAIL,
}

module.exports = {
  sendMail: options => new Promise((resolve, reject) => {
    transporter.sendMail({
      ...defaultMailOptions,
      ...options,
    }, (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  }),
}
