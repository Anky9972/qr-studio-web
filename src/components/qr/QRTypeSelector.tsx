import React from 'react';
import {
    Link,
    Type,
    Mail,
    Phone,
    MessageSquare,
    Wifi,
    Contact,
    MapPin,
    Calendar,
    Bitcoin,
    DollarSign,
    Smartphone,
    Twitter,
    Facebook,
    Instagram,
    Linkedin
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface QRType {
    value: string;
    label: string;
    icon: React.ElementType;
    description: string;
}

export const qrTypes: QRType[] = [
    { value: 'url', label: 'URL', icon: Link, description: 'Link to a website' },
    { value: 'text', label: 'Text', icon: Type, description: 'Plain text message' },
    { value: 'email', label: 'Email', icon: Mail, description: 'Send an email' },
    { value: 'phone', label: 'Phone', icon: Phone, description: 'Call a number' },
    { value: 'sms', label: 'SMS', icon: MessageSquare, description: 'Send a text message' },
    { value: 'wifi', label: 'WiFi', icon: Wifi, description: 'Connect to WiFi' },
    { value: 'vcard', label: 'vCard', icon: Contact, description: 'Contact details' },
    { value: 'location', label: 'Location', icon: MapPin, description: 'Geographic location' },
    { value: 'event', label: 'Event', icon: Calendar, description: 'Calendar event' },
    { value: 'bitcoin', label: 'Bitcoin', icon: Bitcoin, description: 'Crypto payment' },
    { value: 'paypal', label: 'PayPal', icon: DollarSign, description: 'PayPal payment' },
    { value: 'appstore', label: 'App Store', icon: Smartphone, description: 'App download link' },
    { value: 'twitter', label: 'Twitter', icon: Twitter, description: 'Social profile' },
    { value: 'facebook', label: 'Facebook', icon: Facebook, description: 'Social profile' },
    { value: 'instagram', label: 'Instagram', icon: Instagram, description: 'Social profile' },
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, description: 'Social profile' },
];

interface QRTypeSelectorProps {
    selectedType: string;
    onSelect: (type: string) => void;
}

export const QRTypeSelector: React.FC<QRTypeSelectorProps> = ({
    selectedType,
    onSelect,
}) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-3">
            {qrTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.value;

                return (
                    <motion.button
                        key={type.value}
                        onClick={() => onSelect(type.value)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 h-28 group",
                            isSelected
                                ? "bg-primary/10 border-primary text-primary shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                                : "bg-background/50 border-white/10 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary"
                        )}
                    >
                        <div className={cn(
                            "p-3 rounded-full mb-2 transition-colors",
                            isSelected ? "bg-primary/20 text-primary" : "bg-white/5 group-hover:bg-primary/10"
                        )}>
                            <Icon size={24} />
                        </div>
                        <span className="text-sm font-medium">{type.label}</span>
                    </motion.button>
                );
            })}
        </div>
    );
};
