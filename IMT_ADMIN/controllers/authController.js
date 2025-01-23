const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/user');
require('dotenv').config(); // Load environment variables from .env file

const ADMIN_EMAIL = 'admin@admin.com';
const ADMIN_PASSWORD = 'admin123';

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use Gmail or update for another provider
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Error configuring SMTP:', error);
  } else {
    console.log('SMTP is ready to send emails:', success);
  }
});

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Send welcome email
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email address
      to: email, // Recipient email address
      subject: 'Welcome to Our Platform!', // Subject line
      text: `Hi ${username},\n\nThank you for signing up. We're excited to have you on board!\n\nBest regards,\nThe Team`, // Plain text body
      html: `<p>Hi <strong>${username}</strong>,</p>
             <p>Thank you for signing up. We're excited to have you on board!</p>
             <p>Best regards,<br>The Team</p>`, // HTML body
    };

    await transporter.sendMail(mailOptions);

    // Respond to the user
    res.status(201).json({ message: 'User registered successfully. A welcome email has been sent!' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign({ userId: ADMIN_EMAIL, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
};

const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

module.exports = { signup, login, logout };
