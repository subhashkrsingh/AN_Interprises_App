const nodemailer = require('nodemailer');
const env = require('../config/env');
const logger = require('../config/logger');

function createTransporter() {
  if (!env.smtp.host || !env.smtp.user || !env.smtp.pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass,
    },
  });
}

async function sendMail({ to, subject, html, text }) {
  const transporter = createTransporter();
  if (!transporter) {
    logger.info('SMTP is not configured. Email skipped.', { to, subject });
    return { skipped: true };
  }

  return transporter.sendMail({
    from: env.smtp.from,
    to,
    subject,
    html,
    text,
  });
}

module.exports = { sendMail };
