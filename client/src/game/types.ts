// Basic types
export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Velocity {
  x: number;
  y: number;
}

// Game entities
export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  moving?: boolean;
  movingRange?: number;
  originalX?: number;
  special?: boolean;
}

export interface Coin {
  id: string;
  x: number;
  y: number;
  size: number;
}

// Level definition
export interface Level {
  id: number;
  era: 'old' | 'current' | 'future';
  description: string;
  playerStart: Position;
  timeLimit: number;
  platforms: Platform[];
  coins: Coin[];
  totalCoins: number;
}

// Sprite sheet
export interface SpriteFrame {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Sprite {
  width: number;
  height: number;
  frames: SpriteFrame[];
}

// Game state
export interface GameState {
  player: {
    position: Position;
    velocity: Velocity;
    size: Size;
    state: 'idle' | 'run' | 'jump';
    onGround: boolean;
    direction: 'left' | 'right';
  };
  coins: Coin[];
  platforms: Platform[];
  collectedCoins: string[];
  lives: number;
  timeRemaining: number;
  gameOver: boolean;
  levelComplete: boolean;
}

// Component props
export interface PlayerProps {
  position: Position;
  velocity: Velocity;
  size: Size;
  state: 'idle' | 'run' | 'jump';
  onGround: boolean;
  direction: 'left' | 'right';
  update: (player: Partial<GameState['player']>) => void;
}

export interface PlatformProps {
  platform: Platform;
  type: 'old' | 'current' | 'future';
}

export interface CoinProps {
  coin: Coin;
  collected: boolean;
}

export interface GameUIProps {
  coins: number;
  totalCoins: number;
  level: number;
  era: 'old' | 'current' | 'future';
  lives: number;
  timeRemaining: number;
}

export interface LevelCompleteProps {
  era: 'old' | 'current' | 'future';
  levelId: number;
  coinsCollected: number;
  totalCoins: number;
  fact: string;
  nextLevel: string | null;
}
