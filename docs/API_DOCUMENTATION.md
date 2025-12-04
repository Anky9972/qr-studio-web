# QR Studio API Documentation

## Base URL
```
Production: https://your-domain.com/api
Development: http://localhost:3000/api
```

## Authentication

All authenticated endpoints require a valid session token or API key.

### Session Authentication
Include session cookie in requests (automatic with browser).

### API Key Authentication
```http
Authorization: Bearer YOUR_API_KEY
```

Create API keys in Dashboard → Settings → API Keys.

---

## QR Codes

### List QR Codes
```http
GET /api/qr-codes
```

**Query Parameters:**
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 10, max: 100)
- `search` (string, optional) - Search by name or content
- `type` (string, optional) - Filter by type (url, vcard, wifi, etc.)
- `campaignId` (string, optional) - Filter by campaign

**Response:**
```json
{
  "qrCodes": [
    {
      "id": "clx1234567",
      "name": "Product QR",
      "type": "url",
      "content": "https://example.com",
      "shortUrl": "qr.st/abc123",
      "scanCount": 42,
      "createdAt": "2025-12-03T10:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "totalPages": 10
}
```

### Get QR Code by ID
```http
GET /api/qr-codes/{id}
```

**Response:**
```json
{
  "id": "clx1234567",
  "name": "Product QR",
  "type": "url",
  "qrType": "url",
  "content": "https://example.com",
  "destination": "https://example.com",
  "shortUrl": "qr.st/abc123",
  "size": 512,
  "foreground": "#000000",
  "background": "#FFFFFF",
  "scanCount": 42,
  "lastScanned": "2025-12-03T09:45:00Z",
  "createdAt": "2025-12-03T08:00:00Z",
  "updatedAt": "2025-12-03T09:45:00Z"
}
```

### Create QR Code
```http
POST /api/qr-codes
```

**Request Body:**
```json
{
  "name": "Product QR",
  "type": "url",
  "qrType": "url",
  "content": "https://example.com",
  "size": 512,
  "foreground": "#000000",
  "background": "#FFFFFF",
  "errorLevel": "M",
  "pattern": "square"
}
```

**Response:**
```json
{
  "id": "clx1234567",
  "shortUrl": "qr.st/abc123",
  "message": "QR code created successfully"
}
```

### Update QR Code
```http
PUT /api/qr-codes/{id}
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "content": "https://new-url.com",
  "foreground": "#FF0000"
}
```

### Delete QR Code
```http
DELETE /api/qr-codes/{id}
```

**Response:**
```json
{
  "message": "QR code deleted successfully"
}
```

### Bulk Generate QR Codes
```http
POST /api/qr-codes/bulk
```

**Request Body:**
```json
{
  "qrCodes": [
    {
      "name": "QR 1",
      "type": "url",
      "content": "https://example1.com"
    },
    {
      "name": "QR 2",
      "type": "url",
      "content": "https://example2.com"
    }
  ],
  "style": {
    "size": 512,
    "foreground": "#000000",
    "background": "#FFFFFF"
  }
}
```

---

## Analytics

### Get Dashboard Stats
```http
GET /api/dashboard/stats
```

**Response:**
```json
{
  "totalQRCodes": 150,
  "totalScans": 1250,
  "scansThisMonth": 380,
  "dynamicQRCodes": 45,
  "activeCampaigns": 3
}
```

### Get QR Code Analytics
```http
GET /api/v1/qr-codes/{id}/analytics
```

**Query Parameters:**
- `startDate` (string, optional) - ISO date string
- `endDate` (string, optional) - ISO date string
- `groupBy` (string, optional) - day, week, month

**Response:**
```json
{
  "totalScans": 42,
  "uniqueUsers": 28,
  "scansByDate": [
    { "date": "2025-12-01", "count": 15 },
    { "date": "2025-12-02", "count": 18 },
    { "date": "2025-12-03", "count": 9 }
  ],
  "scansByCountry": [
    { "country": "USA", "count": 20 },
    { "country": "UK", "count": 12 }
  ],
  "scansByDevice": [
    { "device": "mobile", "count": 30 },
    { "device": "desktop", "count": 12 }
  ]
}
```

### Get Real-time Metrics
```http
GET /api/analytics/realtime
```

**Response:**
```json
{
  "scansLastMinute": 5,
  "activeQRCodes": 12,
  "scansToday": 234,
  "currentViewers": 3
}
```

### Export Analytics
```http
POST /api/analytics/export
```

**Request Body:**
```json
{
  "format": "csv",
  "metrics": ["Total Scans", "QR Code Performance"],
  "startDate": "2025-11-01",
  "endDate": "2025-12-01"
}
```

**Response:** File download (CSV/Excel/PDF)

---

## Webhooks

### List Webhooks
```http
GET /api/webhooks
```

**Response:**
```json
{
  "webhooks": [
    {
      "id": "clx9876543",
      "name": "Scan Notification",
      "url": "https://api.example.com/webhook",
      "events": ["qr.scanned"],
      "enabled": true,
      "createdAt": "2025-12-01T10:00:00Z"
    }
  ]
}
```

### Create Webhook
```http
POST /api/webhooks
```

**Request Body:**
```json
{
  "name": "Scan Notification",
  "url": "https://api.example.com/webhook",
  "events": ["qr.scanned", "qr.created"],
  "secret": "your-secret-key"
}
```

### Test Webhook
```http
POST /api/webhooks/{id}/test
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "response": "OK"
}
```

### Webhook Events

**Available Events:**
- `qr.created` - QR code created
- `qr.updated` - QR code updated
- `qr.deleted` - QR code deleted
- `qr.scanned` - QR code scanned

**Webhook Payload Example:**
```json
{
  "event": "qr.scanned",
  "timestamp": "2025-12-03T10:30:00Z",
  "data": {
    "qrCodeId": "clx1234567",
    "qrCodeName": "Product QR",
    "scanId": "clx9999999",
    "location": {
      "country": "USA",
      "city": "New York"
    },
    "device": "mobile",
    "browser": "Chrome"
  },
  "userId": "clx1111111"
}
```

**Webhook Signature Verification:**
```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

---

## Campaigns

### List Campaigns
```http
GET /api/campaigns
```

### Create Campaign
```http
POST /api/campaigns
```

**Request Body:**
```json
{
  "name": "Summer Sale",
  "description": "Summer promotion campaign"
}
```

### Get Campaign Analytics
```http
GET /api/campaigns/{id}
```

---

## Templates

### List Templates
```http
GET /api/templates
```

**Query Parameters:**
- `category` (string, optional) - Filter by category
- `public` (boolean, optional) - Show only public templates

### Create Template
```http
POST /api/templates
```

**Request Body:**
```json
{
  "name": "Business Card Template",
  "description": "Professional vCard template",
  "category": "business",
  "design": {
    "foreground": "#000000",
    "background": "#FFFFFF",
    "pattern": "rounded"
  }
}
```

---

## User Management

### Get User Profile
```http
GET /api/user/profile
```

### Update User Profile
```http
PUT /api/user/profile
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Change Password
```http
POST /api/user/change-password
```

**Request Body:**
```json
{
  "currentPassword": "old-password",
  "newPassword": "new-password"
}
```

### Get Usage Limits
```http
GET /api/user/limits
```

**Response:**
```json
{
  "plan": "PRO",
  "limits": {
    "qrCodes": 500,
    "scansPerMonth": -1,
    "dynamicQRCodes": 100,
    "apiKeys": 5,
    "teamMembers": 10
  },
  "usage": {
    "qrCodes": 245,
    "scansThisMonth": 12450,
    "dynamicQRCodes": 56,
    "apiKeys": 2,
    "teamMembers": 4
  }
}
```

### Export User Data (GDPR)
```http
GET /api/user/export-data
```

**Response:** JSON file with all user data

### Delete Account
```http
DELETE /api/user/delete-account
```

---

## Teams

### List Team Members
```http
GET /api/team
```

### Invite Team Member
```http
POST /api/team/invite
```

**Request Body:**
```json
{
  "email": "member@example.com",
  "role": "editor"
}
```

**Roles:**
- `viewer` - Read-only access
- `editor` - Can create/edit QR codes
- `admin` - Full access

---

## API Keys

### List API Keys
```http
GET /api/api-keys
```

### Create API Key
```http
POST /api/api-keys
```

**Request Body:**
```json
{
  "name": "Production API Key",
  "expiresAt": "2026-12-03"
}
```

### Delete API Key
```http
DELETE /api/api-keys/{id}
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional error details",
  "code": "ERROR_CODE"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

---

## Rate Limiting

API requests are rate-limited based on your plan:

| Plan | Rate Limit |
|------|------------|
| Free | 100 requests/hour |
| Pro | 1,000 requests/hour |
| Business | 10,000 requests/hour |

Rate limit headers:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1701619200
```

---

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

**Response Headers:**
```http
X-Total-Count: 245
X-Page: 1
X-Per-Page: 10
X-Total-Pages: 25
```

---

## WebSocket API (Real-time Analytics)

### Connect to WebSocket
```javascript
import { io } from 'socket.io-client';

const socket = io('https://your-domain.com', {
  path: '/api/socket',
  auth: {
    token: 'your-session-token'
  }
});

socket.on('connect', () => {
  console.log('Connected to real-time analytics');
});

socket.on('metrics:update', (data) => {
  console.log('Metrics updated:', data);
});

socket.on('scan:new', (scan) => {
  console.log('New scan:', scan);
});

// Subscribe to specific QR code
socket.emit('subscribe:qrcode', 'qr-code-id');
```

### Events
- `metrics:update` - Real-time metrics update
- `scan:new` - New scan event
- `qrcode:scan` - Scan for specific QR code (after subscribing)

---

## Code Examples

### JavaScript/Node.js
```javascript
const fetch = require('node-fetch');

async function createQRCode() {
  const response = await fetch('https://your-domain.com/api/qr-codes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
      name: 'My QR Code',
      type: 'url',
      content: 'https://example.com'
    })
  });
  
  const data = await response.json();
  console.log('QR Code created:', data);
}
```

### Python
```python
import requests

def create_qr_code():
    response = requests.post(
        'https://your-domain.com/api/qr-codes',
        headers={
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_KEY'
        },
        json={
            'name': 'My QR Code',
            'type': 'url',
            'content': 'https://example.com'
        }
    )
    
    data = response.json()
    print('QR Code created:', data)
```

### cURL
```bash
curl -X POST https://your-domain.com/api/qr-codes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "name": "My QR Code",
    "type": "url",
    "content": "https://example.com"
  }'
```

---

## Best Practices

1. **Use API Keys for programmatic access** - Don't expose session cookies
2. **Implement exponential backoff** - For rate limit handling
3. **Verify webhook signatures** - Always validate webhook payloads
4. **Cache responses** - Use Redis or similar for frequently accessed data
5. **Handle errors gracefully** - Implement proper error handling
6. **Use pagination** - Don't fetch all records at once
7. **Monitor rate limits** - Check response headers

---

## Support

For API support:
- Email: support@qrstudio.com
- Documentation: https://docs.qrstudio.com
- GitHub Issues: https://github.com/your-org/qr-studio/issues
