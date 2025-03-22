import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LevelCompleteProps } from '../types';
import { useAudio } from '../../lib/stores/useAudio';
import { Button } from '../../components/ui/button';

const LevelComplete: React.FC<LevelCompleteProps> = ({ 
  era, 
  levelId,
  coinsCollected,
  totalCoins,
  fact,
  nextLevel
}) => {
  const navigate = useNavigate();
  const { playSuccess } = useAudio();
  
  // Play success sound when component mounts
  useEffect(() => {
    playSuccess();
  }, [playSuccess]);
  
  const handleNextLevel = () => {
    // We need to properly reset the game state before navigating
    if (nextLevel) {
      // Force a complete component unmount by going to a temporary route first
      navigate('/level-select', { replace: true });
      
      // Then after a short delay, navigate to the next level
      setTimeout(() => {
        navigate(nextLevel);
      }, 200);
    } else {
      // If no next level, go back to level select
      navigate('/level-select');
    }
  };
  
  const handleLevelSelect = () => {
    navigate('/level-select');
  };
  
  const getEraTitle = (): string => {
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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-bold text-center mb-2">Level Complete!</h2>
        <h3 className="text-xl text-center mb-6">{getEraTitle()} - Level {levelId}</h3>
        
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <div className="mb-4 text-center">
            <span className="text-lg">
              Coins: <strong>{coinsCollected}</strong> / {totalCoins}
            </span>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-bold mb-2">Did you know?</h4>
            <div className="max-h-20 overflow-y-auto">
              <p className="text-gray-700">{fact}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button onClick={handleLevelSelect} variant="outline">
            Level Select
          </Button>
          <Button onClick={handleNextLevel}>
            {nextLevel ? 'Next Level' : 'Back to Level Select'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LevelComplete;
