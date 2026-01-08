const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

exports.sendVerificationCode = async (email, code) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Code - Your Tera',
        html: `
            <h2>Password Reset Request</h2>
            <p>Your password reset code is: <strong>${code}</strong></p>
            <p>This code expires in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
        `
    };

    return await transporter.sendMail(mailOptions);
};