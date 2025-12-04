'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Button,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Code as CodeIcon,
  Key as KeyIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import Link from 'next/link';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`api-tabpanel-${index}`}
      aria-labelledby={`api-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function APIDocumentationPage() {
  const [tabValue, setTabValue] = useState(0);

  const codeExamples = {
    curl: `curl -X POST https://api.qrstudio.com/v1/qr-codes \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "url",
    "content": "https://example.com",
    "size": 512,
    "errorCorrection": "M"
  }'`,
    javascript: `const response = await fetch('https://api.qrstudio.com/v1/qr-codes', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    type: 'url',
    content: 'https://example.com',
    size: 512,
    errorCorrection: 'M'
  })
});

const data = await response.json();
console.log(data);`,
    python: `import requests

url = "https://api.qrstudio.com/v1/qr-codes"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
payload = {
    "type": "url",
    "content": "https://example.com",
    "size": 512,
    "errorCorrection": "M"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
  };

  const endpoints = [
    {
      method: 'POST',
      path: '/v1/qr-codes',
      description: 'Create a new QR code',
      auth: true,
    },
    {
      method: 'GET',
      path: '/v1/qr-codes',
      description: 'List all QR codes',
      auth: true,
    },
    {
      method: 'GET',
      path: '/v1/qr-codes/{id}',
      description: 'Get a specific QR code',
      auth: true,
    },
    {
      method: 'PATCH',
      path: '/v1/qr-codes/{id}',
      description: 'Update a QR code (dynamic only)',
      auth: true,
    },
    {
      method: 'DELETE',
      path: '/v1/qr-codes/{id}',
      description: 'Delete a QR code',
      auth: true,
    },
    {
      method: 'GET',
      path: '/v1/qr-codes/{id}/analytics',
      description: 'Get QR code scan analytics',
      auth: true,
    },
    {
      method: 'POST',
      path: '/v1/qr-codes/bulk',
      description: 'Create QR codes in bulk',
      auth: true,
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <CodeIcon sx={{ fontSize: 48 }} />
            <Typography variant="h2" fontWeight={700}>
              API Documentation
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ mb: 3, opacity: 0.9 }}>
            Integrate QR code generation into your applications
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
              component={Link}
              href="/dashboard/settings"
            >
              Get API Key
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              View Examples
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Quick Start */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Quick Start
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Get started with the QR Studio API in minutes. Follow these steps to make your first API call.
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Authentication Required:</strong> All API requests must include your API key in the Authorization header.
              Get your API key from the <Link href="/dashboard/settings">Settings page</Link>.
            </Typography>
          </Alert>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Create a QR Code
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip label="POST" color="success" size="small" />
                  <Chip label="/v1/qr-codes" variant="outlined" size="small" />
                </Box>
              </Box>

              <Tabs value={tabValue} onChange={(_, val) => setTabValue(val)} sx={{ mb: 2 }}>
                <Tab label="cURL" />
                <Tab label="JavaScript" />
                <Tab label="Python" />
              </Tabs>

              <TabPanel value={tabValue} index={0}>
                <Box sx={{ position: 'relative', bgcolor: 'grey.900', color: 'white', p: 3, borderRadius: 1, fontFamily: 'monospace', fontSize: 14, overflow: 'auto' }}>
                  <Button
                    size="small"
                    startIcon={<CopyIcon />}
                    sx={{ position: 'absolute', top: 8, right: 8, color: 'white' }}
                    onClick={() => navigator.clipboard.writeText(codeExamples.curl)}
                  >
                    Copy
                  </Button>
                  <pre style={{ margin: 0 }}>{codeExamples.curl}</pre>
                </Box>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Box sx={{ position: 'relative', bgcolor: 'grey.900', color: 'white', p: 3, borderRadius: 1, fontFamily: 'monospace', fontSize: 14, overflow: 'auto' }}>
                  <Button
                    size="small"
                    startIcon={<CopyIcon />}
                    sx={{ position: 'absolute', top: 8, right: 8, color: 'white' }}
                    onClick={() => navigator.clipboard.writeText(codeExamples.javascript)}
                  >
                    Copy
                  </Button>
                  <pre style={{ margin: 0 }}>{codeExamples.javascript}</pre>
                </Box>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Box sx={{ position: 'relative', bgcolor: 'grey.900', color: 'white', p: 3, borderRadius: 1, fontFamily: 'monospace', fontSize: 14, overflow: 'auto' }}>
                  <Button
                    size="small"
                    startIcon={<CopyIcon />}
                    sx={{ position: 'absolute', top: 8, right: 8, color: 'white' }}
                    onClick={() => navigator.clipboard.writeText(codeExamples.python)}
                  >
                    Copy
                  </Button>
                  <pre style={{ margin: 0 }}>{codeExamples.python}</pre>
                </Box>
              </TabPanel>
            </CardContent>
          </Card>
        </Box>

        <Divider sx={{ my: 6 }} />

        {/* Endpoints */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            API Endpoints
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Base URL: <code>https://api.qrstudio.com</code>
          </Typography>

          <TableContainer component={Card}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Method</strong></TableCell>
                  <TableCell><strong>Endpoint</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                  <TableCell align="center"><strong>Auth</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {endpoints.map((endpoint, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>
                      <Chip
                        label={endpoint.method}
                        size="small"
                        color={
                          endpoint.method === 'GET' ? 'primary' :
                          endpoint.method === 'POST' ? 'success' :
                          endpoint.method === 'PATCH' ? 'warning' :
                          'error'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <code style={{ fontSize: 13 }}>{endpoint.path}</code>
                    </TableCell>
                    <TableCell>{endpoint.description}</TableCell>
                    <TableCell align="center">
                      {endpoint.auth && <SecurityIcon fontSize="small" color="action" />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Divider sx={{ my: 6 }} />

        {/* Features */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
            Features & Limits
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <KeyIcon color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Authentication
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  API keys are required for all requests. Include your key in the Authorization header as a Bearer token.
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <SpeedIcon color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Rate Limits
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Pro: 10,000 requests/month<br />
                  Business: 50,000 requests/month<br />
                  Enterprise: Unlimited
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Call to Action */}
        <Card sx={{ bgcolor: 'primary.main', color: 'white', textAlign: 'center', p: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Ready to get started?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Create your API key and start generating QR codes programmatically.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            href="/dashboard/settings"
            sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
          >
            Get Your API Key
          </Button>
        </Card>
      </Container>
    </Box>
  );
}
