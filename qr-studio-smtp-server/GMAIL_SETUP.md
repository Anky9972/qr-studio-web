# Gmail App Password Setup Guide

## ⚠️ Current Issue
Gmail is rejecting your credentials. You need to create an **App Password**.

## 📝 Step-by-Step Setup

### Step 1: Enable 2-Step Verification
1. Go to: https://myaccount.google.com/security
2. Find "2-Step Verification"
3. Click "Get Started" and follow the setup
4. ✅ Verify your phone number

### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
   - OR search "App passwords" in Google Account settings
2. Select:
   - **App:** Mail
   - **Device:** Windows Computer (or Other)
3. Click **Generate**
4. Copy the **16-character password** (format: `xxxx xxxx xxxx xxxx`)
   - Example: `abcd efgh ijkl mnop`

### Step 3: Update .env File
```dotenv
SMTP_PASS=abcdefghijklmnop  # Remove spaces from the 16-char password
```

## 🔄 Alternative: Use a Different Email Service

### Option 1: Create a New Gmail Account (Easier)
1. Create fresh Gmail: https://accounts.google.com/signup
2. Enable 2-Step Verification immediately
3. Generate App Password
4. Use that for QR Studio

### Option 2: Use SendGrid (Recommended for Production)
```dotenv
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=YOUR_SENDGRID_API_KEY
```
- Sign up: https://signup.sendgrid.com/
- Get API key: https://app.sendgrid.com/settings/api_keys
- Free: 100 emails/day

### Option 3: Use Resend (Modern & Easy)
```dotenv
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=resend
SMTP_PASS=YOUR_RESEND_API_KEY
```
- Sign up: https://resend.com/signup
- Get API key: https://resend.com/api-keys
- Free: 100 emails/day

## 🧪 After Updating

1. Update your `.env` file with the correct password
2. Run the test: `node test-service.js`
3. Check your inbox for the test email

## 📧 Current Configuration
- Email: qrstudiolive@gmail.com
- Status: ❌ Authentication failed
- Action needed: Generate app password

## Need Help?
If you continue having issues:
1. Try a different Gmail account
2. Switch to SendGrid/Resend (easier setup)
3. Check Gmail security settings for any blocks
