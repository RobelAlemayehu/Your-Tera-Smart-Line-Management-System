# Forget Password Setup Guide

## Overview
The forget password functionality is now fully implemented with email verification. Users can reset their passwords through a secure 4-digit code sent to their email.

## Setup Instructions

### 1. Email Configuration
Update your `.env` file in the backend directory with your email credentials:

```env
# Email Configuration for Password Reset
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**For Gmail:**
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password (not your regular password)
3. Use the App Password in the `EMAIL_PASS` field

### 2. Flow Description

The forget password flow consists of 4 steps:

1. **Forgot Password Page** (`/forgotpassword`)
   - User enters their email address
   - System sends a 4-digit code to their email
   - Automatically redirects to verification page

2. **Verify Code Page** (`/verify`)
   - User enters the 4-digit code received via email
   - Code expires after 10 minutes
   - On success, redirects to reset password page

3. **Reset Password Page** (`/reset-password`)
   - User enters new password and confirmation
   - Password is updated in the database
   - Redirects to success page

4. **Success Page** (`/success`)
   - Confirms password reset
   - Auto-redirects to sign-in page after 5 seconds

### 3. API Endpoints

- `POST /api/auth/forgot-password` - Send reset code to email
- `POST /api/auth/verify-reset-code` - Verify the reset code
- `POST /api/auth/reset-password` - Update password with code

### 4. Security Features

- Reset codes expire after 10 minutes
- Codes are 4-digit random numbers
- Email existence is not revealed for security
- Passwords are hashed using bcrypt
- Both User and Account tables are updated

### 5. Testing

1. Start the backend server: `npm start` (in backend directory)
2. Start the frontend: `npm run dev` (in frontend directory)
3. Navigate to `/signin` and click "Forgot Password?"
4. Follow the flow with a valid email address

### 6. Production Notes

- Ensure EMAIL_USER and EMAIL_PASS are properly configured
- The system falls back to showing the code in response if email fails (for development)
- Remove the fallback code display in production
- Consider implementing rate limiting for password reset requests

## File Structure

```
backend/
├── controllers/authController.js    # Handles password reset logic
├── services/emailService.js         # Email sending functionality
├── models/User.js                   # User model with reset fields
└── routes/authRoutes.js            # Password reset routes

frontend/src/pages/auth/
├── ForgotPassword.jsx              # Email input page
├── Verify.jsx                      # Code verification page
├── ResetPassword.jsx               # New password input page
└── Success.jsx                     # Confirmation page
```

## Troubleshooting

1. **Email not sending**: Check EMAIL_USER and EMAIL_PASS in .env
2. **Code expired**: Codes expire after 10 minutes, request a new one
3. **Invalid code**: Ensure the 4-digit code is entered correctly
4. **Navigation issues**: Check that all routes are properly configured in AppRoutes.jsx