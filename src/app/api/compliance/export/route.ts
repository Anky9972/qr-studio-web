import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import JSZip from 'jszip';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      include: {
        qrCodes: true,
        campaigns: true,
        templates: true,
        apiKeys: true,
        webhooks: true,
        auditLogs: true,
        complianceSettings: true,
      } as any,
    }) as any;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create ZIP file with all user data
    const zip = new JSZip();

    // User profile
    zip.file('user_profile.json', JSON.stringify(user, null, 2));

    // QR Codes
    zip.file('qr_codes.json', JSON.stringify(user.qrCodes, null, 2));

    // Campaigns
    zip.file('campaigns.json', JSON.stringify(user.campaigns, null, 2));

    // Templates
    zip.file('templates.json', JSON.stringify(user.templates, null, 2));

    // API Keys (redacted)
    const redactedKeys = user.apiKeys.map((key: any) => ({
      ...key,
      key: '***REDACTED***',
    }));
    zip.file('api_keys.json', JSON.stringify(redactedKeys, null, 2));

    // Webhooks
    zip.file('webhooks.json', JSON.stringify(user.webhooks, null, 2));

    // Audit Logs
    zip.file('audit_logs.json', JSON.stringify(user.auditLogs, null, 2));

    // Compliance Settings
    zip.file('compliance_settings.json', JSON.stringify(user.complianceSettings, null, 2));

    // README
    const readme = `
QR Studio Data Export
======================

This archive contains all your personal data from QR Studio.

Files Included:
- user_profile.json: Your user account information
- qr_codes.json: All QR codes you've created
- campaigns.json: Your campaigns
- templates.json: Your saved templates
- api_keys.json: Your API keys (redacted for security)
- webhooks.json: Your webhook configurations
- audit_logs.json: Activity logs
- compliance_settings.json: Your privacy settings

Export Date: ${new Date().toISOString()}

If you have any questions, please contact support@qrstudio.com
    `.trim();

    zip.file('README.txt', readme);

    // Generate ZIP
    const zipBlob = await zip.generateAsync({ type: 'nodebuffer' });

    // Log the export
    await (prisma as any).auditLog.create({
      data: {
        userId: user.id,
        action: 'EXPORT',
        entityType: 'UserData',
        details: {
          exportDate: new Date().toISOString(),
          filesIncluded: [
            'user_profile.json',
            'qr_codes.json',
            'campaigns.json',
            'templates.json',
            'api_keys.json',
            'webhooks.json',
            'audit_logs.json',
            'compliance_settings.json',
          ],
        },
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      },
    });

    // Return ZIP file (zipBlob is already a Buffer)
    return new NextResponse(zipBlob as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="qr-studio-data-export-${new Date().toISOString().split('T')[0]}.zip"`,
      },
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
