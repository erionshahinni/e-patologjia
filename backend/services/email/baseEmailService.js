// services/email/baseEmailService.js
const nodemailer = require('nodemailer');

class BaseEmailService {
  constructor() {
    this.transporter = this.initTransporter();
  }

  initTransporter() {
    // Make sure environment variables are properly set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Email credentials not found in environment variables');
    }
    
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendEmail(to, subject, htmlTemplate, textTemplate) {
    const mailOptions = {
      from: `"ePatologjia" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlTemplate,
      text: textTemplate
    };

    try {
      console.log(`Attempting to send email to: ${to} with subject: ${subject}`);
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error(`Error sending email to ${to}:`, error);
      // More detailed error information
      if (error.response) {
        console.error('SMTP Response:', error.response);
      }
      return false;
    }
  }

  // Test email configuration
  async testEmailService() {
    try {
      const verify = await this.transporter.verify();
      return { success: true, message: 'Email service is correctly configured' };
    } catch (error) {
      return { 
        success: false, 
        message: 'Email service configuration failed', 
        error: error.message
      };
    }
  }
}

module.exports = BaseEmailService;