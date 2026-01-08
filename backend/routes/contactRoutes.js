// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const emailService = require('../services/email');

// Contact form endpoint
router.post('/', async (req, res) => {
  try {
    const { name, email, message, to } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        message: 'Të gjitha fushat janë të detyrueshme' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Email i pavlefshëm' 
      });
    }

    const recipientEmail = to || 'info@patologjia.com';
    
    // Create HTML email template
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1f2937; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #374151; }
            .value { color: #6b7280; margin-top: 5px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Mesazh i ri nga faqja e internetit</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Emri:</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${email}</div>
              </div>
              <div class="field">
                <div class="label">Mesazhi:</div>
                <div class="value">${message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
            <div class="footer">
              <p>Ky mesazh është dërguar nga forma e kontaktit në faqen e internetit.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textTemplate = `
Mesazh i ri nga faqja e internetit

Emri: ${name}
Email: ${email}

Mesazhi:
${message}

---
Ky mesazh është dërguar nga forma e kontaktit në faqen e internetit.
    `;

    // Send email
    const emailSent = await emailService.sendEmail(
      recipientEmail,
      `Mesazh i ri nga ${name} - Contact Form`,
      htmlTemplate,
      textTemplate
    );

    if (emailSent) {
      res.json({ 
        message: 'Mesazhi është dërguar me sukses',
        success: true 
      });
    } else {
      res.status(500).json({ 
        message: 'Gabim në dërgimin e email-it. Ju lutem provoni përsëri.',
        success: false 
      });
    }
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      message: 'Gabim në server. Ju lutem provoni përsëri më vonë.',
      success: false 
    });
  }
});

module.exports = router;
