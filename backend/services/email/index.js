// services/email/index.js
const BaseEmailService = require('./baseEmailService');
const verificationEmailService = require('./verificationEmailService');
const passwordResetEmailService = require('./passwordResetEmailService');
const pinResetEmailService = require('./pinResetEmailService');

// Export a test function that can be used to verify email configuration
const testEmailService = async () => {
  const baseService = new BaseEmailService();
  return await baseService.testEmailService();
};

// General email sending function
const sendEmail = async (to, subject, htmlTemplate, textTemplate) => {
  const baseService = new BaseEmailService();
  return await baseService.sendEmail(to, subject, htmlTemplate, textTemplate);
};

module.exports = {
  verificationEmailService,
  passwordResetEmailService,
  pinResetEmailService,
  testEmailService,
  sendEmail
};