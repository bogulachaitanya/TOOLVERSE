import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface CollectionContextType {
  collections: Record<string, string[]>;
  addToolToCollection: (toolId: string, collectionName: string) => Promise<void>;
  createCollection: (name: string) => Promise<void>;
  removeToolFromCollection: (toolId: string, collectionName: string) => Promise<void>;
  isLoading: boolean;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

// Use the logged in user's email or a default for persistence
const getUserId = () => localStorage.getItem('userEmail') || 'anonymous-user';

export const CollectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collections, setCollections] = useState<Record<string, string[]>>({ 'My Tools': [] });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch collections from Supabase on mount
  useEffect(() => {
    const fetchCollections = async () => {
      const userId = getUserId();
      try {
        const { data, error } = await supabase
          .from('collections')
          .select('name, tool_ids')
          .eq('user_id', userId);

        if (error) throw error;

        if (data && data.length > 0) {
          const formatted = data.reduce((acc, curr) => {
            acc[curr.name] = curr.tool_ids || [];
            return acc;
          }, {} as Record<string, string[]>);
          setCollections(formatted);
        } else {
          // Initialize default collection if none exists
          await supabase.from('collections').insert([
            { name: 'My Tools', tool_ids: [], user_id: userId }
          ]);
        }
      } catch (err) {
        console.error('Error fetching collections:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const addToolToCollection = async (toolId: string, collectionName: string) => {
    const userId = getUserId();
    const currentTools = collections[collectionName] || [];
    if (currentTools.includes(toolId)) return;

    const newTools = [...currentTools, toolId];
    
    try {
      const { error } = await supabase
        .from('collections')
        .upsert({ 
          name: collectionName, 
          tool_ids: newTools, 
          user_id: userId 
        }, { onConflict: 'name,user_id' });

      if (error) throw error;
      
      setCollections(prev => ({
        ...prev,
        [collectionName]: newTools
      }));
    } catch (err) {
      console.error('Error adding tool to collection:', err);
    }
  };

  const createCollection = async (name: string) => {
    const userId = getUserId();
    if (collections[name]) return;

    try {
      const { error } = await supabase
        .from('collections')
        .insert([{ name, tool_ids: [], user_id: userId }]);

      if (error) throw error;

      setCollections(prev => ({
        ...prev,
        [name]: []
      }));
    } catch (err) {
      console.error('Error creating collection:', err);
    }
  };

  const removeToolFromCollection = async (toolId: string, collectionName: string) => {
    const userId = getUserId();
    const currentTools = collections[collectionName] || [];
    const newTools = currentTools.filter(id => id !== toolId);

    try {
      const { error } = await supabase
        .from('collections')
        .update({ tool_ids: newTools })
        .eq('name', collectionName)
        .eq('user_id', userId);

      if (error) throw error;

      setCollections(prev => ({
        ...prev,
        [collectionName]: newTools
      }));
    } catch (err) {
      console.error('Error removing tool from collection:', err);
    }
  };

  return (
    <CollectionContext.Provider value={{ collections, addToolToCollection, createCollection, removeToolFromCollection, isLoading }}>
      {children}
    </CollectionContext.Provider>
  );
};

export const useCollections = () => {
  const context = useContext(CollectionContext);
  if (!context) throw new Error('useCollections must be used within a CollectionProvider');
  return context;
};
