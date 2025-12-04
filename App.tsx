import React, { useState, useEffect } from 'react';
import { AppScreen, HistoryItem } from './types';
import { Navigation } from './components/Navigation';
import { ImageEditor } from './components/ImageEditor';
import { ChatBot } from './components/ChatBot';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.SPLASH);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [loginInput, setLoginInput] = useState<string>("");

  // Simulate Splash Screen
  useEffect(() => {
    if (currentScreen === AppScreen.SPLASH) {
      const timer = setTimeout(() => {
        setCurrentScreen(AppScreen.ONBOARDING);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setCurrentScreen(AppScreen.EDITOR);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveToHistory = (img: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      thumbnail: img,
      timestamp: Date.now()
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const handleLogin = () => {
    if (loginInput.trim()) {
      setUserName(loginInput);
      setCurrentScreen(AppScreen.HOME);
    }
  };

  const Header = () => (
    <div className="bg-white border-b border-gray-100 p-3 text-center shadow-sm z-20 sticky top-0">
      <h1 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Imam Malik Computer Professionals</h1>
    </div>
  );

  const Footer = () => (
    <div className="bg-gray-50 border-t border-gray-200 p-2 text-center text-xs text-gray-500 pb-20">
      Programmer: Alkasim Umar 08035209936
    </div>
  );

  const renderContent = () => {
    switch (currentScreen) {
      case AppScreen.SPLASH:
        return (
          <div className="flex flex-col items-center justify-center h-screen bg-primary text-white relative">
            <div className="w-24 h-24 bg-white rounded-2xl mb-6 flex items-center justify-center shadow-2xl">
              <svg className="w-14 h-14 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-center px-4">Imam Malik Computer Professionals</h1>
            <p className="opacity-80 mt-2 text-sm">Smart Image Editor</p>
            
            <div className="absolute bottom-10 text-xs opacity-70">
              Programmer: Alkasim Umar 08035209936
            </div>
          </div>
        );

      case AppScreen.ONBOARDING:
        return (
          <div className="flex flex-col h-full bg-white relative">
            <Header />
            <div className="flex-1 flex flex-col justify-center items-center text-center p-6">
              <img src="https://picsum.photos/400/300" alt="Intro" className="w-full h-64 object-cover rounded-2xl mb-8 shadow-lg" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Edits</h2>
              <p className="text-gray-500 mb-8 max-w-xs">Instantly remove backgrounds, enhance clarity, and create passport photos.</p>
              <button 
                onClick={() => setCurrentScreen(AppScreen.LOGIN)}
                className="w-full max-w-xs bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition"
              >
                Get Started
              </button>
            </div>
            <div className="p-4 text-center text-xs text-gray-400">
               Programmer: Alkasim Umar 08035209936
            </div>
          </div>
        );

      case AppScreen.LOGIN:
        return (
          <div className="flex flex-col h-full bg-white relative">
            <Header />
            <div className="flex-1 flex flex-col justify-center p-8">
               <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h2>
               <p className="text-gray-500 mb-8">Please enter your name to continue.</p>
               
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                   <input 
                    type="text" 
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    placeholder="e.g. Alkasim Umar"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                   />
                 </div>
                 <button 
                  onClick={handleLogin}
                  disabled={!loginInput.trim()}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition disabled:opacity-50"
                 >
                   Continue
                 </button>
               </div>
            </div>
             <div className="p-4 text-center text-xs text-gray-400">
               Programmer: Alkasim Umar 08035209936
            </div>
          </div>
        );

      case AppScreen.HOME:
        return (
          <>
            <Header />
            <div className="p-6 h-full overflow-y-auto">
              <header className="mb-8 mt-2">
                <h1 className="text-3xl font-bold text-gray-900">Hello, {userName || 'Creator'} 👋</h1>
                <p className="text-gray-500 mt-1">Ready to edit your photos?</p>
              </header>

              {/* Upload Area */}
              <div className="relative group cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" 
                />
                <div className="border-3 border-dashed border-blue-200 rounded-3xl p-10 flex flex-col items-center justify-center bg-blue-50 transition-colors group-hover:bg-blue-100 group-hover:border-primary">
                  <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                     <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">Upload Image</h3>
                  <p className="text-sm text-gray-400 mt-1">Tap to browse gallery</p>
                </div>
              </div>

              {/* Recent Section */}
              <div className="mt-8 mb-20">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-gray-800">Recent</h3>
                   <button onClick={() => setCurrentScreen(AppScreen.HISTORY)} className="text-primary text-sm font-medium">See All</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   {history.length > 0 ? history.slice(0, 2).map((item) => (
                     <div key={item.id} className="aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                       <img src={item.thumbnail} className="w-full h-full object-cover" alt="History" />
                     </div>
                   )) : (
                     <div className="col-span-2 py-8 text-center text-gray-400 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                       No recent edits
                     </div>
                   )}
                </div>
              </div>
              <Footer />
            </div>
          </>
        );

      case AppScreen.EDITOR:
        return uploadedImage ? (
          <div className="h-full flex flex-col bg-white">
            <Header />
            <div className="flex-1 overflow-hidden">
              <ImageEditor 
                initialImage={uploadedImage} 
                onBack={() => {
                  setUploadedImage(null);
                  setCurrentScreen(AppScreen.HOME);
                }}
                onSaveToHistory={handleSaveToHistory}
              />
            </div>
            {/* Note: Editor has its own footer/controls, so we don't add the main footer here to save space */}
          </div>
        ) : null;

      case AppScreen.CHAT:
        return (
          <div className="flex flex-col h-full bg-white">
            <Header />
            <div className="flex-1 overflow-hidden">
               <ChatBot />
            </div>
            {/* Chat has input area at bottom */}
          </div>
        );

      case AppScreen.HISTORY:
        return (
          <div className="flex flex-col h-full bg-white">
            <Header />
            <div className="p-6 h-full overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-4">History</h2>
              <div className="grid grid-cols-2 gap-4 mb-20">
                {history.map((item) => (
                  <div key={item.id} className="relative group rounded-xl overflow-hidden shadow-sm bg-white aspect-square">
                    <img src={item.thumbnail} alt="Saved" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={() => {
                         const link = document.createElement('a');
                         link.href = item.thumbnail;
                         link.download = 'history-image.jpg';
                         link.click();
                      }} className="text-white bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs border border-white/50">Download</button>
                    </div>
                  </div>
                ))}
                {history.length === 0 && <p className="text-gray-500 col-span-2 text-center mt-10">No history yet.</p>}
              </div>
              <Footer />
            </div>
          </div>
        );

      case AppScreen.SETTINGS:
        return (
           <div className="flex flex-col h-full bg-white">
            <Header />
            <div className="p-6 h-full overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-4">Settings</h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                <div className="p-4 flex justify-between items-center">
                  <span className="text-gray-700">Image Quality</span>
                  <span className="text-primary font-medium text-sm">High (Gemini Pro)</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="text-gray-700">Dark Mode</span>
                  <div className="w-10 h-6 bg-gray-200 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div></div>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="text-gray-700">User</span>
                  <span className="text-gray-400 text-sm">{userName || "Guest"}</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="text-gray-700">Version</span>
                  <span className="text-gray-400 text-sm">1.1.0</span>
                </div>
              </div>
              <div className="mt-8 text-center text-xs text-gray-400">
                Powered by Google Gemini 3 Pro & Flash
              </div>
              <div className="mt-8 text-center text-xs text-gray-500 font-medium">
                 Programmer: Alkasim Umar 08035209936
              </div>
              <div className="h-20"></div> {/* Spacer */}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white max-w-md mx-auto h-screen shadow-2xl relative overflow-hidden flex flex-col">
      <main className="flex-1 overflow-hidden relative">
        {renderContent()}
      </main>
      
      {/* Show Nav on Home, History, Chat, Settings */}
      {(currentScreen === AppScreen.HOME || 
        currentScreen === AppScreen.HISTORY || 
        currentScreen === AppScreen.CHAT || 
        currentScreen === AppScreen.SETTINGS) && (
        <Navigation currentScreen={currentScreen} setScreen={setCurrentScreen} />
      )}
    </div>
  );
};

export default App;