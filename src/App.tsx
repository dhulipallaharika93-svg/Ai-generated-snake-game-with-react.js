import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 font-sans selection:bg-[#00FF41]/30">
      <header className="w-full max-w-6xl mb-8 flex justify-between items-end border-b border-[#333] pb-4">
        <div>
          <h1 className="text-4xl font-display font-black tracking-widest uppercase text-white">
            SYS.TERMINAL <span className="text-[#00FF41] animate-pulse">_</span>
          </h1>
          <p className="text-[#666] font-mono text-xs mt-1 uppercase tracking-widest">
            Module: Snake_Protocol v2.0
          </p>
        </div>
        <div className="hidden md:block text-right">
          <div className="text-[#00FF41] font-mono text-xs animate-pulse">STATUS: ONLINE</div>
          <div className="text-[#666] font-mono text-xs">PORT: 3000</div>
        </div>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex justify-center lg:justify-start">
          <SnakeGame />
        </div>
        <div className="lg:col-span-4 flex flex-col gap-6">
          <MusicPlayer />
          
          {/* Decorative Hardware Module */}
          <div className="hardware-panel p-6 flex flex-col gap-4">
            <div className="text-[#666] font-mono text-[10px] uppercase tracking-widest border-b border-[#222] pb-2">
              System Diagnostics
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[#444] font-mono text-[10px]">CPU LOAD</div>
                <div className="text-white font-mono text-sm">14.2%</div>
              </div>
              <div>
                <div className="text-[#444] font-mono text-[10px]">MEM USAGE</div>
                <div className="text-white font-mono text-sm">1.02 GB</div>
              </div>
              <div>
                <div className="text-[#444] font-mono text-[10px]">UPTIME</div>
                <div className="text-white font-mono text-sm">99.9%</div>
              </div>
              <div>
                <div className="text-[#444] font-mono text-[10px]">NET PING</div>
                <div className="text-[#00FF41] font-mono text-sm">12ms</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
