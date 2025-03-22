import React from 'react';
import { PlatformProps } from '../types';

const Platform: React.FC<PlatformProps> = ({ platform, type }) => {
  // Different platform styles based on Dubai eras
  const getStyleForEra = () => {
    switch (type) {
      case 'old':
        return {
          backgroundColor: '#D2B48C', // Sandy color for Old Dubai wooden/sand platforms
          borderColor: '#8B4513',
          boxShadow: '0 2px 4px rgba(139, 69, 19, 0.5)',
          borderRadius: '2px'
        };
      case 'current':
        return {
          backgroundColor: '#A9A9A9', // Steel/concrete for Modern Dubai
          borderColor: '#696969',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
          borderRadius: '0px'
        };
      case 'future':
        return {
          backgroundColor: 'rgba(65, 105, 225, 0.7)', // Transparent royal blue for Future Dubai
          borderColor: '#00FFFF',
          boxShadow: '0 0 10px #00FFFF, 0 0 20px rgba(0, 255, 255, 0.5)',
          borderRadius: '4px'
        };
      default:
        return {
          backgroundColor: '#4CAF50', // Default green
          borderColor: '#2E7D32',
          boxShadow: 'none',
          borderRadius: '0px'
        };
    }
  };

  const style = getStyleForEra();
  
  // Determine if this is a special platform (like ice or bouncy)
  const isSpecial = platform.special;
  
  // Different pattern/texture based on era
  const renderPlatformTexture = () => {
    if (type === 'old') {
      // Old Dubai - wood grain/sand patterns
      return (
        <div className="w-full h-full opacity-40 flex flex-wrap overflow-hidden">
          {Array(Math.ceil(platform.width / 20) * Math.ceil(platform.height / 20))
            .fill(0)
            .map((_, i) => (
              <div 
                key={i} 
                className="w-5 h-5 border-b border-r" 
                style={{ 
                  borderColor: isSpecial ? '#008B8B' : style.borderColor,
                  background: i % 2 === 0 ? 'rgba(139, 69, 19, 0.2)' : 'transparent'
                }}
              />
            ))}
        </div>
      );
    } else if (type === 'current') {
      // Modern Dubai - steel/glass look
      return (
        <div className="w-full h-full opacity-30 flex flex-wrap">
          {Array(Math.ceil(platform.width / 15) * Math.ceil(platform.height / 15))
            .fill(0)
            .map((_, i) => (
              <div 
                key={i} 
                className="w-[15px] h-[15px] border-b border-r" 
                style={{ 
                  borderColor: isSpecial ? '#008B8B' : style.borderColor,
                  background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)'
                }}
              />
            ))}
        </div>
      );
    } else if (type === 'future') {
      // Future Dubai - glowing circuit patterns
      return (
        <div className="w-full h-full relative overflow-hidden">
          <div className="absolute inset-0 opacity-30" 
               style={{ background: 'linear-gradient(90deg, transparent 50%, rgba(0, 255, 255, 0.3) 50%)' }}>
          </div>
          <div className="absolute inset-0 opacity-30"
               style={{ background: 'linear-gradient(0deg, transparent 50%, rgba(0, 255, 255, 0.3) 50%)' }}>
          </div>
        </div>
      );
    } else {
      // Default texture
      return (
        <div className="w-full h-full opacity-30 flex flex-wrap">
          {Array(Math.ceil(platform.width / 20) * Math.ceil(platform.height / 20))
            .fill(0)
            .map((_, i) => (
              <div 
                key={i} 
                className="w-5 h-5 border-b border-r" 
                style={{ borderColor: isSpecial ? '#008B8B' : style.borderColor }}
              />
            ))}
        </div>
      );
    }
  };

  return (
    <div
      className="absolute border-t-2 border-l-2 border-r-2"
      style={{
        left: platform.x,
        top: platform.y,
        width: platform.width,
        height: platform.height,
        backgroundColor: isSpecial ? '#00CED1' : style.backgroundColor,
        borderColor: isSpecial ? '#00868B' : style.borderColor,
        boxShadow: isSpecial ? '0 0 10px #00CED1' : style.boxShadow,
        borderRadius: style.borderRadius,
        transition: 'transform 0.3s ease-in-out',
        transform: platform.moving ? `translateX(${Math.sin(Date.now() / 500) * (platform.movingRange !== undefined ? platform.movingRange : 50)}px)` : 'none',
      }}
    >
      {/* Platform texture pattern */}
      {renderPlatformTexture()}
    </div>
  );
};

export default React.memo(Platform);
