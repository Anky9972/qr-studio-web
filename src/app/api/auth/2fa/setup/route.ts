import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// Generate a base32 secret for TOTP
function generateSecret(): string {
    const buffer = crypto.randomBytes(20);
    const base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < buffer.length; i++) {
        secret += base32chars[buffer[i] % 32];
    }
    return secret;
}

// Generate TOTP URI for QR code
function generateTotpUri(secret: string, email: string): string {
    const issuer = 'QRStudio';
    return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(email)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
}

// GET - Get 2FA status
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { twoFactorEnabled: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ enabled: user.twoFactorEnabled });
    } catch (error) {
        console.error('Error getting 2FA status:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Setup 2FA (generate secret)
export async function POST() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true, email: true, twoFactorEnabled: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.twoFactorEnabled) {
            return NextResponse.json(
                { error: '2FA is already enabled' },
                { status: 400 }
            );
        }

        // Generate new secret
        const secret = generateSecret();
        const totpUri = generateTotpUri(secret, user.email || '');

        // Store secret (not enabled yet until verification)
        await prisma.user.update({
            where: { id: user.id },
            data: { twoFactorSecret: secret },
        });

        return NextResponse.json({
            secret,
            totpUri,
            message: 'Scan the QR code with your authenticator app, then verify with a code',
        });
    } catch (error) {
        console.error('Error setting up 2FA:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Disable 2FA
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { code } = body;

        if (!code) {
            return NextResponse.json({ error: 'Verification code required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true, twoFactorEnabled: true, twoFactorSecret: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (!user.twoFactorEnabled) {
            return NextResponse.json({ error: '2FA is not enabled' }, { status: 400 });
        }

        // Verify the code before disabling
        const isValid = verifyTotp(user.twoFactorSecret || '', code);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
        }

        // Disable 2FA
        await prisma.user.update({
            where: { id: user.id },
            data: {
                twoFactorEnabled: false,
                twoFactorSecret: null,
            },
        });

        return NextResponse.json({ message: '2FA disabled successfully' });
    } catch (error) {
        console.error('Error disabling 2FA:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Simple TOTP verification
function verifyTotp(secret: string, code: string): boolean {
    if (!secret || !code || code.length !== 6) {
        return false;
    }

    try {
        const counter = Math.floor(Date.now() / 30000);

        // Check current and adjacent time windows
        for (let i = -1; i <= 1; i++) {
            const expectedCode = generateTotp(secret, counter + i);
            if (expectedCode === code) {
                return true;
            }
        }
        return false;
    } catch {
        return false;
    }
}

function generateTotp(secret: string, counter: number): string {
    // Decode base32 secret
    const base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';
    for (const char of secret.toUpperCase()) {
        const val = base32chars.indexOf(char);
        if (val === -1) continue;
        bits += val.toString(2).padStart(5, '0');
    }

    const bytes = [];
    for (let i = 0; i < bits.length; i += 8) {
        bytes.push(parseInt(bits.substr(i, 8), 2));
    }
    const key = Buffer.from(bytes);

    // Create HMAC
    const counterBuffer = Buffer.alloc(8);
    counterBuffer.writeBigInt64BE(BigInt(counter));

    const hmac = crypto.createHmac('sha1', key);
    hmac.update(counterBuffer);
    const hash = hmac.digest();

    // Dynamic truncation
    const offset = hash[hash.length - 1] & 0x0f;
    const binary =
        ((hash[offset] & 0x7f) << 24) |
        ((hash[offset + 1] & 0xff) << 16) |
        ((hash[offset + 2] & 0xff) << 8) |
        (hash[offset + 3] & 0xff);

    const otp = binary % 1000000;
    return otp.toString().padStart(6, '0');
}
