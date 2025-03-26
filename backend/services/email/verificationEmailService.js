// services/email/verificationEmailService.js
const BaseEmailService = require('./baseEmailService');

class VerificationEmailService extends BaseEmailService {
  async sendVerificationEmail(to, code) {
    const subject = '✉️ Your ePatologjia Verification Code';
    
    console.log('Sending verification email to:', to, 'with code:', code);
    
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Account</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            background-color: #f0f4f8;
            margin: 0;
            padding: 0;
            line-height: 1.6;
            color: #1a202c;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 107, 255, 0.1);
            border: 1px solid #e2e8f0;
          }
          .header {
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
            position: relative;
          }
          .header-content {
            position: relative;
            z-index: 2;
          }
          .logo {
            width: 180px;
            margin-bottom: 20px;
          }
          h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
          }
          .content {
            padding: 40px;
            text-align: center;
          }
          .code-container {
            background: #f8fafc;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
            display: inline-block;
            border: 1px dashed #cbd5e0;
          }
          .verification-code {
            font-size: 42px;
            font-weight: 700;
            letter-spacing: 8px;
            color: #2563eb;
            margin: 10px 0;
          }
          .email-type-indicator {
            display: inline-block;
            background-color: #2563eb;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            margin-bottom: 15px;
            font-size: 14px;
          }
          .cta-button {
            display: inline-block;
            background: #2563eb;
            color: white;
            padding: 16px 32px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            margin: 20px 0;
            transition: all 0.3s;
          }
          .cta-button:hover {
            background: #1e40af;
            transform: translateY(-2px);
          }
          .footer {
            background: #f7fafc;
            padding: 25px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          .text-muted {
            color: #718096;
            font-size: 14px;
          }
          .text-center {
            text-align: center;
          }
          .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #cbd5e0, transparent);
            margin: 30px 0;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="header-content">
              <img src="https://i.imgur.com/GJpqiuh.png" alt="ePatologjia Logo" class="logo">
              <h1>Verification Code</h1>
            </div>
          </div>
          
          <div class="content">
            <div class="email-type-indicator">EMAIL VERIFICATION</div>
            <p>Thank you for registering. Please verify your email address.</p>
            
            <div class="code-container">
              <p style="margin-bottom: 15px; font-weight: 500;">Your verification code:</p>
              <div class="verification-code">${code}</div>
              <p class="text-muted">Expires in 10 minutes</p>
            </div>
            
            <p>Use this code to complete your registration and activate your account.</p>
            
            <div class="divider"></div>
            
            <p class="text-muted">If you didn't request this code, please ignore this email or contact our support team.</p>
          </div>
          
          <div class="footer">
            <p class="text-muted">© ${new Date().getFullYear()} ePatologjia. All rights reserved.</p>
            <p class="text-muted">Ulpiana, D-8 H3, Nr. 10 | 10 000 Prishtine, Kosove</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const textTemplate = `ePatologjia Verification Code

Thank you for registering. Please use the following code to verify your email address:

${code}

This code will expire in 10 minutes.

If you didn't request this, please ignore this email.

© ${new Date().getFullYear()} ePatologjia`;

    return await this.sendEmail(to, subject, htmlTemplate, textTemplate);
  }
}

module.exports = new VerificationEmailService();