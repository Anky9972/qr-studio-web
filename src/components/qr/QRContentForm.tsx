import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';
import { AlertCircle, Link as LinkIcon, Type, Mail, Phone, Wifi } from 'lucide-react';

interface QRContentFormProps {
    type: string;
    onChange: (value: string) => void;
    initialValue?: string;
    onValidChange?: (isValid: boolean) => void;
}

export const QRContentForm: React.FC<QRContentFormProps> = ({
    type,
    onChange,
    initialValue = '',
    onValidChange
}) => {
    const renderForm = () => {
        switch (type) {
            case 'url':
                return (
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2">
                            <LinkIcon size={16} /> Website URL
                        </Label>
                        <Input
                            placeholder="https://example.com"
                            defaultValue={initialValue}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-full"
                            icon={<LinkIcon size={16} />}
                        />
                        <p className="text-xs text-muted-foreground">
                            Enter the full URL including https://
                        </p>
                    </div>
                );

            case 'text':
                return (
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2">
                            <Type size={16} /> Plain Text
                        </Label>
                        <Textarea
                            placeholder="Enter your text content here..."
                            defaultValue={initialValue}
                            onChange={(e) => onChange(e.target.value)}
                        />
                    </div>
                );

            case 'email':
                return (
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2">
                            <Mail size={16} /> Email Address
                        </Label>
                        <Input
                            type="email"
                            placeholder="user@example.com"
                            defaultValue={initialValue.replace('mailto:', '')}
                            onChange={(e) => onChange(`mailto:${e.target.value}`)}
                        />
                    </div>
                );

            case 'phone':
                return (
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2">
                            <Phone size={16} /> Phone Number
                        </Label>
                        <Input
                            type="tel"
                            placeholder="+1 234 567 8900"
                            defaultValue={initialValue.replace('tel:', '')}
                            onChange={(e) => onChange(`tel:${e.target.value}`)}
                        />
                    </div>
                );

            case 'wifi':
                return (
                    <WifiForm onChange={onChange} />
                );

            default:
                return (
                    <div className="space-y-3">
                        <Label>Content</Label>
                        <Input
                            placeholder="Enter content"
                            defaultValue={initialValue}
                            onChange={(e) => onChange(e.target.value)}
                        />
                    </div>
                );
        }
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            {renderForm()}
        </div>
    );
};

const WifiForm = ({ onChange }: { onChange: (val: string) => void }) => {
    const [ssid, setSsid] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [encryption, setEncryption] = React.useState('WPA');
    const [hidden, setHidden] = React.useState(false);

    React.useEffect(() => {
        const str = `WIFI:S:${ssid};T:${encryption};P:${password};H:${hidden};;`;
        onChange(str);
    }, [ssid, password, encryption, hidden, onChange]);

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label className="flex items-center gap-2"><Wifi size={16} /> Network Name (SSID)</Label>
                <Input value={ssid} onChange={(e) => setSsid(e.target.value)} placeholder="MyWiFiNetwork" />
            </div>
            <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="SecretPassword" />
            </div>
            <div className="space-y-2">
                <Label>Encryption</Label>
                <select
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white/5 border-white/10 text-white"
                    value={encryption}
                    onChange={(e) => setEncryption(e.target.value)}
                >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">No Password</option>
                </select>
            </div>
        </div>
    );
};
