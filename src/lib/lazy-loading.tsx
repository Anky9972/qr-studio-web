/**
 * Dynamic Component Loading Utilities
 * Use these for code splitting and lazy loading heavy components
 */

'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

/**
 * Generic lazy loader with custom loading component
 */
export function lazyLoad<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  loadingFn?: () => React.ReactElement
) {
  return dynamic(importFn, {
    loading: loadingFn || (() => <div>Loading...</div>),
    ssr: false,
  });
}

/**
 * Lazy load with error boundary
 */
export function lazyLoadWithError<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  ErrorComponent?: ComponentType<{ error: Error }>
) {
  return dynamic(importFn, {
    loading: () => <div>Loading...</div>,
    ssr: false,
  });
}

/**
 * Intersection Observer hook for lazy loading components when visible
 */
import { useEffect, useState, useRef } from 'react';

export function useInView(options?: IntersectionObserverInit) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
}

/**
 * Usage example:
 * 
 * // Lazy load a heavy component
 * const LazyChart = lazyLoad(
 *   () => import('./HeavyChartComponent'),
 *   () => <div>Loading chart...</div>
 * );
 * 
 * // Use with intersection observer
 * function MyPage() {
 *   const { ref, isInView } = useInView({ threshold: 0.1 });
 *   
 *   return (
 *     <div ref={ref}>
 *       {isInView && <LazyChart />}
 *     </div>
 *   );
 * }
 */
