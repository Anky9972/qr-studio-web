'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Code as CodeIcon,
  Key as KeyIcon,
  Shield as SecurityIcon,
  Zap,
  Copy as CopyIcon,
  Terminal,
  Server
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function APIDocumentationPage() {
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
    {
      method: 'POST',
      path: '/api/ai/generate-qr',
      description: 'Generate AI-styled QR code',
      auth: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-electric-blue to-electric-violet text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
              <Terminal className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight mb-2">
                API Documentation
              </h1>
              <p className="text-xl text-white/80 font-medium">
                Integrate QR code generation into your applications
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard/settings">
              <Button
                variant="glow"
                size="lg"
                className="bg-white text-electric-blue hover:bg-white/90"
              >
                <KeyIcon className="w-4 h-4 mr-2" />
                Get API Key
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="text-white border-white/30 hover:bg-white/10 hover:text-white"
            >
              View Examples
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 space-y-12">
        {/* Quick Start */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-electric-amber" /> Quick Start
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Get started with the QR Studio API in minutes. Follow these steps to make your first API call.
            </p>
          </div>

          <Alert variant="default" className="bg-electric-blue/5 border-electric-blue/20 text-electric-blue">
            <KeyIcon className="h-4 w-4" />
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>
              All API requests must include your API key in the Authorization header.
              Get your API key from the <Link href="/dashboard/settings" className="font-semibold underline underline-offset-2">Settings page</Link>.
            </AlertDescription>
          </Alert>

          <Card variant="glass" className="overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create a QR Code</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Example request to generate a static URL QR code</p>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">POST</Badge>
                <code className="text-xs bg-gray-100 dark:bg-black px-2 py-1 rounded border border-gray-200 dark:border-white/10 font-mono text-gray-600 dark:text-gray-300">/v1/qr-codes</code>
              </div>
            </div>

            <div className="p-0">
              <Tabs defaultValue="curl" className="w-full">
                <div className="px-6 pt-4">
                  <TabsList>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="curl" className="p-0 m-0 border-t border-gray-100 dark:border-white/5 mt-4">
                  <div className="relative group">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-4 right-4 text-gray-400 hover:text-white bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => navigator.clipboard.writeText(codeExamples.curl)}
                    >
                      <CopyIcon className="w-4 h-4 mr-2" /> Copy
                    </Button>
                    <pre className="p-6 overflow-x-auto bg-[#0d1117] text-gray-300 text-sm font-mono leading-relaxed custom-scrollbar">
                      <code>{codeExamples.curl}</code>
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="javascript" className="p-0 m-0 border-t border-gray-100 dark:border-white/5 mt-4">
                  <div className="relative group">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-4 right-4 text-gray-400 hover:text-white bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => navigator.clipboard.writeText(codeExamples.javascript)}
                    >
                      <CopyIcon className="w-4 h-4 mr-2" /> Copy
                    </Button>
                    <pre className="p-6 overflow-x-auto bg-[#0d1117] text-gray-300 text-sm font-mono leading-relaxed custom-scrollbar">
                      <code>{codeExamples.javascript}</code>
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="python" className="p-0 m-0 border-t border-gray-100 dark:border-white/5 mt-4">
                  <div className="relative group">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-4 right-4 text-gray-400 hover:text-white bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => navigator.clipboard.writeText(codeExamples.python)}
                    >
                      <CopyIcon className="w-4 h-4 mr-2" /> Copy
                    </Button>
                    <pre className="p-6 overflow-x-auto bg-[#0d1117] text-gray-300 text-sm font-mono leading-relaxed custom-scrollbar">
                      <code>{codeExamples.python}</code>
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </div>

        {/* Endpoints */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Server className="w-6 h-6 text-electric-cyan" /> API Endpoints
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Base URL: <code className="bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono">https://api.qrstudio.com</code>
            </p>
          </div>

          <Card variant="glass" className="overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50/50 dark:bg-white/5">
                <TableRow>
                  <TableHead className="w-[100px]">Method</TableHead>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Auth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {endpoints.map((endpoint, idx) => (
                  <TableRow key={idx} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "font-mono font-bold border-0",
                          endpoint.method === 'GET' && "bg-blue-500/10 text-blue-500",
                          endpoint.method === 'POST' && "bg-emerald-500/10 text-emerald-500",
                          endpoint.method === 'PATCH' && "bg-amber-500/10 text-amber-500",
                          endpoint.method === 'DELETE' && "bg-red-500/10 text-red-500",
                        )}
                      >
                        {endpoint.method}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm font-mono text-gray-700 dark:text-gray-300">{endpoint.path}</code>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{endpoint.description}</TableCell>
                    <TableCell className="text-right">
                      {endpoint.auth && (
                        <div className="flex justify-end">
                          <SecurityIcon className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Features */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Features & Limits</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="glass" className="p-6 hover:border-electric-blue/30 transition-colors group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-electric-blue/10 text-electric-blue group-hover:bg-electric-blue group-hover:text-white transition-colors">
                  <KeyIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Authentication</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    API keys are required for all requests. Include your key in the Authorization header as a Bearer token.
                  </p>
                </div>
              </div>
            </Card>

            <Card variant="glass" className="p-6 hover:border-electric-cyan/30 transition-colors group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-electric-cyan/10 text-electric-cyan group-hover:bg-electric-cyan group-hover:text-white transition-colors">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Rate Limits</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    Pro: 10,000 requests/month<br />
                    Business: 50,000 requests/month<br />
                    Enterprise: Unlimited
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-electric-blue to-electric-cyan p-12 text-center text-white shadow-2xl">
          <div className="absolute top-0 left-0 -ml-12 -mt-12 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 -mr-12 -mb-12 h-64 w-64 rounded-full bg-black/20 blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold font-display">Ready to get started?</h2>
            <p className="text-lg text-white/90">
              Create your API key and start generating QR codes programmatically today.
            </p>
            <Link href="/dashboard/settings">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-electric-blue hover:bg-gray-50 border-none shadow-lg px-8 h-12 rounded-xl font-bold"
              >
                Get Your API Key
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
