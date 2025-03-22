import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAudio } from '../../lib/stores/useAudio';
import { useGame } from '../../lib/stores/useGame';
import { useDubaiFacts } from '../../lib/stores/useDubaiFacts';
import Player from '../components/Player';
import Platform from '../components/Platform';
import Coin from '../components/Coin';
import GameUI from '../components/GameUI';
import LevelComplete from '../components/LevelComplete';
import { levels } from '../data/levels';
import { useKeyboard } from '../hooks/useKeyboard';
import { useGameLoop } from '../hooks/useGameLoop';
import { checkCollision, isOnGround } from '../utils/collision';
import { GameState, Position, Size, Coin as CoinType, Platform as PlatformType } from '../types';

const GRAVITY = 0.5;
const JUMP_FORCE = -15;
const MOVE_SPEED = 3; // Reduced from 5 to make movement slower
const PLAYER_SIZE = { width: 40, height: 50 };

const GameLevel: React.FC = () => {
  const { era = 'current', levelId = '1' } = useParams<{ era: string; levelId: string }>();
  const navigate = useNavigate();
  const { phase, end } = useGame();
  const { playHit, playSuccess } = useAudio();
  
  // Game canvas ref
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Find current level data
  const currentLevel = levels.find(
    l => l.era === era && l.id === parseInt(levelId)
  );
  
  // If level doesn't exist, go back to level selection
  useEffect(() => {
    if (!currentLevel) {
      navigate('/level-select');
    }
  }, [era, levelId, navigate, currentLevel]);
  
  if (!currentLevel) return null;
  
  // Game state
  const [gameState, setGameState] = useState<GameState>({
    player: {
      position: { ...currentLevel.playerStart },
      velocity: { x: 0, y: 0 },
      size: PLAYER_SIZE,
      state: 'idle' as const,
      onGround: false,
      direction: 'right' as const
    },
    coins: [...currentLevel.coins],
    platforms: [...currentLevel.platforms],
    collectedCoins: [],
    lives: 3,
    timeRemaining: currentLevel.timeLimit || 60,
    gameOver: false,
    levelComplete: false
  });
  
  // Get keyboard inputs
  const keys = useKeyboard();
  
  // Update player position based on keyboard input
  const updatePlayerPosition = (deltaTime: number) => {
    if (gameState.gameOver || gameState.levelComplete) return;
    
    const player = { ...gameState.player };
    let onGround = false;
    let playerState: 'idle' | 'run' | 'jump' = 'idle';
    
    // Check if player is on ground
    for (const platform of gameState.platforms) {
      if (isOnGround(player, platform)) {
        onGround = true;
        break;
      }
    }
    
    // Apply gravity if not on ground
    player.velocity.y += GRAVITY;
    
    // Handle jump if on ground and space is pressed
    if (onGround && (keys.space || keys.up)) {
      player.velocity.y = JUMP_FORCE;
      playHit();
      onGround = false;
    }
    
    // Handle horizontal movement
    if (keys.left) {
      player.velocity.x = -MOVE_SPEED;
      player.direction = 'left';
      playerState = onGround ? 'run' : 'jump';
    } else if (keys.right) {
      player.velocity.x = MOVE_SPEED;
      player.direction = 'right';
      playerState = onGround ? 'run' : 'jump';
    } else {
      // Apply friction to gradually stop horizontal movement
      player.velocity.x *= 0.8;
      playerState = onGround ? 'idle' : 'jump';
    }
    
    // Update player position based on velocity
    player.position.x += player.velocity.x;
    player.position.y += player.velocity.y;
    
    // Prevent player from going out of bounds
    const canvasWidth = canvasRef.current?.clientWidth || 800;
    if (player.position.x < 0) player.position.x = 0;
    if (player.position.x + player.size.width > canvasWidth) {
      player.position.x = canvasWidth - player.size.width;
    }
    
    // Check for platform collisions
    for (const platform of gameState.platforms) {
      if (checkCollision(player, platform)) {
        // Handle collision by adjusting position and velocity
        const collision = checkCollision(player, platform, true) as {
          collision: boolean;
          top?: boolean;
          bottom?: boolean;
          left?: boolean;
          right?: boolean;
        };
        
        if (collision.top) {
          player.position.y = platform.y - player.size.height;
          player.velocity.y = 0;
          onGround = true;
        } else if (collision.bottom) {
          player.position.y = platform.y + platform.height;
          player.velocity.y = 0;
        }
        
        if (collision.left) {
          player.position.x = platform.x - player.size.width;
          player.velocity.x = 0;
        } else if (collision.right) {
          player.position.x = platform.x + platform.width;
          player.velocity.x = 0;
        }
      }
    }
    
    // Check for coin collection
    const collectedCoins = [...gameState.collectedCoins];
    for (const coin of gameState.coins) {
      if (!collectedCoins.includes(coin.id) && checkCollision(
        {
          position: player.position,
          size: player.size
        },
        {
          x: coin.x,
          y: coin.y,
          width: coin.size,
          height: coin.size
        }
      )) {
        collectedCoins.push(coin.id);
        playSuccess();
      }
    }
    
    // Check if player fell off the level
    if (player.position.y > (canvasRef.current?.clientHeight || 600) + 100) {
      player.position = { ...currentLevel.playerStart };
      player.velocity = { x: 0, y: 0 };
      setGameState(prev => ({
        ...prev,
        lives: prev.lives - 1
      }));
      playHit();
    }
    
    // Update game state
    setGameState(prev => ({
      ...prev,
      player: {
        ...player,
        state: playerState,
        onGround
      },
      collectedCoins
    }));
    
    // Check if all coins are collected
    if (collectedCoins.length === gameState.coins.length) {
      // Mark level as complete
      setGameState(prev => ({
        ...prev,
        levelComplete: true
      }));
    }
  };
  
  // Update game timer
  const updateTimer = () => {
    if (gameState.gameOver || gameState.levelComplete) return;
    
    setGameState(prev => {
      const newTime = prev.timeRemaining - 1;
      
      if (newTime <= 0) {
        return {
          ...prev,
          timeRemaining: 0,
          gameOver: true
        };
      }
      
      return {
        ...prev,
        timeRemaining: newTime
      };
    });
  };
  
  // Check for game over conditions
  useEffect(() => {
    if (gameState.lives <= 0) {
      setGameState(prev => ({
        ...prev,
        gameOver: true
      }));
    }
  }, [gameState.lives]);
  
  // Set up timer
  useEffect(() => {
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Update game state every frame
  useGameLoop(deltaTime => {
    updatePlayerPosition(deltaTime);
    
    // Update moving platforms
    setGameState(prev => {
      const updatedPlatforms = prev.platforms.map(platform => {
        if (platform.moving) {
          // Use non-null assertion or default values to handle possibly undefined properties
          const originalX = platform.originalX ?? platform.x;
          const movingRange = platform.movingRange ?? 50;
          
          return {
            ...platform,
            x: originalX + Math.sin(Date.now() / 500) * movingRange
          };
        }
        return platform;
      });
      
      return {
        ...prev,
        platforms: updatedPlatforms
      };
    });
  });
  
  // Get fact from shared store to ensure consistency across level transitions
  const { getFactForLevel } = useDubaiFacts();
  const getRandomFact = (): string => {
    return getFactForLevel(era as 'old' | 'current' | 'future', parseInt(levelId));
  };
  
  // Find the next level to navigate to
  const getNextLevelRoute = (): string | null => {
    const currentLevelIndex = levels.findIndex(
      l => l.era === era && l.id === parseInt(levelId)
    );
    
    if (currentLevelIndex >= 0 && currentLevelIndex < levels.length - 1) {
      const nextLevel = levels[currentLevelIndex + 1];
      return `/play/${nextLevel.era}/${nextLevel.id}`;
    }
    
    return null;
  };
  
  // Get the background based on era
  const getBackgroundStyle = (): React.CSSProperties => {
    const backgrounds: Record<string, React.CSSProperties> = {
      old: {
        backgroundImage: 'url(/textures/dubai_old.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center'
      },
      current: {
        backgroundImage: 'url(/textures/dubai_current.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center'
      },
      future: {
        backgroundImage: 'url(/textures/dubai_future.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center'
      }
    };
    
    return backgrounds[era] || backgrounds.current;
  };
  
  return (
    <div 
      ref={canvasRef}
      className="relative w-full h-screen overflow-hidden"
      style={getBackgroundStyle()}
    >
      {/* Game UI */}
      <GameUI 
        coins={gameState.collectedCoins.length}
        totalCoins={gameState.coins.length}
        level={parseInt(levelId)}
        era={era as 'old' | 'current' | 'future'}
        lives={gameState.lives}
        timeRemaining={gameState.timeRemaining}
      />
      
      {/* Platforms */}
      {gameState.platforms.map((platform, index) => (
        <Platform 
          key={index}
          platform={platform}
          type={era as 'old' | 'current' | 'future'}
        />
      ))}
      
      {/* Coins */}
      {gameState.coins.map(coin => (
        <Coin 
          key={coin.id}
          coin={coin}
          collected={gameState.collectedCoins.includes(coin.id)}
        />
      ))}
      
      {/* Player */}
      <Player
        position={gameState.player.position}
        velocity={gameState.player.velocity}
        size={gameState.player.size}
        state={gameState.player.state}
        onGround={gameState.player.onGround}
        direction={gameState.player.direction}
        update={(updatedPlayer) => {
          setGameState(prev => ({
            ...prev,
            player: {
              ...prev.player,
              ...updatedPlayer
            }
          }));
        }}
      />
      
      {/* Level Complete Modal */}
      {gameState.levelComplete && (
        <LevelComplete
          era={era as 'old' | 'current' | 'future'}
          levelId={parseInt(levelId)}
          coinsCollected={gameState.collectedCoins.length}
          totalCoins={gameState.coins.length}
          fact={getRandomFact()}
          nextLevel={getNextLevelRoute()}
        />
      )}
      
      {/* Game Over Modal */}
      {gameState.gameOver && !gameState.levelComplete && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Game Over</h2>
            <p className="mb-6">You ran out of {gameState.lives <= 0 ? 'lives' : 'time'}!</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => navigate('/level-select')} 
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Level Select
              </button>
              <button 
                onClick={() => navigate(`/play/${era}/${levelId}`)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameLevel;
