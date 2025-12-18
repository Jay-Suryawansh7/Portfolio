export default function Loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        <p className="text-cyan-500 font-mono text-sm animate-pulse">Initializing...</p>
      </div>
    </div>
  );
}
