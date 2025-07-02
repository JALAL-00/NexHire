import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

async function testEmail() {
  console.log('GMAIL_USER:', process.env.GMAIL_USER);
  console.log('GMAIL_PASS:', process.env.GMAIL_PASS);

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: 'jalaluddin0046356@gmail.com', // Replace with your email (e.g., jalal@gmail.com)
      subject: 'Test Email from Job Portal',
      text: 'This is a test email to verify Nodemailer configuration.',
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

testEmail();