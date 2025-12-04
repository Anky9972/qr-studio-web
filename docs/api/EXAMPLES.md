# API Code Examples

Real-world examples for integrating with QR Studio API.

---

## Table of Contents

- [Authentication](#authentication)
- [QR Code Management](#qr-code-management)
- [Analytics](#analytics)
- [Webhooks](#webhooks)
- [Advanced Use Cases](#advanced-use-cases)

---

## Authentication

### Get API Key

First, generate an API key from your dashboard:

1. Go to Settings → API Keys
2. Click "Generate New Key"
3. Copy and store securely

### Using API Key

All examples below use the API key in the `Authorization` header:

```bash
Authorization: Bearer YOUR_API_KEY
```

---

## QR Code Management

### Create a Simple URL QR Code

**cURL:**
```bash
curl -X POST https://qr-studio.com/api/qr-codes \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "title": "My Website",
    "type": "url"
  }'
```

**JavaScript (fetch):**
```javascript
const response = await fetch('https://qr-studio.com/api/qr-codes', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://example.com',
    title: 'My Website',
    type: 'url',
  }),
});

const qrCode = await response.json();
console.log('QR Code ID:', qrCode.id);
```

**Python:**
```python
import requests

response = requests.post(
    'https://qr-studio.com/api/qr-codes',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json',
    },
    json={
        'url': 'https://example.com',
        'title': 'My Website',
        'type': 'url',
    }
)

qr_code = response.json()
print(f"QR Code ID: {qr_code['id']}")
```

**Node.js (axios):**
```javascript
const axios = require('axios');

const { data: qrCode } = await axios.post(
  'https://qr-studio.com/api/qr-codes',
  {
    url: 'https://example.com',
    title: 'My Website',
    type: 'url',
  },
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
    },
  }
);

console.log('QR Code ID:', qrCode.id);
```

### Create a Styled QR Code

```javascript
const response = await fetch('https://qr-studio.com/api/qr-codes', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://example.com',
    title: 'Branded QR',
    type: 'url',
    style: {
      backgroundColor: '#ffffff',
      foregroundColor: '#000000',
      logoUrl: 'https://example.com/logo.png',
      errorCorrectionLevel: 'H', // High for logos
    },
  }),
});

const qrCode = await response.json();
```

### Create a vCard QR Code

```javascript
const vcardData = {
  type: 'vcard',
  url: 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD',
  title: 'John Doe Contact',
};

const response = await fetch('https://qr-studio.com/api/qr-codes', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(vcardData),
});
```

### Create WiFi QR Code

```javascript
const wifiData = {
  type: 'wifi',
  url: 'WIFI:T:WPA;S:MyNetwork;P:MyPassword;;',
  title: 'Office WiFi',
};

const response = await fetch('https://qr-studio.com/api/qr-codes', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(wifiData),
});
```

### List QR Codes with Pagination

```javascript
const page = 1;
const limit = 10;

const response = await fetch(
  `https://qr-studio.com/api/qr-codes?page=${page}&limit=${limit}`,
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
    },
  }
);

const { data, pagination } = await response.json();

console.log(`Page ${pagination.page} of ${pagination.totalPages}`);
console.log(`Total QR codes: ${pagination.total}`);

data.forEach(qr => {
  console.log(`- ${qr.title} (${qr._count.scans} scans)`);
});
```

### Search QR Codes

```javascript
const searchTerm = 'product';

const response = await fetch(
  `https://qr-studio.com/api/qr-codes?search=${encodeURIComponent(searchTerm)}`,
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
    },
  }
);

const { data } = await response.json();
console.log(`Found ${data.length} QR codes matching "${searchTerm}"`);
```

### Update QR Code

```javascript
const qrCodeId = 'clg1234567890';

const response = await fetch(
  `https://qr-studio.com/api/qr-codes/${qrCodeId}`,
  {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'Updated Title',
      url: 'https://new-url.com',
    }),
  }
);

const updatedQR = await response.json();
console.log('Updated:', updatedQR.title);
```

### Delete QR Code

```javascript
const qrCodeId = 'clg1234567890';

const response = await fetch(
  `https://qr-studio.com/api/qr-codes/${qrCodeId}`,
  {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
    },
  }
);

if (response.ok) {
  console.log('QR code deleted');
}
```

---

## Analytics

### Get Overall Analytics

```javascript
const startDate = '2025-01-01';
const endDate = '2025-12-31';

const response = await fetch(
  `https://qr-studio.com/api/analytics?startDate=${startDate}&endDate=${endDate}`,
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
    },
  }
);

const analytics = await response.json();

console.log('Total Scans:', analytics.totalScans);
console.log('Total QR Codes:', analytics.totalQRCodes);

console.log('\nTop QR Codes:');
analytics.topQRCodes.forEach(qr => {
  console.log(`- ${qr.title}: ${qr.scans} scans`);
});

console.log('\nDevice Breakdown:');
console.log(`Mobile: ${analytics.deviceBreakdown.mobile}`);
console.log(`Desktop: ${analytics.deviceBreakdown.desktop}`);
console.log(`Tablet: ${analytics.deviceBreakdown.tablet}`);
```

### Get QR Code Specific Analytics

```javascript
const qrCodeId = 'clg1234567890';

const response = await fetch(
  `https://qr-studio.com/api/qr-codes/${qrCodeId}/analytics`,
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
    },
  }
);

const analytics = await response.json();

console.log(`Total scans: ${analytics.totalScans}`);
console.log(`Scans today: ${analytics.scansToday}`);
console.log(`Unique visitors: ${analytics.uniqueVisitors}`);
```

### Export Analytics to CSV

```javascript
const response = await fetch(
  'https://qr-studio.com/api/analytics/export',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      format: 'csv',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
    }),
  }
);

const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'analytics.csv';
a.click();
```

### Export Analytics to PDF (Python)

```python
import requests

response = requests.post(
    'https://qr-studio.com/api/analytics/export',
    headers={'Authorization': 'Bearer YOUR_API_KEY'},
    json={
        'format': 'pdf',
        'startDate': '2025-01-01',
        'endDate': '2025-12-31',
    }
)

with open('analytics.pdf', 'wb') as f:
    f.write(response.content)

print('Analytics exported to analytics.pdf')
```

### Real-Time Metrics

```javascript
async function getRealTimeMetrics() {
  const response = await fetch(
    'https://qr-studio.com/api/analytics/realtime',
    {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
      },
    }
  );

  const metrics = await response.json();
  
  console.log('Active Scans (last 5 min):', metrics.activeScans);
  console.log('Active QR Codes:', metrics.activeQRCodes);
  console.log('Active Viewers:', metrics.activeViewers);
}

// Poll every 10 seconds
setInterval(getRealTimeMetrics, 10000);
```

---

## Webhooks

### Create Webhook

```javascript
const response = await fetch('https://qr-studio.com/api/webhooks', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://yourapp.com/webhook',
    events: ['qr.created', 'qr.scanned'],
  }),
});

const webhook = await response.json();
console.log('Webhook ID:', webhook.id);
console.log('Secret:', webhook.secret); // Save this!
```

### Verify Webhook Signature (Node.js)

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return signature === expectedSignature;
}

// In your webhook endpoint
app.post('/webhook', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const payload = req.body;
  
  if (!verifyWebhookSignature(payload, signature, WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process webhook
  console.log('Event:', payload.event);
  console.log('Data:', payload.data);
  
  res.status(200).send('OK');
});
```

### Handle Webhook Events

```javascript
app.post('/webhook', (req, res) => {
  const { event, data } = req.body;
  
  switch (event) {
    case 'qr.created':
      console.log('New QR code created:', data.id);
      // Send notification, update database, etc.
      break;
      
    case 'qr.scanned':
      console.log('QR code scanned:', data.qrCodeId);
      console.log('Location:', data.country, data.city);
      console.log('Device:', data.device);
      // Track conversion, trigger automation, etc.
      break;
      
    case 'qr.updated':
      console.log('QR code updated:', data.id);
      break;
      
    default:
      console.log('Unknown event:', event);
  }
  
  res.status(200).send('OK');
});
```

### Test Webhook

```javascript
const webhookId = 'clg1234567890';

const response = await fetch(
  `https://qr-studio.com/api/webhooks/${webhookId}/test`,
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
    },
  }
);

const result = await response.json();

if (result.success) {
  console.log('Webhook test successful!');
  console.log('Status code:', result.statusCode);
} else {
  console.log('Webhook test failed');
}
```

---

## Advanced Use Cases

### Bulk QR Code Creation

```javascript
async function createBulkQRCodes(urls) {
  const qrCodes = [];
  
  for (const url of urls) {
    try {
      const response = await fetch('https://qr-studio.com/api/qr-codes', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          title: `QR for ${url}`,
          type: 'url',
        }),
      });
      
      const qrCode = await response.json();
      qrCodes.push(qrCode);
      
      console.log(`✓ Created QR for ${url}`);
      
      // Rate limiting: wait 100ms between requests
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`✗ Failed to create QR for ${url}:`, error.message);
    }
  }
  
  return qrCodes;
}

// Usage
const urls = [
  'https://example.com/product1',
  'https://example.com/product2',
  'https://example.com/product3',
];

const qrCodes = await createBulkQRCodes(urls);
console.log(`Created ${qrCodes.length} QR codes`);
```

### Dynamic QR Code with Redirect

```javascript
// 1. Create a QR code pointing to your redirect service
const response = await fetch('https://qr-studio.com/api/qr-codes', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://qr-studio.com/r/unique-id',
    title: 'Dynamic Campaign QR',
    type: 'url',
  }),
});

const qrCode = await response.json();

// 2. Later, update the destination URL
await fetch(`https://qr-studio.com/api/qr-codes/${qrCode.id}`, {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://new-destination.com',
  }),
});

console.log('QR code destination updated without regenerating!');
```

### Scheduled QR Code Expiration

```javascript
// Create QR that expires in 7 days
const expiresAt = new Date();
expiresAt.setDate(expiresAt.getDate() + 7);

const response = await fetch('https://qr-studio.com/api/qr-codes', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://example.com/limited-offer',
    title: 'Limited Time Offer',
    type: 'url',
    expiresAt: expiresAt.toISOString(),
  }),
});

const qrCode = await response.json();
console.log('QR code will expire on:', qrCode.expiresAt);
```

### Scan Limit QR Code

```javascript
// Create QR that deactivates after 100 scans
const response = await fetch('https://qr-studio.com/api/qr-codes', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://example.com/contest',
    title: 'Contest Entry',
    type: 'url',
    scanLimit: 100,
  }),
});

const qrCode = await response.json();
console.log('QR code will deactivate after 100 scans');
```

### Analytics Dashboard Integration

```javascript
// Fetch data for a dashboard
async function getDashboardData() {
  const [analytics, realtimeMetrics] = await Promise.all([
    fetch('https://qr-studio.com/api/analytics', {
      headers: { 'Authorization': 'Bearer YOUR_API_KEY' },
    }).then(r => r.json()),
    
    fetch('https://qr-studio.com/api/analytics/realtime', {
      headers: { 'Authorization': 'Bearer YOUR_API_KEY' },
    }).then(r => r.json()),
  ]);
  
  return {
    totalScans: analytics.totalScans,
    totalQRCodes: analytics.totalQRCodes,
    activeScans: realtimeMetrics.activeScans,
    topQRCodes: analytics.topQRCodes,
    deviceBreakdown: analytics.deviceBreakdown,
    scansByDay: analytics.scansByDay,
  };
}

// Update dashboard every 30 seconds
setInterval(async () => {
  const data = await getDashboardData();
  updateDashboardUI(data);
}, 30000);
```

### Error Handling with Retries

```javascript
async function createQRCodeWithRetry(data, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch('https://qr-studio.com/api/qr-codes', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        
        // Don't retry on client errors
        if (response.status >= 400 && response.status < 500) {
          throw new Error(error.error);
        }
        
        throw new Error(`Server error: ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      console.log(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Exponential backoff
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Usage
try {
  const qrCode = await createQRCodeWithRetry({
    url: 'https://example.com',
    title: 'My QR Code',
    type: 'url',
  });
  console.log('Success:', qrCode.id);
} catch (error) {
  console.error('Failed after retries:', error.message);
}
```

---

## Rate Limiting

Handle rate limits gracefully:

```javascript
async function apiRequest(url, options) {
  const response = await fetch(url, options);
  
  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    console.log(`Rate limited. Retry after ${retryAfter} seconds`);
    
    await new Promise(resolve => 
      setTimeout(resolve, retryAfter * 1000)
    );
    
    // Retry request
    return apiRequest(url, options);
  }
  
  return response;
}
```

---

## Support

Need help? Check out:

- [API Documentation](./API_DOCUMENTATION.md)
- [GitHub Issues](https://github.com/yourusername/qr-studio/issues)
- [Discord Community](https://discord.gg/qr-studio)
