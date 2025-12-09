# QR Studio SMTP Server

Standalone SMTP server for handling email operations in QR Studio application.

## Features

- 📧 Email sending via SMTP (Nodemailer)
- 🔄 Queue management with Bull and Redis
- 🔒 API key authentication
- 🚦 Rate limiting
- 📊 Logging with Winston
- ✅ Input validation with Zod
- 🛡️ Security headers with Helmet
- 🔄 Retry mechanism for failed emails

## Prerequisites

- Node.js >= 18.0.0
- Redis server (for queue management)
- SMTP credentials (Gmail, SendGrid, etc.)

## Installation

```bash
cd qr-studio-smtp-server
npm install
```

## Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update the environment variables:
- Set your SMTP credentials
- Configure Redis connection
- Set a secure API key
- Adjust rate limiting as needed

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## API Endpoints

### Health Check
```http
GET /health
```

### Send Email
```http
POST /api/email/send
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "to": "user@example.com",
  "subject": "Welcome to QR Studio",
  "html": "<h1>Welcome!</h1>",
  "from": "noreply@qrstudio.com" // optional
}
```

### Send Bulk Emails
```http
POST /api/email/send-bulk
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "emails": [
    {
      "to": "user1@example.com",
      "subject": "Welcome",
      "html": "<h1>Hello User 1</h1>"
    },
    {
      "to": "user2@example.com",
      "subject": "Welcome",
      "html": "<h1>Hello User 2</h1>"
    }
  ]
}
```

### Queue Status
```http
GET /api/email/queue/status
Authorization: Bearer YOUR_API_KEY
```

## Email Templates

The server supports sending pre-defined email templates:

### Welcome Email
```http
POST /api/email/templates/welcome
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "to": "user@example.com",
  "userName": "John Doe",
  "userEmail": "user@example.com"
}
```

### Password Reset
```http
POST /api/email/templates/password-reset
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "to": "user@example.com",
  "userName": "John Doe",
  "resetUrl": "https://qrstudio.com/reset-password?token=..."
}
```

### Team Invitation
```http
POST /api/email/templates/team-invitation
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "to": "user@example.com",
  "inviterName": "Jane Doe",
  "teamName": "My Team",
  "role": "member",
  "inviteUrl": "https://qrstudio.com/accept-invite?token=..."
}
```

### QR Scan Notification
```http
POST /api/email/templates/scan-notification
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "to": "user@example.com",
  "userName": "John Doe",
  "qrCodeName": "My QR Code",
  "scanCount": 5,
  "timestamp": "2024-12-09T10:30:00Z",
  "dashboardUrl": "https://qrstudio.com/dashboard",
  "location": "New York, USA",
  "device": "iPhone 14"
}
```

## Error Handling

The server returns standard HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid input)
- `401`: Unauthorized (invalid API key)
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error

## Security

- API key authentication required for all endpoints
- Rate limiting to prevent abuse
- Helmet for security headers
- Input validation with Zod
- CORS protection

## Monitoring

Monitor queue status and email delivery:
```bash
GET /api/email/queue/status
```

Response:
```json
{
  "waiting": 5,
  "active": 2,
  "completed": 100,
  "failed": 1
}
```

## Integration with Main App

Update your main application's email service to use this SMTP server:

```typescript
// src/lib/emailService.ts
const SMTP_SERVER_URL = process.env.SMTP_SERVER_URL || 'http://localhost:3001';
const SMTP_API_KEY = process.env.SMTP_API_KEY;

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const response = await fetch(`${SMTP_SERVER_URL}/api/email/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SMTP_API_KEY}`,
    },
    body: JSON.stringify({ to, subject, html }),
  });

  return response.json();
}
```

## Troubleshooting

### Redis Connection Issues
Ensure Redis is running:
```bash
redis-cli ping
```

### SMTP Authentication Errors
- Verify SMTP credentials
- Enable "Less secure app access" for Gmail or use App Passwords
- Check firewall settings

### Rate Limit Errors
Adjust rate limiting in `.env`:
```env
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=200
```

## License

MIT
