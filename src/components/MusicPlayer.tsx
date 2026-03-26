import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc3 } from 'lucide-react';

const TRACKS = [
  { id: 1, title: "SYS.INIT", artist: "DECKARD", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "VOID_WALKER", artist: "NEUROMANCER", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "GHOST.DATA", artist: "MOTOKO", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false));
      else audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted;
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const playNext = () => { setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length); setIsPlaying(true); };
  const playPrev = () => { setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length); setIsPlaying(true); };

  return (
    <div className="hardware-panel p-6 w-full">
      <audio ref={audioRef} src={currentTrack.url} onEnded={playNext} preload="auto" />
      
      <div className="flex justify-between items-center border-b border-[#222] pb-2 mb-4">
        <div className="text-[#666] font-mono text-[10px] uppercase tracking-widest flex items-center gap-2">
          <Disc3 size={12} className={isPlaying ? "animate-spin text-[#00FF41]" : ""} />
          Audio Deck
        </div>
        <button onClick={() => setIsMuted(!isMuted)} className="text-[#666] hover:text-white transition-colors">
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      </div>

      <div className="lcd-screen p-4 rounded mb-6 relative overflow-hidden">
        <div className="absolute inset-0 scanline pointer-events-none opacity-50"></div>
        <div className="text-[#00FF41] font-mono text-sm truncate">{currentTrack.title}</div>
        <div className="text-[#00FF41]/50 font-mono text-xs truncate mt-1">BY: {currentTrack.artist}</div>
        
        {/* Fake visualizer */}
        <div className="flex items-end gap-1 h-8 mt-4 opacity-80">
          {[...Array(16)].map((_, i) => (
            <div 
              key={i} 
              className="flex-1 bg-[#00FF41] rounded-t-sm transition-all duration-75"
              style={{ 
                height: isPlaying ? `${10 + Math.random() * 90}%` : '4px',
                opacity: isPlaying ? 0.8 : 0.3
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mb-6">
        <button onClick={playPrev} className="flex-1 bg-[#111] border border-[#333] hover:border-[#666] text-white py-3 rounded flex justify-center items-center transition-all active:bg-black">
          <SkipBack size={18} />
        </button>
        <button onClick={togglePlay} className={`flex-[2] border py-3 rounded flex justify-center items-center transition-all active:bg-black ${isPlaying ? 'bg-[#00FF41]/10 border-[#00FF41] text-[#00FF41]' : 'bg-[#111] border-[#333] hover:border-[#666] text-white'}`}>
          {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
        </button>
        <button onClick={playNext} className="flex-1 bg-[#111] border border-[#333] hover:border-[#666] text-white py-3 rounded flex justify-center items-center transition-all active:bg-black">
          <SkipForward size={18} />
        </button>
      </div>

      <div className="space-y-1">
        {TRACKS.map((track, idx) => (
          <div 
            key={track.id}
            onClick={() => { setCurrentTrackIndex(idx); setIsPlaying(true); }}
            className={`cursor-pointer px-3 py-2 rounded text-xs font-mono flex items-center justify-between transition-colors border ${
              idx === currentTrackIndex 
                ? 'bg-[#00FF41]/10 text-[#00FF41] border-[#00FF41]/30' 
                : 'text-[#666] border-transparent hover:bg-[#1a1a1a] hover:text-white'
            }`}
          >
            <span>{String(idx + 1).padStart(2, '0')} {track.title}</span>
            {idx === currentTrackIndex && isPlaying && <span className="text-[10px] animate-pulse">PLAYING</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
