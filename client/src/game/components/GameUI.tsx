import React from 'react';
import { GameUIProps } from '../types';

const GameUI: React.FC<GameUIProps> = ({ 
  coins, 
  totalCoins, 
  level, 
  era, 
  lives,
  timeRemaining
}) => {
  // Format the time to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Map era to a display name
  const getEraName = (): string => {
    switch (era) {
      case 'old':
        return 'Old Dubai';
      case 'current':
        return 'Modern Dubai';
      case 'future':
        return 'Future Dubai';
      default:
        return 'Dubai';
    }
  };
  
  return (
    <div className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center bg-black/60 text-white z-50">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <svg width="20" height="20" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="16" fill="#FFD700" />
            <text x="20" y="25" textAnchor="middle" fill="#B8860B" fontSize="18" fontWeight="bold">D</text>
          </svg>
          <span className="ml-2 font-bold">{coins} / {totalCoins}</span>
        </div>
        
        <div className="flex items-center">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="red" />
          </svg>
          <span className="ml-2 font-bold">{lives}</span>
        </div>
      </div>
      
      <div className="text-center">
        <h1 className="text-lg font-bold">
          {getEraName()} - Level {level}
        </h1>
      </div>
      
      <div>
        <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
      </div>
    </div>
  );
};

export default GameUI;
