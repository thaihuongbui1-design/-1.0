import React from 'react';
import { HistoryItem } from '../types';

interface HistoryBarProps {
  history: HistoryItem[];
  currentId: string | null;
  onSelect: (item: HistoryItem) => void;
}

const HistoryBar: React.FC<HistoryBarProps> = ({ history, currentId, onSelect }) => {
  if (history.length === 0) return null;

  return (
    <div className="h-32 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex flex-col shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10">
        <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex justify-between items-center">
            <span>History</span>
            <span className="text-[10px] font-normal opacity-70">{history.length} items</span>
        </div>
        <div className="flex-1 overflow-x-auto overflow-y-hidden flex items-center px-4 gap-3 history-scroll pb-2">
        {history.slice().reverse().map((item) => (
            <div 
            key={item.id}
            onClick={() => onSelect(item)}
            className={`relative group flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                currentId === item.id 
                ? 'border-banana-500 ring-2 ring-banana-500/30' 
                : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            >
            <img src={item.dataUrl} alt={item.prompt} className="w-full h-full object-cover" />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <span className="text-white text-[10px] font-medium px-2 text-center line-clamp-2">
                   {item.prompt}
               </span>
            </div>
            </div>
        ))}
        </div>
    </div>
  );
};

export default HistoryBar;