import React, { useEffect, useRef, useState } from 'react';
import { CoinProps } from '../types';

const Coin: React.FC<CoinProps> = ({ coin, collected }) => {
  const coinRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(0);
  
  // Floating animation for the coin
  useEffect(() => {
    const interval = setInterval(() => {
      setHover(prev => (prev + 1) % 100);
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  const floatOffset = Math.sin(hover / 15) * 5;
  
  if (collected) return null;
  
  return (
    <div
      ref={coinRef}
      className="absolute transition-transform"
      style={{
        left: coin.x,
        top: coin.y + floatOffset,
        width: coin.size,
        height: coin.size,
        zIndex: 90,
      }}
    >
      <svg width={coin.size} height={coin.size} viewBox="0 0 40 40">
        {/* Gold coin with shine effect */}
        <circle cx="20" cy="20" r="16" fill="#FFD700" />
        <circle cx="20" cy="20" r="14" fill="#FFDF00" />
        <ellipse cx="14" cy="14" rx="6" ry="6" fill="#FFFACD" opacity="0.6" /> {/* Shine */}
        <text x="20" y="25" textAnchor="middle" fill="#B8860B" fontSize="18" fontWeight="bold">D</text>
      </svg>
    </div>
  );
};

export default React.memo(Coin);
