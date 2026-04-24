import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutGrid, 
  PenTool, 
  Code2, 
  Video, 
  Search, 
  Zap, 
  MessageSquare,
  Sparkles,
  TrendingUp,
  GraduationCap,
  Bookmark,
  User,
  LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeCategory, setActiveCategory }) => {
  const categories = [
    { name: 'Discover', icon: LayoutGrid },
    { name: 'Coding', icon: Code2 },
    { name: 'Writing', icon: PenTool },
    { name: 'Design', icon: Sparkles },
    { name: 'Video', icon: Video },
    { name: 'Research', icon: Search },
    { name: 'Deployment', icon: Zap },
    { name: 'Chat AI', icon: MessageSquare },
  ];

  const studentFeatures = [
    { name: 'My Tools', icon: Bookmark, color: 'text-electric-blue' },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 sleek-sidebar hidden lg:flex flex-col p-6 z-20">
      <div className="space-y-1 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={cn(
              "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group",
              activeCategory === cat.name 
                ? "bg-electric-blue/10 text-electric-blue font-bold" 
                : "text-[#9ca3af] hover:text-white hover:bg-white/5"
            )}
          >
            <cat.icon className={cn("w-4 h-4 transition-colors", activeCategory === cat.name ? "text-electric-blue" : "group-hover:text-white/60")} />
            {cat.name}
          </button>
        ))}
      </div>

      <div className="space-y-1">
        {studentFeatures.map((feat) => (
          <button
            key={feat.name}
            onClick={() => setActiveCategory(feat.name)}
            className={cn(
              "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group",
              activeCategory === feat.name 
                ? "bg-white/10 text-white font-bold" 
                : "text-[#9ca3af] hover:text-white hover:bg-white/5"
            )}
          >
            <feat.icon className={cn("w-4 h-4", feat.color)} />
            {feat.name}
          </button>
        ))}
      </div>
    </aside>
  );
};

interface NavbarProps {
  userName: string;
  onLogout: () => void;
  onProfileClick: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ userName, onLogout, onProfileClick, searchQuery, setSearchQuery }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 sleek-nav px-6 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <motion.div 
          onClick={() => window.location.reload()}
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-full h-full transform -rotate-12 group-hover:rotate-0 transition-transform duration-500" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" fill="url(#eagle-grad)" />
              <path d="M12 2L10 10L12 12L14 10L12 2Z" fill="#004e92" opacity="0.6" />
              <defs>
                <linearGradient id="eagle-grad" x1="12" y1="2" x2="12" y2="21" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00cfff" />
                  <stop offset="1" stopColor="#004e92" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="text-[22px] font-extrabold bg-gradient-to-r from-electric-blue to-violet bg-clip-text text-transparent tracking-tighter">
            TOOLVERSE
          </span>
        </motion.div>

        <div className="relative hidden md:block w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for AI tools (Coding, Design, Chat...)"
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-11 pr-4 text-sm text-[#9ca3af] focus:outline-none focus:border-electric-blue/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-4 text-[#9ca3af]">
          <button className="hover:text-white transition-colors">🔔</button>
          <button className="hover:text-white transition-colors">🔖</button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 ml-2 group cursor-pointer" onClick={onProfileClick}>
            <span className="text-[11px] font-bold text-white/40 group-hover:text-white transition-colors uppercase tracking-wider">{userName}</span>
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-electric-blue to-violet flex items-center justify-center text-[10px] text-white font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
        <div className="h-6 w-[1px] bg-white/10"></div>
        <button 
          onClick={onLogout}
          className="text-xs font-bold text-white/40 hover:text-red-400 transition-all"
        >
          LOGOUT
        </button>
      </div>
    </nav>
  );
};
