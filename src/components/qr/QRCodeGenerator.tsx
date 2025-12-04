'use client'

import { useState, useEffect } from 'react'
import { generateQRCode } from '@/lib/qr-utils'
import { useTheme } from '@/components/providers/theme-provider'
import DownloadIcon from '@mui/icons-material/Download'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export function QRCodeGenerator() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [text, setText] = useState('https://qrstudio.com')
  const [qrCode, setQrCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    generateQR()
  }, [text])

  const generateQR = async () => {
    if (!text) return
    
    setGenerating(true)
    try {
      const dataURL = await generateQRCode({
        text,
        size: 300,
        foreground: isDark ? '#FFFFFF' : '#000000',
        background: isDark ? '#1A1C1E' : '#FFFFFF',
      })
      setQrCode(dataURL)
    } catch (error) {
      console.error('Error generating QR:', error)
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = qrCode
    link.download = 'qrcode.png'
    link.click()
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className={`rounded-2xl p-8 shadow-md-4 backdrop-blur-sm ${
      isDark 
        ? 'bg-md-dark-surface-container-highest/80' 
        : 'bg-md-light-surface-container-highest/80'
    }`}>
      <div className="space-y-6">
        {/* Input */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? 'text-md-dark-on-surface' : 'text-md-light-on-surface'
          }`}>
            Enter URL or Text
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://example.com"
            className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
              isDark
                ? 'bg-md-dark-surface-container border-md-dark-outline text-md-dark-on-surface focus:border-md-dark-primary'
                : 'bg-md-light-surface-container border-md-light-outline text-md-light-on-surface focus:border-md-light-primary'
            } focus:outline-none`}
          />
        </div>

        {/* QR Code Preview */}
        <div className="flex justify-center">
          {generating ? (
            <div className={`w-[300px] h-[300px] rounded-xl flex items-center justify-center ${
              isDark ? 'bg-md-dark-surface-container' : 'bg-md-light-surface-container'
            }`}>
              <div className="animate-pulse text-center">
                <div className="text-2xl mb-2">⏳</div>
                <p className={isDark ? 'text-md-dark-on-surface-variant' : 'text-md-light-on-surface-variant'}>
                  Generating...
                </p>
              </div>
            </div>
          ) : qrCode ? (
            <div className={`rounded-xl p-4 ${
              isDark ? 'bg-md-dark-surface-container' : 'bg-md-light-surface-container'
            }`}>
              <img
                src={qrCode}
                alt="QR Code"
                className="w-[300px] h-[300px] rounded-lg"
              />
            </div>
          ) : null}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            disabled={!qrCode}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
              qrCode
                ? isDark
                  ? 'bg-md-dark-primary text-md-dark-on-primary hover:opacity-90'
                  : 'bg-md-light-primary text-md-light-on-primary hover:opacity-90'
                : isDark
                  ? 'bg-md-dark-surface-container text-md-dark-on-surface-variant cursor-not-allowed'
                  : 'bg-md-light-surface-container text-md-light-on-surface-variant cursor-not-allowed'
            }`}
          >
            <DownloadIcon />
            Download
          </button>
          
          <button
            onClick={handleCopy}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              isDark
                ? 'bg-md-dark-secondary-container text-md-dark-on-secondary-container hover:opacity-90'
                : 'bg-md-light-secondary-container text-md-light-on-secondary-container hover:opacity-90'
            }`}
          >
            {copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Quick Tip */}
        <div className={`text-xs text-center ${
          isDark ? 'text-md-dark-on-surface-variant' : 'text-md-light-on-surface-variant'
        }`}>
          💡 Try our dashboard for advanced customization, bulk generation, and analytics
        </div>
      </div>
    </div>
  )
}
