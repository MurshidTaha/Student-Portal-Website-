const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.submitContact = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { name, email, phone, message } = req.body;

    // Save to database
    const contact = new Contact({
      name,
      email,
      phone,
      message
    });

    await contact.save();

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Contact Form Submission - Student Portal',
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    // Send auto-reply to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting Student Portal',
      html: `
        <h3>Thank you for contacting us!</h3>
        <p>Dear ${name},</p>
        <p>We have received your message and will get back to you within 24-48 hours.</p>
        <p><strong>Your message:</strong></p>
        <p>${message}</p>
        <br>
        <p>Best regards,</p>
        <p>Student Portal Team</p>
      `
    };

    await transporter.sendMail(userMailOptions);

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us. We will get back to you soon!'
    });

  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting contact form'
    });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status) query.status = status;

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(query);

    res.json({
      success: true,
      contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};