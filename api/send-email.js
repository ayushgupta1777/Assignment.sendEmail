import nodemailer from 'nodemailer';

const requiredEnv = ['GMAIL_USER', 'GMAIL_APP_PASS'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const missingEnv = requiredEnv.filter((key) => !process.env[key]);
  if (missingEnv.length > 0) {
    return res.status(500).json({
      error: `Missing required environment variables: ${missingEnv.join(', ')}`,
    });
  }

  const { to, cc, bcc, subject, message } = req.body ?? {};

  if (!to || !subject || !message) {
    return res.status(400).json({ error: 'To, subject, and message are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      cc: cc || '',
      bcc: bcc || '',
      subject,
      text: message,
    });

    return res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: error.message || 'Failed to send email.' });
  }
}
