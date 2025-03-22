import { useState, useEffect } from 'react';

interface KeyState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  space: boolean;
}

/**
 * A hook to track keyboard input for game controls
 */
export function useKeyboard() {
  const [keys, setKeys] = useState<KeyState>({
    up: false,
    down: false,
    left: false,
    right: false,
    space: false
  });
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return; // Ignore key repeat events
      
      const updateKeys = (keyCode: string, value: boolean) => {
        switch (keyCode) {
          case 'ArrowUp':
          case 'KeyW':
            setKeys(prev => ({ ...prev, up: value }));
            break;
          case 'ArrowDown':
          case 'KeyS':
            setKeys(prev => ({ ...prev, down: value }));
            break;
          case 'ArrowLeft':
          case 'KeyA':
            setKeys(prev => ({ ...prev, left: value }));
            break;
          case 'ArrowRight':
          case 'KeyD':
            setKeys(prev => ({ ...prev, right: value }));
            break;
          case 'Space':
            setKeys(prev => ({ ...prev, space: value }));
            break;
        }
      };
      
      updateKeys(e.code, true);
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const updateKeys = (keyCode: string, value: boolean) => {
        switch (keyCode) {
          case 'ArrowUp':
          case 'KeyW':
            setKeys(prev => ({ ...prev, up: value }));
            break;
          case 'ArrowDown':
          case 'KeyS':
            setKeys(prev => ({ ...prev, down: value }));
            break;
          case 'ArrowLeft':
          case 'KeyA':
            setKeys(prev => ({ ...prev, left: value }));
            break;
          case 'ArrowRight':
          case 'KeyD':
            setKeys(prev => ({ ...prev, right: value }));
            break;
          case 'Space':
            setKeys(prev => ({ ...prev, space: value }));
            break;
        }
      };
      
      updateKeys(e.code, false);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Debug log for controls
    console.log('Keyboard controls initialized - use arrow keys/WASD to move, Space to jump');
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  return keys;
}
