import * as Sentry from '@sentry/nextjs';

/**
 * Initialize Sentry for monitoring errors and performance
 */
export function initMonitoring() {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.warn('Sentry DSN not configured. Error monitoring disabled.');
    return;
  }

  console.log('Sentry monitoring initialized');
}

/**
 * Capture an exception with Sentry
 */
export function captureException(error: Error, context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error, context);
  }
  
  Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Capture a message with Sentry
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info', context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${level}] ${message}`, context);
  }
  
  Sentry.captureMessage(message, {
    level,
    extra: context,
  });
}

/**
 * Set user context for error tracking
 */
export function setUserContext(user: {
  id: string;
  email?: string;
  username?: string;
  plan?: string;
}) {
  Sentry.setUser({
    id: user.id,
    username: user.username || user.email,
    plan: user.plan,
  });
}

/**
 * Clear user context (on logout)
 */
export function clearUserContext() {
  Sentry.setUser(null);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(message: string, category: string, data?: Record<string, any>) {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: 'info',
  });
}

/**
 * Start a span for performance monitoring
 */
export function startSpan(name: string, op: string) {
  return Sentry.startSpan({
    name,
    op,
  }, (span) => span);
}

/**
 * Track API performance
 */
export async function trackApiCall<T>(
  endpoint: string,
  fn: () => Promise<T>
): Promise<T> {
  return await Sentry.startSpan(
    {
      name: endpoint,
      op: 'http.client',
    },
    async () => {
      try {
        return await fn();
      } catch (error) {
        captureException(error as Error, { endpoint });
        throw error;
      }
    }
  );
}

/**
 * Custom error boundary logger
 */
export function logErrorBoundary(error: Error, errorInfo: React.ErrorInfo) {
  Sentry.withScope((scope) => {
    scope.setContext('errorBoundary', {
      componentStack: errorInfo.componentStack,
    });
    captureException(error);
  });
}

/**
 * Track custom metrics
 */
export function trackMetric(name: string, value: number, unit?: string) {
  Sentry.metrics.distribution(name, value, {
    unit: unit || 'none',
  });
}
