import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  ExternalLink, 
  Heart, 
  Bookmark, 
  Share2, 
  CheckCircle2,
  X,
  Plus,
  FolderPlus,
  Info,
  Zap,
  Sparkles,
  DollarSign,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { Tool } from '../data/tools';
import { cn } from '../lib/utils';
import { useCollections } from '../context/CollectionContext';

interface ToolCardProps {
  tool: Tool;
  onClick: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {
  const { collections, addToolToCollection, removeToolFromCollection } = useCollections();
  const isBookmarked = Object.values(collections).some((ids: string[]) => ids.includes(tool.id));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative sleek-card overflow-hidden"
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <div className="w-10 h-10 rounded-lg bg-[#1f2937] flex items-center justify-center text-xl">
            <img src={tool.logo} alt={tool.name} className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
          </div>
          <span className={cn(
            "badge-sleek",
            tool.category === 'Coding' ? "bg-[#a855f7]/20 text-[#a855f7]" : 
            tool.category === 'Chat AI' ? "bg-[#10b981]/20 text-[#10b981]" : 
            tool.category === 'Deployment' ? "bg-[#00cfff]/20 text-[#00cfff]" :
            "bg-[#4b5563]/20 text-[#9ca3af]"
          )}>
            {tool.category}
          </span>
        </div>

        <div className="mb-3">
          <h3 className="text-base font-semibold mb-1">{tool.name}</h3>
          <p className="text-[#9ca3af] text-xs leading-relaxed h-[34px] overflow-hidden">
            {tool.tagline}
          </p>
        </div>

        <ul className="space-y-1 mb-4">
          {tool.advantages.slice(0, 2).map((adv, i) => (
            <li key={i} className="flex items-center gap-1.5 text-[11px] text-[#cbd5e1]">
              <div className="w-1 h-1 rounded-full bg-electric-blue" />
              {adv}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between pt-3 mt-auto border-t border-white/5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(tool.url, '_blank');
            }}
            className="sleek-btn px-3 py-1.5 text-xs"
          >
            Open Tool →
          </button>
          <div className="flex gap-3 text-[#6b7280] text-sm relative z-10">
            <button className="hover:text-red-400 transition-colors">❤️</button>
            <button 
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  if (isBookmarked) {
                    await removeToolFromCollection(tool.id, 'My Tools');
                  } else {
                    await addToolToCollection(tool.id, 'My Tools');
                  }
                } catch (err) {
                  console.error('Failed to update bookmark:', err);
                }
              }}
              className={cn("transition-colors", isBookmarked ? "text-violet" : "hover:text-violet")}
            >
              🔖
            </button>
            <button className="hover:text-white transition-colors">📤</button>
          </div>
        </div>
      </div>

      <button 
        onClick={onClick}
        className="absolute inset-0 z-0 cursor-pointer"
        aria-label={`View details for ${tool.name}`}
      />
    </motion.div>
  );
};

interface ToolDetailModalProps {
  tool: Tool | null;
  onClose: () => void;
}

export const ToolDetailModal: React.FC<ToolDetailModalProps> = ({ tool, onClose }) => {
  const { collections, addToolToCollection, createCollection } = useCollections();
  const [showCollectionMenu, setShowCollectionMenu] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  if (!tool) return null;

  const handleCreateAndAdd = async () => {
    if (!newCollectionName.trim()) return;
    try {
      await createCollection(newCollectionName);
      await addToolToCollection(tool.id, newCollectionName);
      setNewCollectionName('');
      setShowCollectionMenu(false);
    } catch (err) {
      console.error('Failed to create and add to collection:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass rounded-[2.5rem] shadow-2xl shadow-electric-blue/10"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-all z-10"
        >
          <X className="w-6 h-6 text-white/40" />
        </button>

        <div className="p-8 sm:p-12">
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] bg-white/5 p-6 flex items-center justify-center border border-white/10">
              <img src={tool.logo} alt={tool.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-electric-blue/10 text-electric-blue text-xs font-bold uppercase tracking-wider">
                  {tool.category}
                </span>
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                  tool.skillLevel === 'Beginner' ? "bg-emerald/10 text-emerald" : "bg-violet/10 text-violet"
                )}>
                  {tool.skillLevel}
                </span>
                <div className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full text-xs font-bold text-white/60">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  {tool.rating}
                </div>
              </div>
              <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4">{tool.name}</h2>
              <p className="text-xl text-white/60 font-medium">{tool.tagline}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h4 className="text-sm font-bold text-white/30 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4" /> About the Tool
                </h4>
                <p className="text-lg text-white/80 leading-relaxed">
                  {tool.description}
                </p>
              </section>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <section>
                  <h4 className="text-sm font-bold text-white/30 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-electric-blue" /> Key Advantages
                  </h4>
                  <ul className="space-y-3">
                    {tool.advantages.map((adv, i) => (
                      <li key={i} className="flex items-start gap-3 text-white/70">
                        <CheckCircle2 className="w-5 h-5 text-electric-blue shrink-0 mt-0.5" />
                        {adv}
                      </li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h4 className="text-sm font-bold text-white/30 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet" /> Best Use Cases
                  </h4>
                  <ul className="space-y-3">
                    {tool.useCases.map((use, i) => (
                      <li key={i} className="flex items-start gap-3 text-white/70">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet shrink-0 mt-2.5" />
                        {use}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <section className="bg-emerald/5 p-6 rounded-3xl border border-emerald/10">
                  <h4 className="text-sm font-bold text-emerald uppercase tracking-[0.2em] mb-4">Pros</h4>
                  <ul className="space-y-2">
                    {tool.pros.map((pro, i) => (
                      <li key={i} className="text-sm text-white/60 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-emerald" /> {pro}
                      </li>
                    ))}
                  </ul>
                </section>
                <section className="bg-red-400/5 p-6 rounded-3xl border border-red-400/10">
                  <h4 className="text-sm font-bold text-red-400 uppercase tracking-[0.2em] mb-4">Cons</h4>
                  <ul className="space-y-2">
                    {tool.cons.map((con, i) => (
                      <li key={i} className="text-sm text-white/60 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-red-400" /> {con}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>

            <div className="space-y-8">
              <div className="glass p-8 rounded-[2rem] border-white/5 space-y-6">
                <div>
                  <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2">Pricing Tier</h4>
                  <div className="flex items-center gap-2 text-xl font-bold text-white">
                    <DollarSign className="w-5 h-5 text-emerald" />
                    {tool.pricing}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2">Security</h4>
                  <div className="flex items-center gap-2 text-sm font-medium text-white/70">
                    <ShieldCheck className="w-4 h-4 text-electric-blue" />
                    Verified Tool
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button 
                    onClick={() => window.open(tool.url, '_blank')}
                    className="w-full bg-gradient-to-r from-electric-blue to-violet py-4 rounded-2xl font-bold shadow-lg shadow-electric-blue/20 hover:shadow-electric-blue/40 transition-all flex items-center justify-center gap-2"
                  >
                    Launch Tool <ExternalLink className="w-4 h-4" />
                  </button>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setShowCollectionMenu(!showCollectionMenu)}
                      className="w-full bg-white/5 border border-white/10 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      <Bookmark className="w-4 h-4" /> Save to Collection
                    </button>

                    <AnimatePresence>
                      {showCollectionMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute bottom-full left-0 right-0 mb-2 bg-[#1a1a1f] border border-white/10 rounded-2xl p-4 shadow-2xl z-50"
                        >
                          <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar mb-4">
                            {Object.keys(collections).map(name => (
                              <button
                                key={name}
                                onClick={async () => {
                                  try {
                                    await addToolToCollection(tool.id, name);
                                    setShowCollectionMenu(false);
                                  } catch (err) {
                                    console.error('Failed to add to collection:', err);
                                  }
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-sm flex items-center justify-between group"
                              >
                                <span className="text-white/60 group-hover:text-white">{name}</span>
                                {collections[name].includes(tool.id) && <CheckCircle2 className="w-4 h-4 text-electric-blue" />}
                              </button>
                            ))}
                          </div>
                          <div className="pt-3 border-t border-white/5 flex gap-2">
                            <input 
                              type="text" 
                              placeholder="New collection..."
                              value={newCollectionName}
                              onChange={(e) => setNewCollectionName(e.target.value)}
                              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-electric-blue/50"
                            />
                            <button 
                              onClick={handleCreateAndAdd}
                              className="p-1.5 bg-electric-blue text-black rounded-lg hover:scale-105 transition-transform"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="glass p-6 rounded-[2rem] border-white/5">
                <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Share with friends</h4>
                <div className="flex gap-2">
                  {[Share2, Heart, MessageSquare].map((Icon, i) => (
                    <button key={i} className="flex-1 py-3 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-all">
                      <Icon className="w-4 h-4 text-white/60" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
