const nodemailer = require('nodemailer');

// Create transporter based on environment
const createTransporter = () => {
    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'your_sendgrid_api_key') {
        // Use SendGrid for production
        return nodemailer.createTransport({
            host: 'smtp.sendgrid.net',
            port: 587,
            secure: false,
            auth: {
                user: 'apikey',
                pass: process.env.SENDGRID_API_KEY
            }
        });
    } else {
        // Use Gmail for development/fallback
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s/g, '') : ''
            }
        });
    }
};

exports.sendVerificationCode = async (email, code) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.FROM_EMAIL || process.env.EMAIL_USER || 'noreply@yourtera.com',
            to: email,
            subject: 'Password Reset Code - Your Tera',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4A868C;">Password Reset Request</h2>
                    <p>Your password reset code is:</p>
                    <div style="background: #f0f8ff; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                        <h1 style="color: #4A868C; font-size: 32px; margin: 0;">${code}</h1>
                    </div>
                    <p>This code expires in 10 minutes.</p>
                    <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px;">Your Tera Smart Line Management System</p>
                </div>
            `
        };

        console.log('📧 Sending email to:', email);
        console.log('📤 From email:', mailOptions.from);
        console.log('🔧 SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'Set' : 'Not set');
        console.log('🔧 EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
        
        const result = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully:', result.messageId);
        return result;
    } catch (error) {
        console.error('❌ Email sending failed:', error.message);
        throw error;
    }
};