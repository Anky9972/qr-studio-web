'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import WelcomeBackBanner from '@/components/WelcomeBackBanner';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminStats } from './components/AdminStats';
import { AnnouncementsTab } from './components/AnnouncementsTab';
import { OffersTab } from './components/OffersTab';
import { EmailCampaignsTab } from './components/EmailCampaignsTab';
import { Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Data States
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalQRCodes: 0,
    totalScans: 0,
    revenue: 0,
  });

  // Dialog States
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  // Forms
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    message: '',
    type: 'info',
    active: true,
    targetAudience: 'all',
    sendEmail: false,
    sendWebNotification: true,
  });

  const [offerForm, setOfferForm] = useState({
    title: '',
    description: '',
    discountPercent: 0,
    couponCode: '',
    validFrom: '',
    validUntil: '',
    targetPlan: 'all',
    active: true,
  });

  const [emailForm, setEmailForm] = useState({
    subject: '',
    body: '',
    recipients: 'all',
    sendAt: '',
  });

  // Check authentication and admin status
  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/signin?callbackUrl=/admin');
      return;
    }

    if (session?.user && !(session.user as any).isAdmin) {
      router.push('/dashboard');
      return;
    }
  }, [status, session, router]);

  useEffect(() => {
    // Only fetch data if we have a session and user is admin
    if (status === 'authenticated' && (session?.user as any)?.isAdmin) {
      fetchAdminData();
    }
  }, [status, session]);

  const fetchAdminData = async () => {
    try {
      // Fetch admin statistics
      const statsResponse = await fetch('/api/admin/stats');
      if (statsResponse.ok) {
        const data = await statsResponse.json();
        setStats(data);
      } else {
        console.error('Failed to fetch stats:', statsResponse.status, statsResponse.statusText);
      }

      // Fetch announcements
      const announcementsResponse = await fetch('/api/admin/announcements');
      if (announcementsResponse.ok) {
        const data = await announcementsResponse.json();
        setAnnouncements(data.announcements);
      } else {
        console.error('Failed to fetch announcements:', announcementsResponse.status, announcementsResponse.statusText);
        const errorData = await announcementsResponse.json().catch(() => ({}));
        console.error('Error details:', errorData);
      }

      // Fetch offers
      const offersResponse = await fetch('/api/admin/offers');
      if (offersResponse.ok) {
        const data = await offersResponse.json();
        setOffers(data.offers);
      } else {
        console.error('Failed to fetch offers:', offersResponse.status, offersResponse.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    }
  };

  const handleCreateAnnouncement = async () => {
    try {
      const response = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcementForm),
      });

      if (response.ok) {
        setAnnouncementDialogOpen(false);
        setAnnouncementForm({
          title: '',
          message: '',
          type: 'info',
          active: true,
          targetAudience: 'all',
          sendEmail: false,
          sendWebNotification: true,
        });
        fetchAdminData();
      }
    } catch (error) {
      console.error('Failed to create announcement:', error);
    }
  };

  const handleCreateOffer = async () => {
    try {
      const response = await fetch('/api/admin/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offerForm),
      });

      if (response.ok) {
        setOfferDialogOpen(false);
        setOfferForm({
          title: '',
          description: '',
          discountPercent: 0,
          couponCode: '',
          validFrom: '',
          validUntil: '',
          targetPlan: 'all',
          active: true,
          // Reset other fields as needed
        });
        fetchAdminData();
      }
    } catch (error) {
      console.error('Failed to create offer:', error);
    }
  };

  const handleSendEmail = async () => {
    if (!confirm('Are you sure you want to send this email to all selected recipients?')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailForm),
      });

      if (response.ok) {
        alert('Email sent successfully!');
        setEmailDialogOpen(false);
        setEmailForm({
          subject: '',
          body: '',
          recipients: 'all',
          sendAt: '',
        });
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send email');
    }
  };

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-electric-cyan" />
      </div>
    );
  }

  // Show nothing while redirecting
  if (!session || !(session.user as any).isAdmin) {
    return null;
  }

  return (
    <div className="space-y-8 pb-8 p-6 lg:p-10 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20 flex items-center gap-1">
              <Shield className="w-3 h-3" /> ADMIN AREA
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display text-white">
            System Administration
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Manage announcements, offers, and communication campaigns.
          </p>
        </motion.div>

        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white" onClick={() => router.push('/admin/users')}>
            Manage Users
          </Button>
        </div>
      </div>

      <AdminStats stats={stats} />

      <Tabs defaultValue="announcements" className="space-y-6">
        <TabsList className="bg-black/20 p-1 border border-white/10 rounded-xl w-full sm:w-auto flex-wrap sm:flex-nowrap h-auto sm:h-12">
          <TabsTrigger value="announcements" className="flex-1 sm:flex-none">Announcements</TabsTrigger>
          <TabsTrigger value="offers" className="flex-1 sm:flex-none">Offers & Deals</TabsTrigger>
          <TabsTrigger value="emails" className="flex-1 sm:flex-none">Email Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="space-y-4 focus-visible:outline-none">
          <AnnouncementsTab
            announcements={announcements}
            onCreate={() => setAnnouncementDialogOpen(true)}
            form={announcementForm}
            setForm={setAnnouncementForm}
            dialogOpen={announcementDialogOpen}
            setDialogOpen={setAnnouncementDialogOpen}
            handleCreate={handleCreateAnnouncement}
            onRefresh={fetchAdminData}
          />
        </TabsContent>

        <TabsContent value="offers" className="space-y-4 focus-visible:outline-none">
          <OffersTab
            offers={offers}
            onCreate={() => setOfferDialogOpen(true)}
            form={offerForm}
            setForm={setOfferForm}
            dialogOpen={offerDialogOpen}
            setDialogOpen={setOfferDialogOpen}
            handleCreate={handleCreateOffer}
            onRefresh={fetchAdminData}
          />
        </TabsContent>

        <TabsContent value="emails" className="space-y-4 focus-visible:outline-none">
          <EmailCampaignsTab
            form={emailForm}
            setForm={setEmailForm}
            dialogOpen={emailDialogOpen}
            setDialogOpen={setEmailDialogOpen}
            handleSend={handleSendEmail}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
