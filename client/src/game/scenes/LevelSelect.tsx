import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { levels } from '../data/levels';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { useGame } from '../../lib/stores/useGame';

const LevelSelect: React.FC = () => {
  const navigate = useNavigate();
  const { start } = useGame();
  const [activeEra, setActiveEra] = useState<'old' | 'current' | 'future'>('old');
  
  const handleLevelSelect = (era: string, levelId: number) => {
    start();
    navigate(`/play/${era}/${levelId}`);
  };
  
  const getEraBackgroundStyle = (era: string): React.CSSProperties => {
    switch (era) {
      case 'old':
        return {
          backgroundImage: 'url(/textures/dubai_old.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          opacity: 0.8
        };
      case 'current':
        return {
          backgroundImage: 'url(/textures/dubai_current.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          opacity: 0.8
        };
      case 'future':
        return {
          backgroundImage: 'url(/textures/dubai_future.svg)',
          backgroundSize: 'cover', 
          backgroundPosition: 'center center',
          opacity: 0.8
        };
      default:
        return {};
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background particles effect */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-4 h-4 bg-yellow-300 opacity-20 rounded-full animate-ping" style={{ left: '10%', top: '20%', animationDuration: '4s', animationDelay: '0.5s' }} />
        <div className="absolute top-0 left-0 w-3 h-3 bg-blue-300 opacity-30 rounded-full animate-ping" style={{ left: '30%', top: '70%', animationDuration: '3s', animationDelay: '0.2s' }} />
        <div className="absolute top-0 left-0 w-5 h-5 bg-purple-300 opacity-20 rounded-full animate-ping" style={{ left: '80%', top: '40%', animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute top-0 left-0 w-2 h-2 bg-green-300 opacity-20 rounded-full animate-ping" style={{ left: '60%', top: '10%', animationDuration: '3.5s', animationDelay: '0.7s' }} />
        <div className="absolute top-0 left-0 w-4 h-4 bg-red-300 opacity-20 rounded-full animate-ping" style={{ left: '20%', top: '80%', animationDuration: '4.5s', animationDelay: '1.2s' }} />
      </div>
      
      {/* Game title with gaming font */}
      <div className="mb-8">
        <div className="flex flex-col items-center justify-center">
          <h1 className="game-title text-4xl sm:text-5xl text-cyan-400 mb-1 text-center tracking-wide">DUBAI</h1>
          <h1 className="game-title-alt text-3xl sm:text-4xl text-yellow-400 mb-2 text-center">PARKOUR LEGENDS</h1>
          <div className="flex items-center gap-3 my-2">
            <div className="h-1 w-12 bg-gradient-to-r from-transparent to-cyan-500"></div>
            <div className="text-glow text-white text-xl sm:text-2xl font-bold">X</div>
            <div className="h-1 w-12 bg-gradient-to-l from-transparent to-cyan-500"></div>
          </div>
        </div>
        <p className="game-font text-center text-lg text-white/90 mt-3">
          Jump, run & climb through Dubai's history and discover amazing facts!
        </p>
      </div>
      
      <Card className="max-w-4xl w-full bg-gray-900/90 backdrop-blur border-2 border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
        <Tabs defaultValue="old" onValueChange={(value) => setActiveEra(value as any)}>
          <TabsList className="grid grid-cols-3 mb-6 bg-gray-800 p-1">
            {(['old', 'current', 'future'] as const).map(eraTab => (
              <TabsTrigger 
                key={eraTab} 
                value={eraTab} 
                className={`game-font py-2 data-[state=active]:bg-yellow-600 data-[state=active]:text-white`}
              >
                {eraTab === 'old' && 'Old Dubai'}
                {eraTab === 'current' && 'Current Dubai'}
                {eraTab === 'future' && 'Future Dubai'}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {(['old', 'current', 'future'] as const).map(era => (
            <TabsContent key={era} value={era}>
              <CardContent className="p-4">
                <div 
                  className="rounded-lg p-6 mb-6 h-40 flex items-end"
                  style={{
                    ...getEraBackgroundStyle(era),
                    boxShadow: 'inset 0 -60px 30px -10px rgba(0,0,0,0.8)'
                  }}
                >
                  <div className="game-font text-white w-full">
                    <h3 className="font-bold text-xl mb-1 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                      {era === 'old' && 'Pearl Diving Era (1900s-1950s)'}
                      {era === 'current' && 'Modern Metropolis (2000-Present)'}
                      {era === 'future' && 'Dubai Tomorrow (2050+)'}
                    </h3>
                    <p className="text-sm drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                      {era === 'old' && 'Experience traditional life in Dubai before the oil boom.'}
                      {era === 'current' && 'Explore the magnificent skyscrapers of modern Dubai.'}
                      {era === 'future' && 'Discover Dubai\'s ambitious vision for the future.'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {levels
                    .filter(level => level.era === era)
                    .map(level => (
                      <div 
                        key={level.id} 
                        className="game-font relative bg-gray-800 rounded-lg border-2 border-gray-700 hover:border-cyan-500 p-4 flex flex-col h-full cursor-pointer hover:shadow-[0_0_15px_rgba(14,165,233,0.4)] transition-all overflow-hidden"
                        onClick={() => handleLevelSelect(level.era, level.id)}
                      >
                        {/* Diagonal strip in corner - parkour design element */}
                        <div className="absolute -top-2 -right-10 w-32 h-8 bg-cyan-600 rotate-45 flex justify-center items-center">
                          <div className="flex items-center mt-4 ml-4">
                            <svg width="14" height="14" viewBox="0 0 40 40">
                              <circle cx="20" cy="20" r="16" fill="#FFD700" />
                              <circle cx="20" cy="20" r="13" fill="#F4C430" />
                            </svg>
                            <span className="ml-1 text-white font-bold text-xs">{level.totalCoins}</span>
                          </div>
                        </div>
                        
                        {/* Level indicator with running icon */}
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-cyan-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                            </svg>
                            <h3 className="font-bold text-cyan-300 text-xl game-title-alt">LEVEL {level.id}</h3>
                          </div>
                        </div>
                        
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-700 to-transparent mb-3"></div>
                        
                        <p className="text-sm text-gray-300 flex-1 mb-3">
                          {level.description}
                        </p>
                        
                        <Button className="game-title-alt w-full bg-gradient-to-r from-cyan-700 to-cyan-500 hover:from-cyan-600 hover:to-cyan-400 text-white border-none tracking-wide text-sm py-1">
                          START PARKOUR
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </TabsContent>
          ))}
        </Tabs>
        
        <CardFooter className="flex flex-col items-center border-t border-gray-700 pt-4 pb-5 game-font">
          <h3 className="game-title-alt text-cyan-400 mb-3 text-lg">PARKOUR CONTROLS</h3>
          <div className="flex flex-wrap items-center justify-center gap-5 text-gray-300">
            <div className="flex items-center bg-gray-800 px-3 py-2 rounded-md shadow-inner border border-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-cyan-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
              <span className="text-white">RUN</span>
            </div>
            <div className="flex items-center bg-gray-800 px-3 py-2 rounded-md shadow-inner border border-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-cyan-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
              <span className="text-white">JUMP</span>
            </div>
            <div className="flex items-center bg-gray-800 px-3 py-2 rounded-md shadow-inner border border-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-yellow-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="8" y1="14" x2="16" y2="14"></line>
                <line x1="12" y1="8" x2="12" y2="16"></line>
              </svg>
              <span className="text-white">COLLECT COINS</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LevelSelect;
