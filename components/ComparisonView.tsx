import React, { useState, useRef, useEffect } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

interface ComparisonViewProps {
  originalImage: string;
  generatedImage: string;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ originalImage, generatedImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => setIsResizing(true);
  
  const handleMouseUp = () => setIsResizing(false);
  
  const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if (!isResizing || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e as any).clientX || (e as any).touches?.[0]?.clientX) - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(100, (x / width) * 100));
    
    setSliderPosition(percentage);
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      // Touch support
      window.addEventListener('touchmove', handleMouseMove as any);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove as any);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div 
        ref={containerRef}
        className="relative w-full h-full select-none overflow-hidden cursor-col-resize group"
    >
      {/* Generated Image (Background/Under) */}
      <img 
        src={generatedImage} 
        alt="Generated" 
        className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none" 
      />
      
      {/* Original Image (Foreground/Over) - Clipped */}
      <div 
        className="absolute top-0 left-0 h-full w-full overflow-hidden pointer-events-none border-r-2 border-banana-500 bg-white dark:bg-gray-900"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={originalImage} 
          alt="Original" 
          className="absolute top-0 left-0 h-full max-w-none object-contain"
          // We must calculate the width of this inner image to match the container exactly to preserve aspect ratio logic
          style={{ width: containerRef.current?.offsetWidth || '100%' }}
        />
         {/* Label */}
         <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm shadow-md">
            Original
         </div>
      </div>

      {/* Generated Label */}
      <div className="absolute top-4 right-4 bg-banana-500/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm pointer-events-none shadow-md">
        Generated
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)] flex items-center justify-center hover:bg-banana-200 transition-colors"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center transform -translate-x-0.5 text-banana-600 hover:scale-110 transition-transform">
            <ChevronsLeftRight size={16} />
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;