'use client';

import { WifiOff, Loader2 } from 'lucide-react';

export function ReconnectBanner() {
  return (
    <div className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-warning/10 border-b border-brand-warning/20 text-brand-warning text-xs font-medium animate-pulse">
      <WifiOff className="w-3.5 h-3.5" />
      Connection lost. Reconnecting...
      <Loader2 className="w-3.5 h-3.5 animate-spin ml-1" />
    </div>
  );
}
