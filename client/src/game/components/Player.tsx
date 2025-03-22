import React, { useEffect, useRef } from 'react';
import { useAudio } from '../../lib/stores/useAudio';
import { Position, PlayerProps } from '../types';

const Player: React.FC<PlayerProps> = ({ 
  position, 
  velocity, 
  size,
  state, 
  onGround,
  direction,
  update
}) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const { playHit } = useAudio();
  const frameRef = useRef(0);
  const lastJumpRef = useRef(0);

  // Helper function to get sprite position based on player state
  const getSpritePosition = (): { x: number, y: number } => {
    // In a real sprite sheet, we'd use something like:
    // const sprites = {
    //   idle: { x: 0, y: 0 },
    //   run: { x: state.frame * 64, y: direction === 'left' ? 64 : 0 },
    //   jump: { x: 128, y: direction === 'left' ? 64 : 0 },
    // };
    // return sprites[state];
    
    // For SVG, we'll just return 0,0
    return { x: 0, y: 0 };
  };

  // Animation frame ticker
  useEffect(() => {
    const interval = setInterval(() => {
      frameRef.current = (frameRef.current + 1) % 8;
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Play sound when jumping
  useEffect(() => {
    const now = Date.now();
    if (state === 'jump' && now - lastJumpRef.current > 300) {
      playHit();
      lastJumpRef.current = now;
    }
  }, [state, playHit]);

  // Update player element position
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.style.transform = `translate(${position.x}px, ${position.y}px) scaleX(${direction === 'left' ? -1 : 1})`;
    }
  }, [position, direction]);

  return (
    <div 
      ref={playerRef}
      className="absolute" 
      style={{ 
        width: size.width,
        height: size.height,
        transform: `translate(${position.x}px, ${position.y}px) scaleX(${direction === 'left' ? -1 : 1})`,
        transition: 'transform 0.05s linear',
        zIndex: 100
      }}
    >
      <svg width={size.width} height={size.height} viewBox="0 0 40 40">
        {/* Emirati Character */}
        
        {/* Kandura (white traditional robe) */}
        <rect x="12" y="15" width="16" height="24" rx="2" fill="#FFFFFF" />
        <rect x="10" y="15" width="20" height="18" rx="2" fill="#FFFFFF" />
        
        {/* Arms in white kandura */}
        <rect x="6" y="16" width="6" height="14" rx="3" fill="#FFFFFF" />
        <rect x="28" y="16" width="6" height="14" rx="3" fill="#FFFFFF" />
        
        {/* Hands (skin tone) */}
        <circle cx="7" cy="30" r="2" fill="#D2986C" />
        <circle cx="33" cy="30" r="2" fill="#D2986C" />
        
        {/* Feet/shoes */}
        <rect x="11" y="37" width="8" height="3" rx="1" fill="#5E4B3C" />
        <rect x="21" y="37" width="8" height="3" rx="1" fill="#5E4B3C" />
        
        {/* Head */}
        <circle cx="20" cy="10" r="6" fill="#D2986C" />
        
        {/* Ghutrah (white headdress) */}
        <path d="M 14 5 Q 20 2 26 5 L 26 12 Q 20 15 14 12 Z" fill="#FFFFFF" />
        
        {/* Agal (black cord around headdress) */}
        <path d="M 14 7 Q 20 4 26 7" stroke="#000000" strokeWidth="1.5" fill="none" />
        <path d="M 14 9 Q 20 6 26 9" stroke="#000000" strokeWidth="1.5" fill="none" />
        
        {/* Face features */}
        <circle cx="18" cy="9" r="1" fill="#000000" /> {/* Left eye */}
        <circle cx="22" cy="9" r="1" fill="#000000" /> {/* Right eye */}
        
        {/* Facial expressions based on state */}
        {state === 'jump' && (
          <path d="M 18 12 Q 20 15 22 12" stroke="#000000" fill="none" strokeWidth="0.8" />
        )}
        {state === 'idle' && (
          <path d="M 18 12 L 22 12" stroke="#000000" strokeWidth="0.8" />
        )}
        {state === 'run' && (
          <path d="M 18 12 Q 20 13 22 12" stroke="#000000" fill="none" strokeWidth="0.8" />
        )}
        
        {/* Shemagh detail (pattern on headdress) - subtle pattern */}
        <line x1="15" y1="5" x2="25" y2="6" stroke="#F5F5F5" strokeWidth="0.5" />
        <line x1="15" y1="7" x2="25" y2="8" stroke="#F5F5F5" strokeWidth="0.5" />
        <line x1="15" y1="9" x2="25" y2="10" stroke="#F5F5F5" strokeWidth="0.5" />
        
        {/* Subtle kandura fold lines */}
        <line x1="16" y1="24" x2="24" y2="24" stroke="#F0F0F0" strokeWidth="0.8" />
        <line x1="16" y1="32" x2="24" y2="32" stroke="#F0F0F0" strokeWidth="0.8" />
        
        {/* Animation effect if running */}
        {state === 'run' && (
          <g>
            <line x1="12" y1="22" x2="12" y2={24 + frameRef.current % 3} stroke="#F0F0F0" strokeWidth="0.5" />
            <line x1="28" y1="22" x2="28" y2={24 + frameRef.current % 3} stroke="#F0F0F0" strokeWidth="0.5" />
          </g>
        )}
        
        {/* Jump effect */}
        {state === 'jump' && (
          <g>
            <path d="M 12 32 Q 14 35 16 33" stroke="#EEEEEE" fill="none" strokeWidth="0.5" />
            <path d="M 24 32 Q 26 35 28 33" stroke="#EEEEEE" fill="none" strokeWidth="0.5" />
          </g>
        )}
      </svg>
    </div>
  );
};

export default Player;
