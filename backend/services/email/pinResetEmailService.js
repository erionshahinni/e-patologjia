// services/email/pinResetEmailService.js
const BaseEmailService = require('./baseEmailService');

class PinResetEmailService extends BaseEmailService {
  async sendPinResetEmail(to, code) {
    const subject = '🔑 Your ePatologjia Admin PIN Reset Code';
    
    console.log('Sending PIN reset email to:', to, 'with code:', code);
    
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Admin PIN</title>
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
            background: linear-gradient(135deg, #7928CA 0%, #FF0080 100%);
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
            color: #7928CA;
            margin: 10px 0;
          }
          .email-type-indicator {
            display: inline-block;
            background-color: #7928CA;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            margin-bottom: 15px;
            font-size: 14px;
          }
          .cta-button {
            display: inline-block;
            background: #7928CA;
            color: white;
            padding: 16px 32px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            margin: 20px 0;
            transition: all 0.3s;
          }
          .cta-button:hover {
            background: #6B21A8;
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
              <h1>Admin PIN Reset</h1>
            </div>
          </div>
          
          <div class="content">
            <div class="email-type-indicator">PIN RESET</div>
            <p>We received a request to reset your admin PIN for ePatologjia.</p>
            
            <div class="code-container">
              <p style="margin-bottom: 15px; font-weight: 500;">Your PIN reset code:</p>
              <div class="verification-code">${code}</div>
              <p class="text-muted">Expires in 30 minutes</p>
            </div>
            
            <p>Use this code to reset your admin PIN for sensitive operations like deleting records.</p>
            
            <div class="divider"></div>
            
            <p class="text-muted">If you didn't request this code, please ignore this email or secure your account by contacting an administrator.</p>
          </div>
          
          <div class="footer">
            <p class="text-muted">© ${new Date().getFullYear()} ePatologjia. All rights reserved.</p>
            <p class="text-muted">Ulpiana, D-8 H3, Nr. 10 | 10 000 Prishtine, Kosove</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const textTemplate = `ePatologjia Admin PIN Reset Code

We received a request to reset your admin PIN for ePatologjia.

Your PIN reset code: ${code}

This code will expire in 30 minutes.

Use this code to reset your admin PIN for sensitive operations like deleting records.

If you didn't request this, please ignore this email or secure your account by contacting an administrator.

© ${new Date().getFullYear()} ePatologjia`;

    return await this.sendEmail(to, subject, htmlTemplate, textTemplate);
  }
}

module.exports = new PinResetEmailService();