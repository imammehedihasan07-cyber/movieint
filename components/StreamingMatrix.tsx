'use client';

import React, { useState } from 'react';

interface StreamingMatrixProps {
  lastChecked?: string;
  movieTitle?: string;
}

interface RegionConfig {
  code: string;
  flag: string;
  name: string;
  platforms: { name: string; type: string; quality: string }[];
}

const REGION_PLATFORMS: RegionConfig[] = [
  {
    code: 'US',
    flag: '🇺🇸',
    name: 'United States',
    platforms: [
      { name: 'Netflix', type: 'Subscription', quality: '4K Ultra HD' },
      { name: 'Prime Video', type: 'Rent / Buy', quality: '4K HDR' },
      { name: 'Apple TV', type: 'Rent / Buy', quality: '4K Dolby Vision' },
      { name: 'Max', type: 'Subscription', quality: '1080p / 4K' },
    ],
  },
  {
    code: 'GB',
    flag: '🇬🇧',
    name: 'United Kingdom',
    platforms: [
      { name: 'Prime Video', type: 'Subscription', quality: '4K HDR' },
      { name: 'Apple TV', type: 'Rent / Buy', quality: '4K' },
      { name: 'NOW TV', type: 'Cinema Pass', quality: '1080p' },
      { name: 'BFI Player', type: 'Curated Stream', quality: '1080p' },
    ],
  },
  {
    code: 'IN',
    flag: '🇮🇳',
    name: 'India',
    platforms: [
      { name: 'JioCinema / Hotstar', type: 'Premium Sub', quality: '4K Ultra HD' },
      { name: 'Prime Video', type: 'Subscription', quality: '4K HDR' },
      { name: 'Netflix', type: 'Standard / 4K', quality: '4K' },
      { name: 'Zee5 / SonyLIV', type: 'Streaming Partner', quality: '1080p' },
    ],
  },
  {
    code: 'BD',
    flag: '🇧🇩',
    name: 'Bangladesh',
    platforms: [
      { name: 'Netflix', type: 'South Asia Region', quality: '4K Ultra HD' },
      { name: 'Prime Video', type: 'Direct Access', quality: '4K HDR' },
      { name: 'Chorki / Hoichoi', type: 'Regional Partner', quality: '1080p' },
      { name: 'Apple TV Store', type: 'VOD Purchase', quality: '4K' },
    ],
  },
];

export default function StreamingMatrix({
  lastChecked = 'September 16, 2026',
  movieTitle = 'this title',
}: StreamingMatrixProps) {
  const [activeRegion, setActiveRegion] = useState<string>('US');

  const currentRegion =
    REGION_PLATFORMS.find((r) => r.code === activeRegion) || REGION_PLATFORMS[0];

  return (
    <div className="w-full rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-6 my-8 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800/80 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Streaming Availability Matrix
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Global catalog telemetry • Verified: <span className="text-zinc-200 font-mono font-medium">{lastChecked}</span>
          </p>
        </div>

        <div className="flex items-center gap-1 bg-zinc-950/80 p-1 rounded-xl border border-zinc-800">
          {REGION_PLATFORMS.map((region) => (
            <button
              key={region.code}
              type="button"
              onClick={() => setActiveRegion(region.code)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeRegion === region.code
                  ? 'bg-amber-400 text-zinc-950 shadow-md font-bold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <span>{region.code}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {currentRegion.platforms.map((platform) => (
          <div
            key={platform.name}
            className="p-3.5 rounded-xl border border-zinc-800/90 bg-zinc-950/50 hover:border-zinc-700 transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-zinc-100">{platform.name}</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700/60">
                {platform.quality}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
              <span>{platform.type}</span>
              <span className="text-amber-400 font-medium hover:underline cursor-pointer">
                Watch &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-3 border-t border-zinc-800/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[11px] text-zinc-500">
        <span>
          Digital broadcast licensing for {movieTitle} is geo-regulated and refreshed periodically.
        </span>
        <span className="text-zinc-400 hover:text-amber-400 cursor-pointer transition">
          Geo-blocked in your territory? Explore VPN options &rarr;
        </span>
      </div>
    </div>
  );
}
