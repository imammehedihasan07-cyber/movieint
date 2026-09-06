export default function Loading() {
  return (
    <div className="min-h-[75vh] w-full flex flex-col items-center justify-center bg-[#05070b] text-slate-100 px-4 relative overflow-hidden select-none">
      {/* Background Ambient Pulses */}
      <div className="absolute w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute w-52 h-52 bg-rose-600/10 rounded-full blur-2xl opacity-20 pointer-events-none" />

      {/* Cyber Cinematic Core Loader */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Outer Rotating Film Track */}
        <div className="w-24 h-24 rounded-full border-2 border-dashed border-indigo-500/30 animate-[spin_8s_linear_infinite]" />

        {/* Counter-rotating Target Ring */}
        <div className="absolute w-16 h-16 rounded-full border border-t-rose-500 border-r-transparent border-b-indigo-500 border-l-transparent animate-[spin_2s_linear_infinite_reverse]" />

        {/* Central Glowing Core */}
        <div className="absolute w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 shadow-lg shadow-indigo-500/50 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white animate-ping" />
        </div>
      </div>

      {/* Live Status Telemetry */}
      <div className="flex flex-col items-center gap-2 text-center z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono uppercase tracking-[0.25em] text-indigo-400">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
          Synchronizing Reel Telemetry
        </div>

        <h3 className="text-sm font-bold tracking-wider text-slate-300 uppercase font-mono">
          Decoding Narrative Matrix...
        </h3>

        {/* Pacing Progress Bar */}
        <div className="w-48 h-1 bg-slate-900 rounded-full overflow-hidden mt-2 border border-white/5 relative">
          <div className="h-full bg-gradient-to-r from-rose-500 via-indigo-500 to-rose-500 w-1/2 rounded-full animate-pulse mx-auto" />
        </div>
      </div>
    </div>
  );
}
