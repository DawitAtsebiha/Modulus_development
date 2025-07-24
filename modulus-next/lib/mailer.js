import nodemailer from 'nodemailer';

// Transport config comes entirely from env
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,       // e.g. smtp.ethereal.email
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',  // true for port 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationCode(to, code) {
  const mailOptions = {
    from: `"Modulus Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Modulus Sign‑Up Verification Code',
    text: `Your verification code is: ${code}`,
    html: `<p>Your verification code is: <b>${code}</b></p>`,
  };

  await transporter.sendMail(mailOptions);
}