import { useRef, useEffect } from 'react';

interface CanvasProps {
  width?: number;
  height?: number;
  onResize?: (width: number, height: number) => void;
}

/**
 * A hook to manage canvas dimensions and context
 */
export function useCanvas({ width, height, onResize }: CanvasProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  
  // Set up canvas context on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Get the context
    const context = canvas.getContext('2d');
    if (!context) return;
    
    contextRef.current = context;
    
    // Handle initial sizing
    const handleResize = () => {
      if (!canvas) return;
      
      // Set canvas dimensions - using parent dimensions if none provided
      const parent = canvas.parentElement;
      
      if (parent) {
        const containerWidth = width || parent.clientWidth;
        const containerHeight = height || parent.clientHeight;
        
        canvas.width = containerWidth;
        canvas.height = containerHeight;
        
        // Call resize callback if provided
        if (onResize) {
          onResize(containerWidth, containerHeight);
        }
      }
    };
    
    // Handle resize events
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [width, height, onResize]);
  
  return { canvasRef, contextRef };
}
