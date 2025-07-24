import nodemailer from 'nodemailer';

// Change to let so we can assign below
let transporter;

(async () => {
  // 1) Create a fresh Ethereal test account
  const testAccount = await nodemailer.createTestAccount();
  console.log('📬 Ethereal test account', testAccount);

  // 2) Now initialize the transporter using those credentials
  transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // 3) Verify the connection configuration
  transporter.verify((err, success) => {
    if (err) console.error('Mailer verify failed:', err);
    else      console.log('✅ Mailer is ready to send messages');
  });
})();

// 4) Export your send function, which will wait for transporter
export async function sendVerificationCode(to, code) {
  if (!transporter) {
    throw new Error('Mailer not initialized yet');
  }

  const info = await transporter.sendMail({
    from: `"Modulus Support" <${transporter.options.auth.user}>`,
    to,
    subject: 'Modulus Sign-Up Verification Code',
    text: `Your verification code is: ${code}`,
    html: `<p>Your verification code is: <b>${code}</b></p>`,
  });

  console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
}
