'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useDashboardTheme } from '@/components/providers/DashboardThemeProvider';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function ThemeToggle({ className }: { className?: string }) {
  const { mode, toggleTheme } = useDashboardTheme();

  return (
    <div className={className}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleTheme}
              className={cn(
                "relative w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden transition-all duration-300",
                "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5",
                mode === 'light' ? "hover:text-amber-500" : "hover:text-electric-blue"
              )}
            >
              <AnimatePresence mode="wait">
                {mode === 'light' ? (
                  <motion.div
                    key="light"
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    exit={{ rotate: 180, scale: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute"
                  >
                    <Sun className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="dark"
                    initial={{ rotate: 180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    exit={{ rotate: -180, scale: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute"
                  >
                    <Moon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Switch to {mode === 'light' ? 'dark' : 'light'} mode</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
