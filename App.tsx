import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ComparisonView from './components/ComparisonView';
import HistoryBar from './components/HistoryBar';
import { generateImage } from './services/geminiService';
import { GeneratedImage, GenerationSettings, AspectRatio, Theme } from './types';
import { Download, AlertCircle, Maximize2, Image as ImageIcon } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [theme, setTheme] = useState<Theme>('light');
  const [prompt, setPrompt] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [settings, setSettings] = useState<GenerationSettings>({
    aspectRatio: AspectRatio.Square,
    temperature: 1.0,
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [currentItem, setCurrentItem] = useState<GeneratedImage | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  // Effects
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Handlers
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleGenerate = async () => {
    if (!prompt) return;
    
    setIsGenerating(true);
    setError(null);
    setShowComparison(false); // Reset comparison on new gen

    try {
      const generatedDataUrl = await generateImage({
        prompt,
        base64Image: uploadedImage || undefined,
        settings,
      });

      const newItem: GeneratedImage = {
        id: crypto.randomUUID(),
        dataUrl: generatedDataUrl,
        prompt,
        originalImage: uploadedImage || undefined,
        timestamp: Date.now(),
        settings: { ...settings },
      };

      setHistory(prev => [...prev, newItem]);
      setCurrentItem(newItem);
    } catch (err: any) {
      setError(err.message || "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!currentItem) return;
    const link = document.createElement('a');
    link.href = currentItem.dataUrl;
    link.download = `bananagen-${currentItem.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100 dark:bg-gray-900 font-sans">
      
      {/* Sidebar - Controls */}
      <Sidebar 
        prompt={prompt}
        setPrompt={setPrompt}
        settings={settings}
        setSettings={setSettings}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        uploadedImage={uploadedImage}
        setUploadedImage={setUploadedImage}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content - Right Side */}
      <main className="flex-1 flex flex-col h-full relative">
        
        {/* Top Bar (Actions) */}
        <header className="absolute top-0 left-0 right-0 h-16 flex items-center justify-end px-6 z-10 pointer-events-none">
           <div className="pointer-events-auto flex gap-3">
              {currentItem && (
                  <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all active:scale-95 group"
                  >
                    <Download className="w-4 h-4 group-hover:text-banana-500" />
                    <span className="text-sm font-medium">Download</span>
                  </button>
              )}
           </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-10 overflow-hidden relative">
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ 
                    backgroundImage: `radial-gradient(circle at 1px 1px, ${theme === 'dark' ? 'white' : 'black'} 1px, transparent 0)`, 
                    backgroundSize: '24px 24px' 
                 }}>
            </div>

            {/* Content Switcher */}
            {isGenerating ? (
                <div className="flex flex-col items-center justify-center animate-pulse z-10">
                    <div className="w-24 h-24 bg-banana-400 rounded-2xl mb-4 animate-bounce flex items-center justify-center shadow-xl shadow-banana-500/20">
                         <Maximize2 className="w-10 h-10 text-white animate-spin-slow" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Creating masterpiece...</p>
                </div>
            ) : error ? (
                <div className="text-center max-w-md p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800 z-10">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-1">Generation Failed</h3>
                    <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
                </div>
            ) : currentItem ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center z-10">
                   
                   {/* Main Image Container */}
                   <div className="relative w-full h-full max-h-[70vh] flex items-center justify-center shadow-2xl rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800/50">
                        {showComparison && currentItem.originalImage ? (
                            <ComparisonView 
                                originalImage={currentItem.originalImage} 
                                generatedImage={currentItem.dataUrl} 
                            />
                        ) : (
                            <img 
                                src={currentItem.dataUrl} 
                                alt={currentItem.prompt} 
                                className="max-w-full max-h-full object-contain"
                            />
                        )}
                   </div>

                   {/* Toggle Comparison Control */}
                   {currentItem.originalImage && (
                       <div className="mt-4 flex bg-white dark:bg-gray-800 rounded-full p-1 shadow-md border border-gray-200 dark:border-gray-700">
                           <button 
                             onClick={() => setShowComparison(false)}
                             className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${!showComparison ? 'bg-banana-500 text-white shadow' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'}`}
                           >
                               Result
                           </button>
                           <button 
                             onClick={() => setShowComparison(true)}
                             className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${showComparison ? 'bg-banana-500 text-white shadow' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'}`}
                           >
                               Compare
                           </button>
                       </div>
                   )}
                </div>
            ) : (
                <div className="text-center text-gray-400 dark:text-gray-600 z-10">
                    <div className="w-32 h-32 mx-auto mb-4 border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 opacity-50" />
                    </div>
                    <p className="font-medium">Start by entering a prompt in the sidebar</p>
                    <p className="text-sm opacity-60 mt-1">Try "A futuristic banana city at sunset"</p>
                </div>
            )}
        </div>

        {/* Bottom History Bar */}
        <HistoryBar 
            history={history} 
            currentId={currentItem?.id || null} 
            onSelect={(item) => {
                setCurrentItem(item);
                setShowComparison(false); // Reset comparison view on selection change
            }} 
        />
      </main>
    </div>
  );
};

export default App;