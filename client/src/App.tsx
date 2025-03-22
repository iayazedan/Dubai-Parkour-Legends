import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Game from './game/components/Game';
import { useAudio } from './lib/stores/useAudio';

function App() {
  // Initialize audio elements once the app loads
  useEffect(() => {
    // Initialize background music
    const bgMusic = new Audio('/sounds/background.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    
    // Initialize sound effects
    const hitSound = new Audio('/sounds/hit.mp3');
    const successSound = new Audio('/sounds/success.mp3');
    
    // Store audio elements in global state
    const audioStore = useAudio.getState();
    audioStore.setBackgroundMusic(bgMusic);
    audioStore.setHitSound(hitSound);
    audioStore.setSuccessSound(successSound);
    
    // Clean up on unmount
    return () => {
      bgMusic.pause();
      hitSound.pause();
      successSound.pause();
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;
