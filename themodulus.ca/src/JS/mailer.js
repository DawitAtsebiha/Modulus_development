import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'trinity.daugherty@ethereal.email',
        pass: 'ZarY2ukftqq8nyeSKs'
    }
});

export async function sendVerificationCode(to, code) {
    const mailOptions = {
        from: `"Modulus Support" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Modulus Sign-Up Verification Code",
        text: `"Your verification code is: ${code}`,
        html: `<p>Your verification code is: <b>${code}</b></p>`,
    };

    await transporter.sendMail(mailOptions)
}