'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Search, Filter, ChevronLeft, ChevronRight, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { UserTable } from '../components/UserTable';
import { Card } from '@/components/ui/Card';

export default function UsersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
    });

    const [filters, setFilters] = useState({
        search: '',
        plan: 'all',
        status: 'all'
    });

    // Debounce search
    const [debouncedSearch, setDebouncedSearch] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(filters.search), 500);
        return () => clearTimeout(timer);
    }, [filters.search]);

    useEffect(() => {
        fetchUsers();
    }, [pagination.page, debouncedSearch, filters.plan, filters.status]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                search: debouncedSearch,
                plan: filters.plan,
                status: filters.status
            });

            const res = await fetch(`/api/admin/users?${queryParams}`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 on filter change
    };

    if (status === 'loading') { // Basic loading state
        return <div className="h-screen flex items-center justify-center text-electric-cyan">Loading...</div>;
    }

    if (!session || !(session.user as any).isAdmin) {
        return null;
    }

    return (
        <div className="space-y-8 pb-8 p-6 lg:p-10 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 rounded-full bg-electric-violet/10 text-electric-violet text-xs font-bold border border-electric-violet/20 flex items-center gap-1">
                            <Shield className="w-3 h-3" /> USER MANAGEMENT
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold font-display text-white">Users & Team</h1>
                    <p className="text-gray-400 mt-1">Manage platform users, subscriptions, and access.</p>
                </motion.div>

                <Button variant="glow">
                    <UserPlus className="w-4 h-4 mr-2" /> Add User
                </Button>
            </div>

            {/* Filters Card */}
            <Card variant="glass" className="p-4 border-white/5">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                            placeholder="Search by name or email..."
                            className="pl-10 bg-black/50 border-white/10"
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                    </div>

                    <div className="w-full lg:w-48">
                        <Select value={filters.plan} onValueChange={(val) => handleFilterChange('plan', val)}>
                            <SelectTrigger className="bg-black/50 border-white/10">
                                <SelectValue placeholder="All Plans" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Plans</SelectItem>
                                <SelectItem value="free">Free</SelectItem>
                                <SelectItem value="pro">Pro</SelectItem>
                                <SelectItem value="business">Business</SelectItem>
                                <SelectItem value="enterprise">Enterprise</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="w-full lg:w-48">
                        <Select value={filters.status} onValueChange={(val) => handleFilterChange('status', val)}>
                            <SelectTrigger className="bg-black/50 border-white/10">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Card>

            {/* Table Section */}
            <UserTable users={users} loading={loading} onRefresh={fetchUsers} />

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/10 pt-4 gap-4">
                <p className="text-sm text-gray-500">
                    Showing {Math.min(pagination.limit * (pagination.page - 1) + 1, pagination.total)} to {Math.min(pagination.limit * pagination.page, pagination.total)} of {pagination.total} users
                </p>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.page <= 1}
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    >
                        <ChevronLeft className="w-4 h-4" /> Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.page >= pagination.totalPages}
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    >
                        Next <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
