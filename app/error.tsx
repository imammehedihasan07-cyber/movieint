'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application runtime boundary caught error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center backdrop-blur-md shadow-2xl">
        <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Telemetry Sync Error</h2>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          The intelligence stream encountered an unexpected network disruption. You can safely retry or return to the main dashboard.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Retry Connection
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors"
          >
            Back Home
          </Link>
        </div>
      </div>
    </main>
  );
}
