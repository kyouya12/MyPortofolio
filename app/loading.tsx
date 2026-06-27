export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center space-y-4 select-none">
      {/* Sleek spinning glowing brand color loader */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-white/5" />
        <div className="absolute inset-0 rounded-full border-4 border-brand border-t-transparent animate-spin shadow-[0_0_15px_rgba(140,255,0,0.3)]" />
      </div>
      <p className="text-text-secondary text-sm font-semibold tracking-widest uppercase animate-pulse">
        Loading...
      </p>
    </div>
  );
}
