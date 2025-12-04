'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertTitle, IconButton, Collapse } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  active: boolean;
}

export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements');
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data.announcements);
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    }
  };

  const handleDismiss = (id: string) => {
    setDismissed(new Set(dismissed).add(id));
    // Store in localStorage to persist dismissals
    const stored = localStorage.getItem('dismissed-announcements');
    const dismissedIds = stored ? JSON.parse(stored) : [];
    dismissedIds.push(id);
    localStorage.setItem('dismissed-announcements', JSON.stringify(dismissedIds));
  };

  // Filter out dismissed announcements
  const visibleAnnouncements = announcements.filter(
    (a) => a.active && !dismissed.has(a.id)
  );

  if (visibleAnnouncements.length === 0) {
    return null;
  }

  return (
    <>
      {visibleAnnouncements.map((announcement) => (
        <Collapse key={announcement.id} in={!dismissed.has(announcement.id)}>
          <Alert
            severity={announcement.type}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => handleDismiss(announcement.id)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            <AlertTitle>{announcement.title}</AlertTitle>
            {announcement.message}
          </Alert>
        </Collapse>
      ))}
    </>
  );
}
