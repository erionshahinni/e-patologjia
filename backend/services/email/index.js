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

module.exports = {
  verificationEmailService,
  passwordResetEmailService,
  pinResetEmailService,
  testEmailService
};