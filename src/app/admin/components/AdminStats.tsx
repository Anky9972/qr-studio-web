import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import {
    Users,
    QrCode,
    Scan,
    DollarSign,
    ArrowUpRight
} from 'lucide-react';

interface AdminStatsProps {
    stats: {
        totalUsers: number;
        activeUsers: number;
        totalQRCodes: number;
        totalScans: number;
        revenue: number;
    };
}

export function AdminStats({ stats }: AdminStatsProps) {
    const statItems = [
        {
            label: 'Total Users',
            value: stats.totalUsers.toLocaleString(),
            subValue: `${stats.activeUsers} active`,
            icon: Users,
            color: 'text-electric-blue',
            gradient: 'from-blue-500/10 to-transparent',
            borderColor: 'border-blue-500/20'
        },
        {
            label: 'Total QR Codes',
            value: stats.totalQRCodes.toLocaleString(),
            subValue: 'All time',
            icon: QrCode,
            color: 'text-electric-cyan',
            gradient: 'from-cyan-500/10 to-transparent',
            borderColor: 'border-cyan-500/20'
        },
        {
            label: 'Total Scans',
            value: stats.totalScans.toLocaleString(),
            subValue: 'Global',
            icon: Scan,
            color: 'text-electric-violet',
            gradient: 'from-violet-500/10 to-transparent',
            borderColor: 'border-violet-500/20'
        },
        {
            label: 'Monthly Revenue',
            value: `$${stats.revenue.toLocaleString()}`,
            subValue: 'MRR',
            icon: DollarSign,
            color: 'text-emerald-400',
            gradient: 'from-emerald-500/10 to-transparent',
            borderColor: 'border-emerald-500/20'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statItems.map((item) => (
                <Card
                    key={item.label}
                    variant="glass"
                    className={cn(
                        "relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                        "border-white/5",
                        item.borderColor
                    )}
                >
                    <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", item.gradient)} />

                    <div className="relative p-5 z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn("p-2 rounded-lg bg-white/5", item.color)}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            {/* <span className="flex items-center text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                +12% <ArrowUpRight className="w-3 h-3 ml-0.5" />
                            </span> */}
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold text-white">{item.value}</h3>
                            <div className="flex justify-between items-center">
                                <p className="text-xs text-gray-400">{item.label}</p>
                                <p className="text-[10px] text-gray-300 font-mono opacity-60">{item.subValue}</p>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
