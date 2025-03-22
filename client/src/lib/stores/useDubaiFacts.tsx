import { create } from 'zustand';
import { dubaiFacts } from '../../game/data/dubaiFacts';

interface DubaiFactsState {
  // Store displayed facts by level ID (era-levelId)
  displayedFacts: Record<string, string>;
  
  // Get a fact for a specific level (returns existing or generates new)
  getFactForLevel: (era: 'old' | 'current' | 'future', levelId: number) => string;
  
  // Clear all stored facts
  clearFacts: () => void;
}

export const useDubaiFacts = create<DubaiFactsState>((set, get) => ({
  displayedFacts: {},
  
  getFactForLevel: (era, levelId) => {
    const levelKey = `${era}-${levelId}`;
    const { displayedFacts } = get();
    
    // If we already have a fact for this level, return it
    if (displayedFacts[levelKey]) {
      return displayedFacts[levelKey];
    }
    
    // Otherwise, generate a new random fact
    const eraFacts = dubaiFacts[era] || [];
    const randomFact = eraFacts[Math.floor(Math.random() * eraFacts.length)] || 
      "Dubai has transformed dramatically over the decades.";
    
    // Limit fact length
    const fact = randomFact.length > 100 ? randomFact.substring(0, 97) + '...' : randomFact;
    
    // Store the fact for this level
    set(state => ({
      displayedFacts: {
        ...state.displayedFacts,
        [levelKey]: fact
      }
    }));
    
    return fact;
  },
  
  clearFacts: () => set({ displayedFacts: {} })
}));