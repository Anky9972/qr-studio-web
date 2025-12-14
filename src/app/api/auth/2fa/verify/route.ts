import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// POST - Verify 2FA code and enable 2FA
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { code } = body;

        if (!code || code.length !== 6) {
            return NextResponse.json(
                { error: 'Invalid verification code format' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true, twoFactorSecret: true, twoFactorEnabled: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (!user.twoFactorSecret) {
            return NextResponse.json(
                { error: 'Please setup 2FA first' },
                { status: 400 }
            );
        }

        // Verify the TOTP code
        const isValid = verifyTotp(user.twoFactorSecret, code);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid verification code' },
                { status: 400 }
            );
        }

        // Enable 2FA
        await prisma.user.update({
            where: { id: user.id },
            data: { twoFactorEnabled: true },
        });

        return NextResponse.json({
            message: '2FA enabled successfully',
            enabled: true,
        });
    } catch (error) {
        console.error('Error verifying 2FA:', error);
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

        // Check current and adjacent time windows for clock skew tolerance
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

    // Dynamic truncation per RFC 6238
    const offset = hash[hash.length - 1] & 0x0f;
    const binary =
        ((hash[offset] & 0x7f) << 24) |
        ((hash[offset + 1] & 0xff) << 16) |
        ((hash[offset + 2] & 0xff) << 8) |
        (hash[offset + 3] & 0xff);

    const otp = binary % 1000000;
    return otp.toString().padStart(6, '0');
}
