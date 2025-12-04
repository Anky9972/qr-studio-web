import { NextRequest, NextResponse } from 'next/server';
import { runScheduledTask } from '@/lib/cron-jobs';

// Cron API endpoint
// Protect this with API key or Vercel Cron secret
export async function POST(request: NextRequest) {
  try {
    // Verify authorization (use environment variable for cron secret)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'change-this-in-production';

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { task } = body;

    if (!task) {
      return NextResponse.json({ error: 'Task name required' }, { status: 400 });
    }

    // Run the scheduled task
    await runScheduledTask(task);

    return NextResponse.json({
      success: true,
      message: `Task ${task} completed successfully`,
    });
  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to run scheduled task' },
      { status: 500 }
    );
  }
}

// GET endpoint for health check
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    message: 'Cron API is running',
    availableTasks: [
      'expiring-qrcodes',
      'archive-expired',
      'check-limits',
      'verify-domains',
      'weekly-reports',
      'cleanup-scans',
      'cleanup-logs',
      'all-hourly',
      'all-daily',
      'all-weekly',
    ],
  });
}
