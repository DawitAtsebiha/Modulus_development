import nodemailer from 'nodemailer';

// Initialize transporter asynchronously via a Promise
const transporterPromise = (async () => {
  // Create a fresh Ethereal test account
  const testAccount = await nodemailer.createTestAccount();
  console.log('📬 Ethereal test account', testAccount);

  // Create and verify the transporter
  const transport = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  await transport.verify();
  console.log('✅ Mailer is ready to send messages');

  return transport;
})();

export async function sendVerificationCode(to, code) {
  // Wait for transporter to be ready
  const transporter = await transporterPromise;

  const info = await transporter.sendMail({
    from: `"Modulus Support" <${transporter.options.auth.user}>`,
    to,
    subject: 'Modulus Sign-Up Verification Code',
    text: `Your verification code is: ${code}`,
    html: `<p>Your verification code is: <b>${code}</b></p>`,
  });

  console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
}
