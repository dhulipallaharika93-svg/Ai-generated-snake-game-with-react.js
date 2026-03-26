import { useEffect, useRef, useState } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20; // 400x400 canvas
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;
const TICK_RATE = 100; // ms per move

type Particle = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string };

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStateStr, setGameStateStr] = useState<'IDLE' | 'PLAYING' | 'GAME_OVER'>('IDLE');
  
  const state = useRef({
    snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
    dir: { x: 0, y: -1 },
    nextDir: { x: 0, y: -1 },
    food: { x: 5, y: 5 },
    score: 0,
    status: 'IDLE' as 'IDLE' | 'PLAYING' | 'GAME_OVER',
    lastTick: 0,
    particles: [] as Particle[],
    shake: 0
  });

  const spawnParticles = (x: number, y: number, color: string) => {
    for (let i = 0; i < 15; i++) {
      state.current.particles.push({
        x: x * CELL_SIZE + CELL_SIZE / 2,
        y: y * CELL_SIZE + CELL_SIZE / 2,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1,
        maxLife: 20 + Math.random() * 20,
        color
      });
    }
  };

  const resetGame = () => {
    state.current.snake = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
    state.current.dir = { x: 0, y: -1 };
    state.current.nextDir = { x: 0, y: -1 };
    state.current.food = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
    state.current.score = 0;
    state.current.status = 'PLAYING';
    state.current.particles = [];
    state.current.shake = 0;
    setScore(0);
    setGameStateStr('PLAYING');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && state.current.status !== 'PLAYING') {
        resetGame();
        return;
      }

      const { dir, nextDir } = state.current;
      const currentDir = nextDir; 

      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W':
          if (currentDir.y !== 1) state.current.nextDir = { x: 0, y: -1 };
          break;
        case 'ArrowDown': case 's': case 'S':
          if (currentDir.y !== -1) state.current.nextDir = { x: 0, y: 1 };
          break;
        case 'ArrowLeft': case 'a': case 'A':
          if (currentDir.x !== 1) state.current.nextDir = { x: -1, y: 0 };
          break;
        case 'ArrowRight': case 'd': case 'D':
          if (currentDir.x !== -1) state.current.nextDir = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = (time: number) => {
      const s = state.current;

      // Logic Tick
      if (s.status === 'PLAYING' && time - s.lastTick > TICK_RATE) {
        s.dir = s.nextDir;
        const head = s.snake[0];
        const newHead = { x: head.x + s.dir.x, y: head.y + s.dir.y };

        // Wall Collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          s.status = 'GAME_OVER';
          s.shake = 20;
          spawnParticles(head.x, head.y, '#FF003C');
          setGameStateStr('GAME_OVER');
          setHighScore(prev => Math.max(prev, s.score));
        } 
        // Self Collision
        else if (s.snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
          s.status = 'GAME_OVER';
          s.shake = 20;
          spawnParticles(head.x, head.y, '#FF003C');
          setGameStateStr('GAME_OVER');
          setHighScore(prev => Math.max(prev, s.score));
        } 
        else {
          s.snake.unshift(newHead);
          // Food Collision
          if (newHead.x === s.food.x && newHead.y === s.food.y) {
            s.score += 10;
            setScore(s.score);
            spawnParticles(s.food.x, s.food.y, '#00FF41');
            // Spawn new food
            let newFood;
            while (true) {
              newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
              // eslint-disable-next-line no-loop-func
              if (!s.snake.some(seg => seg.x === newFood.x && seg.y === newFood.y)) break;
            }
            s.food = newFood;
          } else {
            s.snake.pop();
          }
        }
        s.lastTick = time;
      }

      // Draw
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Grid lines
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 1;
      for (let i = 0; i <= CANVAS_SIZE; i += CELL_SIZE) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, CANVAS_SIZE); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(CANVAS_SIZE, i); ctx.stroke();
      }

      ctx.save();
      if (s.shake > 0) {
        const dx = (Math.random() - 0.5) * s.shake;
        const dy = (Math.random() - 0.5) * s.shake;
        ctx.translate(dx, dy);
        s.shake *= 0.9;
        if (s.shake < 0.5) s.shake = 0;
      }

      // Draw Food
      if (s.status !== 'IDLE') {
        ctx.fillStyle = '#FF003C';
        ctx.shadowColor = '#FF003C';
        ctx.shadowBlur = 15;
        ctx.fillRect(s.food.x * CELL_SIZE + 2, s.food.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        ctx.shadowBlur = 0;
      }

      // Draw Snake
      s.snake.forEach((seg, i) => {
        ctx.fillStyle = i === 0 ? '#FFFFFF' : '#00FF41';
        if (i === 0) {
          ctx.shadowColor = '#00FF41';
          ctx.shadowBlur = 10;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fillRect(seg.x * CELL_SIZE + 1, seg.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
      });
      ctx.shadowBlur = 0;

      // Draw Particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        if (p.life >= p.maxLife) {
          s.particles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 1 - (p.life / p.maxLife);
        ctx.fillRect(p.x, p.y, 3, 3);
        ctx.globalAlpha = 1;
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="hardware-panel p-6 w-full max-w-[450px]">
      <div className="flex justify-between items-end mb-4 border-b border-[#222] pb-2">
        <div>
          <div className="text-[#666] font-mono text-[10px] uppercase tracking-widest">Score</div>
          <div className="text-[#00FF41] font-mono text-2xl leading-none">{score.toString().padStart(4, '0')}</div>
        </div>
        <div className="text-right">
          <div className="text-[#666] font-mono text-[10px] uppercase tracking-widest">High Score</div>
          <div className="text-white font-mono text-xl leading-none">{highScore.toString().padStart(4, '0')}</div>
        </div>
      </div>

      <div className="relative w-full aspect-square bg-[#050505] rounded border border-[#333] overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,1)]">
        <canvas 
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="w-full h-full block"
        />
        
        {/* Scanline overlay */}
        <div className="absolute inset-0 scanline pointer-events-none opacity-30"></div>

        {gameStateStr !== 'PLAYING' && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <div className="text-white font-display font-black text-3xl tracking-widest mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              {gameStateStr === 'GAME_OVER' ? 'SYSTEM FAILURE' : 'READY'}
            </div>
            <button 
              onClick={resetGame}
              className="bg-[#00FF41] text-black font-display font-bold px-8 py-3 rounded hover:bg-white transition-colors uppercase tracking-widest text-sm shadow-[0_0_15px_rgba(0,255,65,0.4)]"
            >
              {gameStateStr === 'GAME_OVER' ? 'Reboot' : 'Initialize'}
            </button>
            <div className="text-[#666] font-mono text-[10px] mt-6 uppercase tracking-widest text-center">
              Controls: W A S D / Arrows<br/>
              Space to Start
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
