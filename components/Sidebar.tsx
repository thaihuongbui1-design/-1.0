import React, { useRef } from 'react';
import { Settings, Upload, Sun, Moon, Sparkles, Image as ImageIcon, Trash2 } from 'lucide-react';
import { AspectRatio, GenerationSettings, Theme } from '../types';

interface SidebarProps {
  prompt: string;
  setPrompt: (s: string) => void;
  settings: GenerationSettings;
  setSettings: (s: GenerationSettings) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  uploadedImage: string | null;
  setUploadedImage: (s: string | null) => void;
  theme: Theme;
  toggleTheme: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  prompt,
  setPrompt,
  settings,
  setSettings,
  onGenerate,
  isGenerating,
  uploadedImage,
  setUploadedImage,
  theme,
  toggleTheme,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearUpload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full md:w-80 lg:w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full transition-colors duration-300 z-20 shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-banana-400 flex items-center justify-center text-white font-bold text-lg">
                B
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-banana-600 to-amber-600 dark:from-banana-300 dark:to-amber-400">
            BananaGen
            </h1>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">Nano Banana Image Studio</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        
        {/* Prompt Section */}
        <section>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="w-full h-32 p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-banana-400 focus:border-transparent outline-none resize-none transition-all shadow-sm"
          />
        </section>

        {/* Upload Section */}
        <section>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Reference Image (Optional)
          </label>
          {!uploadedImage ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-banana-400 dark:hover:border-banana-400 transition-colors group"
            >
              <Upload className="w-6 h-6 text-gray-400 group-hover:text-banana-500 mb-1" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Click to upload</span>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden group border border-gray-200 dark:border-gray-600">
              <img src={uploadedImage} alt="Uploaded" className="w-full h-32 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <button 
                onClick={clearUpload}
                className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 text-white p-1.5 rounded-full transition-all"
                title="Remove image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*" 
            className="hidden" 
          />
        </section>

        {/* Parameters Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Configuration</h3>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(AspectRatio).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setSettings({ ...settings, aspectRatio: value })}
                  className={`px-2 py-2 text-xs rounded-lg border transition-all ${
                    settings.aspectRatio === value
                      ? 'bg-banana-50 dark:bg-banana-900/20 border-banana-400 text-banana-700 dark:text-banana-300 font-medium shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
                Creativity (Temperature)
                </label>
                <span className="text-xs text-gray-400">{settings.temperature.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={settings.temperature}
              onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-banana-500"
            />
          </div>
        </section>

      </div>

      {/* Footer / Theme Toggle / Generate Button */}
      <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <button
          onClick={onGenerate}
          disabled={isGenerating || !prompt}
          className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 text-white font-medium shadow-lg shadow-banana-500/20 transition-all transform active:scale-95 ${
            isGenerating || !prompt
              ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-banana-500 to-amber-600 hover:from-banana-400 hover:to-amber-500'
          }`}
        >
          {isGenerating ? (
            <>
               <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Dreaming...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate</span>
            </>
          )}
        </button>

        <button
          onClick={toggleTheme}
          className="mt-4 flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors w-full justify-center"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          <span>{theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;