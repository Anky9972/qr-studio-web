'use client'

import { useState, useEffect, useRef } from 'react'
import { useTheme } from '@/components/providers/theme-provider'
import QRCodeStyling from 'qr-code-styling'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/Card'
import { Slider } from "@/components/ui/slider"
import {
  Link as LinkIcon,
  Type as TextIcon,
  Mail as MailIcon,
  Wifi as WifiIcon,
  User as UserIcon,
  Download,
  Copy,
  Check,
  Palette,
  QrCode
} from 'lucide-react'
import { cn } from '@/lib/utils'

type QRType = 'url' | 'text' | 'email' | 'wifi' | 'vcard'

export function QRCodeGenerator() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const qrRef = useRef<HTMLDivElement>(null)
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null)

  useEffect(() => {
    import('qr-code-styling').then((QRCodeStylingConstructor) => {
      const qr = new QRCodeStylingConstructor.default({
        width: 300,
        height: 300,
        type: 'svg',
        dotsOptions: { type: 'rounded' },
        cornersSquareOptions: { type: 'extra-rounded' },
      })
      setQrCode(qr)
    })
  }, [])

  const [type, setType] = useState<QRType>('url')
  const [data, setData] = useState<any>({
    url: 'https://qrstudio.com',
    text: '',
    email: '',
    wifi: { ssid: '', password: '', encryption: 'WPA' },
    vcard: { firstName: '', lastName: '', phone: '', email: '', org: '' }
  })

  const [options, setOptions] = useState({
    color: '#06b6d4', // Electric Cyan
    background: '#ffffff',
    dotsType: 'rounded' as 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded',
  })

  const [copied, setCopied] = useState(false)

  // Update QR Code
  useEffect(() => {
    let qrData = ''

    switch (type) {
      case 'url':
        qrData = data.url
        break
      case 'text':
        qrData = data.text
        break
      case 'email':
        qrData = `mailto:${data.email}`
        break
      case 'wifi':
        qrData = `WIFI:T:${data.wifi.encryption};S:${data.wifi.ssid};P:${data.wifi.password};;`
        break
      case 'vcard':
        qrData = `BEGIN:VCARD\nVERSION:3.0\nN:${data.vcard.lastName};${data.vcard.firstName}\nFN:${data.vcard.firstName} ${data.vcard.lastName}\nORG:${data.vcard.org}\nTEL:${data.vcard.phone}\nEMAIL:${data.vcard.email}\nEND:VCARD`
        break
    }

    if (!qrData) qrData = 'https://qrstudio.com'

    if (!qrCode) return

    qrCode.update({
      data: qrData,
      dotsOptions: {
        color: options.color,
        type: options.dotsType
      },
      backgroundOptions: { color: options.background },
      cornersSquareOptions: { color: options.color, type: 'extra-rounded' },
      cornersDotOptions: { color: options.color }
    })

    if (qrRef.current) {
      qrRef.current.innerHTML = ''
      qrCode.append(qrRef.current)
    }
  }, [data, type, options, qrCode])

  const handleDownload = async (ext: 'png' | 'svg') => {
    if (!qrCode) return
    await qrCode.download({ extension: ext, name: 'qr-studio-code' })
  }

  const handleCopy = async () => {
    if (!qrCode) return
    try {
      const blob = await qrCode.getRawData('png')
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob as Blob })
        ])
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className={cn(
      "rounded-3xl p-1 shadow-2xl backdrop-blur-3xl border border-white/20",
      "bg-gradient-to-br from-white/10 to-white/5",
      isDark ? "shadow-cyan-500/10" : "shadow-blue-500/10"
    )}>
      <div className={cn(
        "rounded-[20px] p-6 md:p-8 h-full",
        isDark ? "bg-black/80" : "bg-white/80"
      )}>
        <Tabs defaultValue="url" onValueChange={(v) => setType(v as QRType)} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-black/5 dark:bg-white/10 p-1 rounded-xl">
            {[
              { id: 'url', icon: LinkIcon, label: 'URL' },
              { id: 'text', icon: TextIcon, label: 'Text' },
              { id: 'email', icon: MailIcon, label: 'Email' },
              { id: 'wifi', icon: WifiIcon, label: 'WiFi' },
              { id: 'vcard', icon: UserIcon, label: 'vCard' }
            ].map(t => (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="data-[state=active]:bg-white data-[state=active]:text-black dark:data-[state=active]:bg-electric-cyan dark:data-[state=active]:text-black rounded-lg transition-all"
              >
                <t.icon className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline text-xs font-bold">{t.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="min-h-[200px]">
                <TabsContent value="url" className="mt-0 space-y-4 animate-in fade-in slide-in-from-left-4">
                  <div className="space-y-2">
                    <Label>Website URL</Label>
                    <Input
                      placeholder="https://example.com"
                      value={data.url}
                      onChange={(e) => setData({ ...data, url: e.target.value })}
                      className="bg-white/5 border-white/10 focus:border-cyan-500 h-12"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="text" className="mt-0 space-y-4 animate-in fade-in slide-in-from-left-4">
                  <div className="space-y-2">
                    <Label>Plain Text</Label>
                    <textarea
                      placeholder="Enter your text here..."
                      value={data.text}
                      onChange={(e) => setData({ ...data, text: e.target.value })}
                      className="w-full bg-transparent border border-gray-200 dark:border-white/10 rounded-lg p-3 h-32 focus:border-cyan-500 outline-none transition-all"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="email" className="mt-0 space-y-4 animate-in fade-in slide-in-from-left-4">
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input
                      placeholder="john@example.com"
                      value={data.email}
                      onChange={(e) => setData({ ...data, email: e.target.value })}
                      className="bg-white/5 border-white/10 h-12"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="wifi" className="mt-0 space-y-4 animate-in fade-in slide-in-from-left-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Network Name (SSID)</Label>
                      <Input
                        placeholder="MyWiFi"
                        value={data.wifi.ssid}
                        onChange={(e) => setData({ ...data, wifi: { ...data.wifi, ssid: e.target.value } })}
                        className="bg-white/5 border-white/10 h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input
                        type="password"
                        placeholder="********"
                        value={data.wifi.password}
                        onChange={(e) => setData({ ...data, wifi: { ...data.wifi, password: e.target.value } })}
                        className="bg-white/5 border-white/10 h-12"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="vcard" className="mt-0 space-y-4 animate-in fade-in slide-in-from-left-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="First Name"
                      value={data.vcard.firstName}
                      onChange={(e) => setData({ ...data, vcard: { ...data.vcard, firstName: e.target.value } })}
                      className="bg-white/5 border-white/10"
                    />
                    <Input
                      placeholder="Last Name"
                      value={data.vcard.lastName}
                      onChange={(e) => setData({ ...data, vcard: { ...data.vcard, lastName: e.target.value } })}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <Input
                    placeholder="Phone"
                    value={data.vcard.phone}
                    onChange={(e) => setData({ ...data, vcard: { ...data.vcard, phone: e.target.value } })}
                    className="bg-white/5 border-white/10"
                  />
                  <Input
                    placeholder="Email"
                    value={data.vcard.email}
                    onChange={(e) => setData({ ...data, vcard: { ...data.vcard, email: e.target.value } })}
                    className="bg-white/5 border-white/10"
                  />
                </TabsContent>
              </div>

              {/* Customization Options */}
              <div className="pt-6 border-t border-gray-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Palette className="w-4 h-4 text-cyan-500" />
                    Customize Style
                  </h4>
                </div>

                <div className="flex gap-4">
                  <div className="space-y-2 flex-1">
                    <Label className="text-xs">QR Color</Label>
                    <div className="flex gap-2">
                      {['#06b6d4', '#ef4444', '#22c55e', '#a855f7', '#000000'].map(c => (
                        <button
                          key={c}
                          onClick={() => setOptions({ ...options, color: c })}
                          className={cn(
                            "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110",
                            options.color === c ? "border-white ring-2 ring-cyan-500" : "border-transparent"
                          )}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                      <input
                        type="color"
                        value={options.color}
                        onChange={(e) => setOptions({ ...options, color: e.target.value })}
                        className="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="flex flex-col items-center justify-center space-y-6">
              <div
                className={cn(
                  "relative p-6 rounded-3xl transition-all duration-300",
                  "bg-white border-4",
                  isDark ? "border-white/10" : "border-gray-100 shadow-xl"
                )}
              >
                <div ref={qrRef} className="rounded-xl overflow-hidden" />

                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-cyan-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg shadow-cyan-500/20">
                  SCAN ME
                </div>
              </div>

              <div className="flex gap-3 w-full max-w-[300px]">
                <Button
                  onClick={() => handleDownload('png')}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  PNG
                </Button>
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>

              <p className="text-xs text-center text-gray-500 max-w-[250px]">
                Create a free account to unlock analytics, vector formats, and dynamic QR features.
              </p>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
