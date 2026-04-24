import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  TrendingUp, 
  ChevronRight, 
  Filter,
  ArrowRight,
  GraduationCap,
  Search
} from 'lucide-react';
import { tools, Tool } from '../data/tools';
import { ToolCard, ToolDetailModal } from './ToolComponents';
import { cn } from '../lib/utils';
import { useCollections } from '../context/CollectionContext';

interface HomeFeedProps {
  activeCategory: string;
  searchQuery: string;
  userName: string;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({ activeCategory, searchQuery, userName }) => {
  const { collections } = useCollections();
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [skillFilter, setSkillFilter] = useState<'All' | 'Beginner' | 'Pro'>('All');
  const [compareTools, setCompareTools] = useState<Tool[]>([]);
  const [isCompareMode, setIsCompareMode] = useState(false);

  const toggleCompare = (tool: Tool) => {
    if (compareTools.find(t => t.id === tool.id)) {
      setCompareTools(compareTools.filter(t => t.id !== tool.id));
    } else if (compareTools.length < 2) {
      setCompareTools([...compareTools, tool]);
    }
  };

  const toolOfTheDay = useMemo(() => tools.find(t => t.isToolOfTheDay) || tools[0], []);
  const trendingTools = useMemo(() => tools.filter(t => t.isTrending), []);

  const filteredTools = useMemo(() => {
    const isCustomCollection = collections[activeCategory];
    
    return tools.filter(tool => {
      // If it's a custom collection, check if the tool is in that collection's tool_ids
      const matchesCategory = isCustomCollection 
        ? collections[activeCategory].includes(tool.id)
        : (activeCategory === 'Discover' || activeCategory === 'All' || tool.category === activeCategory);
        
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           tool.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSkill = skillFilter === 'All' || tool.skillLevel === skillFilter;
      return matchesCategory && matchesSearch && matchesSkill;
    });
  }, [activeCategory, searchQuery, skillFilter, collections]);

  return (
    <main className="flex-1 min-h-screen pt-16 pb-8 px-6 lg:ml-[200px] flex flex-col gap-6 overflow-hidden">
      <div className="max-w-6xl mx-auto w-full flex flex-col gap-6 h-full">
        
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-2"
        >
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-electric-blue to-violet bg-clip-text text-transparent">{userName || 'Explorer'}</span>.
          </h1>
          <p className="text-white/40 text-sm mt-1">Ready to find your next AI assistant?</p>
        </motion.div>

        {/* Tool of the Day Hero */}
        {activeCategory === 'Discover' && (
          <section className="h-[140px] rounded-2xl bg-gradient-to-br from-electric-blue/15 to-violet/15 border border-white/10 p-6 flex items-center justify-between relative overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,207,255,0.1)_0%,transparent_70%)] pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-1">Tool of the Day: {toolOfTheDay.name}</h2>
              <p className="text-[#9ca3af] text-sm">{toolOfTheDay.tagline} {toolOfTheDay.rating}/5 ★</p>
            </div>
            
            <button 
              onClick={() => setSelectedTool(toolOfTheDay)}
              className="sleek-btn px-6 py-2.5 text-sm relative z-10"
            >
              Launch Now
            </button>
          </section>
        )}

        {/* Trending Section */}
        {activeCategory === 'All' && trendingTools.length > 0 && (
          <section className="shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-electric-blue" />
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">Trending Tools</h3>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {trendingTools.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool)}
                  className="flex-shrink-0 flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-xl hover:bg-white/10 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 p-1.5 flex items-center justify-center">
                    <img src={tool.logo} alt={tool.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold group-hover:text-electric-blue transition-colors">{tool.name}</div>
                    <div className="text-[10px] text-white/40">{tool.category}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Tools Grid */}
        <section className="flex-1 overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            <AnimatePresence mode="popLayout">
              {filteredTools.map((tool) => (
                <ToolCard 
                  key={tool.id} 
                  tool={tool} 
                  onClick={() => setSelectedTool(tool)} 
                />
              ))}
            </AnimatePresence>
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-20 sleek-card border-dashed border-white/10">
              <Search className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <h4 className="text-xl font-display font-bold text-white/40">No tools found matching your search</h4>
              <button 
                onClick={() => { setSkillFilter('All'); }}
                className="mt-4 text-electric-blue font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>
      </div>

      <AnimatePresence>
        {selectedTool && (
          <ToolDetailModal 
            tool={selectedTool} 
            onClose={() => setSelectedTool(null)} 
          />
        )}
      </AnimatePresence>
    </main>
  );
};

const Star = ({ className, fill }: { className?: string; fill?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill={fill || "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
