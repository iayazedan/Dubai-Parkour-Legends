import { useRef, useEffect } from 'react';

/**
 * A hook that runs a callback function in a game loop using requestAnimationFrame
 * @param callback Function to run each frame, receives deltaTime in ms
 */
export function useGameLoop(callback: (deltaTime: number) => void) {
  // Refs to store callback and timing information
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const callbackRef = useRef(callback);
  
  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  // Set up the animation loop
  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        // Calculate delta time in milliseconds
        const deltaTime = time - previousTimeRef.current;
        // Call the callback with delta time
        callbackRef.current(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };
    
    // Start the animation loop
    requestRef.current = requestAnimationFrame(animate);
    
    // Clean up on unmount
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []); // Empty dependency array so the effect runs only once
}
