import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Environment
  environment: process.env.NODE_ENV || 'development',

  // Additional configuration
  beforeSend(event, hint) {
    // Add user context if available
    if (event.user) {
      // Remove sensitive data
      delete event.user.email;
      delete event.user.ip_address;
    }
    return event;
  },

  // Ignore specific errors
  ignoreErrors: [
    'ECONNRESET',
    'ENOTFOUND',
    'ETIMEDOUT',
    'Network request failed',
  ],
});
