import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LevelSelect from '../scenes/LevelSelect';
import GameLevel from '../scenes/GameLevel';
import { useGame } from '../../lib/stores/useGame';
import { useAudio } from '../../lib/stores/useAudio';

const Game: React.FC = () => {
  const navigate = useNavigate();
  const { phase, restart } = useGame();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const { backgroundMusic, isMuted, toggleMute } = useAudio();

  // Handle first load
  useEffect(() => {
    if (isFirstLoad) {
      restart();
      navigate('/level-select');
      setIsFirstLoad(false);
    }
  }, [isFirstLoad, navigate, restart]);

  // Handle background music
  useEffect(() => {
    if (backgroundMusic) {
      if (!isMuted) {
        backgroundMusic.play().catch(error => {
          console.log("Background music play prevented:", error);
        });
      } else {
        backgroundMusic.pause();
      }
    }

    return () => {
      backgroundMusic?.pause();
    };
  }, [backgroundMusic, isMuted]);

  // Keyboard listener for global controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle mute with 'M' key
      if (e.code === 'KeyM') {
        toggleMute();
      }
      
      // Restart game with 'R' key
      if (e.code === 'KeyR') {
        restart();
        navigate('/level-select');
      }

      // Handle ESC to go back to level select
      if (e.code === 'Escape' && window.location.pathname !== '/level-select') {
        navigate('/level-select');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, restart, toggleMute]);

  return (
    <div className="game-container">
      <Routes>
        <Route path="/level-select" element={<LevelSelect />} />
        <Route path="/play/:era/:levelId" element={<GameLevel />} />
        <Route path="*" element={<LevelSelect />} />
      </Routes>
      
      <div className="game-controls fixed bottom-4 left-4 text-white text-xs bg-black/50 p-2 rounded">
        <p>Controls: Arrow keys/WASD to move, Space to jump</p>
        <p>M: Toggle sound, R: Restart, ESC: Back to menu</p>
      </div>
    </div>
  );
};

export default Game;
