import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { Navbar, Sidebar } from './components/Layout';
import { HomeFeed } from './components/HomeFeed';
import { AnimatePresence, motion } from 'motion/react';

import { CollectionProvider } from './context/CollectionContext';
import { ProfileModal } from './components/ProfileModal';

export default function App() {
  return (
    <CollectionProvider>
      <AppContent />
    </CollectionProvider>
  );
}

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userName, setUserName] = useState('EXPLORER');

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
    const savedName = localStorage.getItem('userName');
    if (savedName) setUserName(savedName);

    // Simulate initial load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  const updateProfile = (name: string) => {
    setUserName(name);
    localStorage.setItem('userName', name);
    setIsProfileOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-4xl font-display font-bold bg-gradient-to-r from-electric-blue to-violet bg-clip-text text-transparent mb-8"
        >
          TOOLVERSE
        </motion.div>
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-full h-full bg-gradient-to-r from-electric-blue to-violet"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoginPage onLogin={handleLogin} />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen flex flex-col overflow-hidden"
          >
            <Navbar 
              userName={userName}
              onLogout={handleLogout} 
              onProfileClick={() => setIsProfileOpen(true)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar 
                activeCategory={activeCategory} 
                setActiveCategory={setActiveCategory} 
              />
              <HomeFeed 
                activeCategory={activeCategory} 
                searchQuery={searchQuery}
                userName={userName}
              />
            </div>
            
            <ProfileModal 
              isOpen={isProfileOpen} 
              onClose={() => setIsProfileOpen(false)} 
              currentName={userName} 
              onUpdate={updateProfile} 
            />

            {/* Stat Bar */}
            <div className="h-8 px-6 bg-black/40 border-t border-white/5 flex items-center gap-6 text-[10px] uppercase tracking-wider text-[#4b5563] shrink-0">
              <div>20+ Tools Listed</div>
              <div>10 Categories</div>
              <div className="flex items-center gap-3">
                Trending now: 
                <span className="px-2 py-0.5 bg-white/5 rounded text-[#9ca3af]">Bolt.new</span>
                <span className="px-2 py-0.5 bg-white/5 rounded text-[#9ca3af]">n8n</span>
                <span className="px-2 py-0.5 bg-white/5 rounded text-[#9ca3af]">ElevenLabs</span>
              </div>
              <div className="ml-auto">Updated 2h ago</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
