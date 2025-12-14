import 'next-auth';
import { DefaultSession, DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id?: string;
            role?: string;
            plan?: string;
            isAdmin?: boolean;
            subscription?: string;
        } & DefaultSession['user'];
        accessToken?: string;
        refreshToken?: string;
        expiresAt?: number;
    }

    interface User extends DefaultUser {
        id: string;
        role?: string;
        plan?: string;
        isAdmin?: boolean;
        subscription?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
        id?: string;
        role?: string;
        plan?: string;
        isAdmin?: boolean;
        subscription?: string;
        accessToken?: string;
        refreshToken?: string;
        expiresAt?: number;
    }
}
