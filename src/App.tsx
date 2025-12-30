import { useState, useEffect } from 'react';
import { Scroll, Sparkles, Package, Trophy, ArrowLeft, Mail, LogOut } from 'lucide-react';
import { QuestsScreen } from './components/QuestsScreen';
import { BannerScreen } from './components/BannerScreen';
import { ObjectsScreen } from './components/ObjectsScreen';
import { AchievementsScreen } from './components/AchievementsScreen';
import { WishResultScreen } from './components/WishResultScreen';
import { SelectionScreen } from './components/SelectionScreen';
import { AdminScreen } from './components/AdminScreen';
import { OpeningCutscene } from './components/OpeningCutscene';
import { EpilogueScreen } from './components/EpilogueScreen';
import { MessagesScreen, type Message } from './components/MessagesScreen';
import { AuthScreen } from './components/AuthScreen';
import * as api from './utils/api';

type Screen = 'quests' | 'banner' | 'objects' | 'achievements' | 'messages';
type AppMode = 'auth' | 'cutscene' | 'selection' | 'public' | 'admin' | 'loading';

interface QuestTask {
  id: number;
  description: string;
  completed: boolean;
}

interface Quest {
  id: number;
  title: string;
  description: string;
  location: string;
  rewards: string[];
  progress: number;
  difficulty: number;
  type: 'main' | 'side' | 'commission';
  completed: boolean;
  tasks: QuestTask[];
  lore?: string;
  rewardTypes?: ('currency' | 'weapon' | 'artifact' | 'material')[];
}

const initialQuestsData: Quest[] = [
  {
    id: 1,
    title: "The Outlander Who Caught the Wind",
    description: "Search for answers about your lost sibling in the vast world of Teyvat.",
    location: "Mondstadt",
    rewards: ["Adventure EXP x500", "Primogems x60", "Mora x20,000"],
    progress: 0,
    difficulty: 5,
    type: 'main',
    completed: false,
    lore: "Long ago, twin travelers descended from beyond the stars, only to be separated by an unknown god at the moment of their arrival. Now, as you awaken in this new world, the wind carries whispers of your sibling's presence. The Anemo Archon's blessing guides your path, but the truth you seek may be more complex than the simple reunion you yearn for. In Mondstadt, the City of Freedom, your journey truly begins.",
    tasks: [
      { id: 1, description: "Talk to the Knights of Favonius", completed: false },
      { id: 2, description: "Investigate the Statue of The Seven", completed: false },
      { id: 3, description: "Defeat the Ruin Guard", completed: false },
      { id: 4, description: "Return to Jean", completed: false }
    ]
  },
  {
    id: 2,
    title: "Dragon Storm",
    description: "Investigate the strange disturbances affecting Stormterror's Lair.",
    location: "Stormterror's Lair",
    rewards: ["Adventure EXP x300", "Primogems x40"],
    progress: 0,
    difficulty: 4,
    type: 'main',
    completed: false,
    lore: "Dvalin, once one of the Four Winds of Mondstadt, has been corrupted by the Abyss Order's influence. The dragon who once protected the city now terrorizes it, driven mad by poisonous blood and centuries of betrayal. Within the ruins of Old Mondstadt, where wind and time have worn away all but memory, the truth of Dvalin's corruption awaits. Can the bond between dragon and city be restored, or has too much been lost to the winds of time?",
    tasks: [
      { id: 1, description: "Enter Stormterror's Lair", completed: false },
      { id: 2, description: "Clear the area of monsters", completed: false },
      { id: 3, description: "Activate the wind current", completed: false },
      { id: 4, description: "Reach the summit", completed: false },
      { id: 5, description: "Confront Stormterror", completed: false }
    ]
  },
  {
    id: 3,
    title: "Mondstadt's Vigilant Protector",
    description: "Help the Knights of Favonius patrol the city perimeter.",
    location: "Mondstadt City",
    rewards: ["Adventure EXP x100", "Mora x10,000"],
    progress: 0,
    difficulty: 2,
    type: 'commission',
    completed: false,
    lore: "The Knights of Favonius stand as Mondstadt's first line of defense against the threats that lurk beyond the city walls. Though Grand Master Varka has taken most of the knights on an expedition, those who remain are no less dedicated to their duty. Every patrol, every watch, every small act of vigilance helps maintain the freedom and safety that Mondstadt holds dear.",
    tasks: [
      { id: 1, description: "Patrol the city gates", completed: false },
      { id: 2, description: "Defeat slimes near the bridge", completed: false },
      { id: 3, description: "Report back to Huffman", completed: false }
    ]
  },
  {
    id: 4,
    title: "Lost Treasures of the Vale",
    description: "Discover ancient artifacts hidden throughout Brightcrown Canyon.",
    location: "Brightcrown Canyon",
    rewards: ["Adventure EXP x200", "Hero's Wit x3"],
    progress: 0,
    difficulty: 3,
    type: 'side',
    completed: false,
    lore: "Before Mondstadt was the City of Freedom, before the age of Barbatos, ancient civilizations thrived in these lands. Their ruins now dot the landscape, holding secrets and treasures from an age long forgotten. Brightcrown Canyon, with its towering spires and hidden chambers, was once a sacred site. The treasures within are not mere gold and jewels, but fragments of knowledge from a time when gods walked more freely among mortals.",
    tasks: [
      { id: 1, description: "Find the first treasure chest", completed: false },
      { id: 2, description: "Solve the elemental puzzle", completed: false },
      { id: 3, description: "Defeat the treasure hoarders", completed: false },
      { id: 4, description: "Locate the ancient ruins", completed: false },
      { id: 5, description: "Unlock the sealed door", completed: false },
      { id: 6, description: "Claim the treasure", completed: false },
      { id: 7, description: "Return the artifact to Lisa", completed: false }
    ]
  }
];

type ItemType = 'weapon' | 'artifact' | 'currency' | 'material';

interface Item {
  id: number;
  name: string;
  type: ItemType;
  rarity: number;
  level?: number;
  quantity?: number;
  description: string;
  image: string;
  element?: 'anemo' | 'geo' | 'pyro' | 'hydro' | 'cryo' | 'electro' | 'dendro';
}

const initialInventoryData: Item[] = [
  {
    id: 1,
    name: "Skyward Blade",
    type: 'weapon',
    rarity: 5,
    level: 70,
    description: "A sword that symbolizes the noble Anemo winds.",
    image: 'https://images.unsplash.com/photo-1757083840090-17a7bfca08c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpZXZhbCUyMHN3b3JkJTIwd2VhcG9ufGVufDF8fHx8MTc2NTA1MzA1M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    element: 'anemo'
  },
  {
    id: 2,
    name: "Gladiator's Finale",
    type: 'artifact',
    rarity: 5,
    description: "A circlet that once belonged to a legendary gladiator.",
    image: 'https://images.unsplash.com/photo-1743448111530-3654e7b66f26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWdpY2FsJTIwY3J5c3RhbCUyMGdlbXxlbnwxfHx8fDE3NjUxMTYyNjF8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 3,
    name: "Primogems",
    type: 'currency',
    rarity: 5,
    quantity: 1280,
    description: "A primordial crystalline gem that's beyond the understanding of the mortal realm.",
    image: 'https://images.unsplash.com/photo-1743448111530-3654e7b66f26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWdpY2FsJTIwY3J5c3RhbCUyMGdlbXxlbnwxfHx8fDE3NjUxMTYyNjF8MA&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>('loading');
  const [activeScreen, setActiveScreen] = useState<Screen>('quests');
  const [quests, setQuests] = useState<Quest[]>(initialQuestsData);
  const [inventory, setInventory] = useState<Item[]>(initialInventoryData);
  const [showWishResult, setShowWishResult] = useState(false);
  const [showEpilogue, setShowEpilogue] = useState(false);
  const [showPrologue, setShowPrologue] = useState(false);
  const [wishType, setWishType] = useState<'1' | '10'>('1');
  const [isInitialized, setIsInitialized] = useState(false);
  const [prologueWatched, setPrologueWatched] = useState(false);
  
  // Track player stats
  const [adventureExp, setAdventureExp] = useState(0);
  const [primogems, setPrimogems] = useState(2025);
  const [mora, setMora] = useState(50000);
  
  // Narrative texts
  const [prologueText, setPrologueText] = useState(`Welcome to a Co-Op Journey Written in the Language of Stars.

In a quiet corner of the world, two travelers meet—not at the end of a quest, but at the beginning of one. The path ahead is stitched with lanternlight cafés, hidden bookshops, neon arcades, and the quiet hush of forest trails.

This record is not a duty, nor a binding oath—
but a remembrance of shared wonder.

Let the journey begin.`);

  const [epilogueText, setEpilogueText] = useState(`EPILOGUE: SOULBOUND

There are meetings that feel like accident,
and there are the ones that carry the quiet weight of orchestration.

Two paths, far-flung across years and cities,
somehow converging at the exact hinge of time
where both hearts are finally able to recognize each other.

Not by chance.
Not by alignment of personality or preference,
but by the slow architecture of God —
a timing written before either of you could name longing.

Across the wide cosmos of possibility,
through all the iterations of who you might have become,
you still arrived here, simultaneously, with enough softness and enough courage
to walk in step.

The quests were never the goal,
only the scaffolding that allowed you to witness each other: unhurried, unperformed, alive.

What began as play became pilgrimage, not because of intensity or declaration, but because something holy took root without needing spotlight or spectacle.

All achievements now complete, all maps inked to their edges— and yet the horizon has only just opened.

You stand at the edge of an uncharted expanse, not bound by expectation, but invited:

further into story, further into wonder, further into the divine logic that stitched two timelines together with no rush and no error.

Soulbound is not finality.
It is the doorway.

Across universes,
across what-ifs and almosts,
across the infinite permutations of living—

you still would have found each other.
For such a time as this.

So close the log, not because adventure has ended, but because the world has widened.

A lifetime of quests remains—
holy, ordinary, luminous.

The page turns.

A new map waits.

SOULBOUND,
and now
released to explore.`);

  // Messages
  const [messages, setMessages] = useState<Message[]>([]);

  // Music URLs for narratives
  const [prologueMusicUrl, setPrologueMusicUrl] = useState('');
  const [epilogueMusicUrl, setEpilogueMusicUrl] = useState('');

  // Initialize app and check auth
  useEffect(() => {
    async function initialize() {
      try {
        console.log('🚀 Initializing Soulbound...');
        
        // Check for existing session
        const sessionCheck = await api.checkSession();
        
        if (!sessionCheck.isAuthenticated) {
          // No session - show auth screen
          console.log('❌ No active session - showing auth screen');
          setAppMode('auth');
          setIsInitialized(true);
          return;
        }
        
        console.log('✅ User authenticated:', sessionCheck.user?.email);
        
        // Load global config (narratives, quest templates, etc.) - affects all users
        let globalConfig = { narratives: null, questTemplates: null, inventoryTemplates: null };
        try {
          globalConfig = await api.fetchGlobalConfig();
          if (globalConfig.narratives) {
            setPrologueText(globalConfig.narratives.prologue);
            setEpilogueText(globalConfig.narratives.epilogue);
          }
        } catch (error) {
          console.warn('⚠️ Could not load global config, using defaults:', error);
        }
        
        // Load user-specific data (quest progress, inventory)
        let userData = { quests: null, inventory: null, currencies: null, messages: null, flags: null };
        try {
          userData = await api.fetchUserData();
        } catch (error) {
          console.warn('⚠️ Could not load user data, using defaults:', error);
        }
        
        // Use global quest templates if available, otherwise use initial data
        const questTemplates = globalConfig.questTemplates || initialQuestsData;
        const inventoryTemplates = globalConfig.inventoryTemplates || initialInventoryData;
        
        console.log('📊 Quest templates to use:', questTemplates);
        console.log('📊 Inventory templates to use:', inventoryTemplates);
        
        // Apply loaded data if it exists, otherwise use global templates
        if (userData.quests && Array.isArray(userData.quests) && userData.quests.length > 0) {
          // User has saved quest progress - use it
          const mergedQuests = userData.quests.map(loadedQuest => {
            const templateQuest = questTemplates.find(q => q.id === loadedQuest.id);
            return {
              ...loadedQuest,
              lore: loadedQuest.lore || templateQuest?.lore // Add lore if missing
            };
          });
          console.log('✅ Loaded user quest progress:', mergedQuests.length, 'quests');
          setQuests(mergedQuests);
        } else {
          // New user or no saved progress - use global templates
          console.log('📋 Using quest templates for new user:', questTemplates.length, 'quests');
          setQuests(questTemplates);
        }
        
        if (userData.inventory && Array.isArray(userData.inventory) && userData.inventory.length > 0) {
          console.log('✅ Loaded user inventory:', userData.inventory.length, 'items');
          setInventory(userData.inventory);
        } else {
          // New user - use global inventory templates
          console.log('📦 Using inventory templates for new user:', inventoryTemplates.length, 'items');
          setInventory(inventoryTemplates);
        }
        if (userData.currencies) {
          setMora(userData.currencies.mora || 50000);
          setPrimogems(userData.currencies.primogems || 2025);
          setAdventureExp(userData.currencies.adventureExp || 0);
        }
        if (userData.messages && Array.isArray(userData.messages)) {
          setMessages(userData.messages);
        }
        if (userData.flags) {
          if (userData.flags.prologueWatched) {
            setPrologueWatched(true);
            localStorage.setItem('soulbound_seen_cutscene', 'true');
          }
        }
        
        setIsInitialized(true);
        
        // Check prologue status from CLOUD DATA (not localStorage)
        // This ensures new accounts always see the prologue
        const cloudPrologueWatched = userData.flags?.prologueWatched || false;
        console.log('Initialization: cloudPrologueWatched =', cloudPrologueWatched);
        
        if (cloudPrologueWatched) {
          setPrologueWatched(true);
          localStorage.setItem('soulbound_seen_cutscene', 'true');
          setAppMode('selection');
        } else {
          // New user or hasn't watched prologue yet
          setPrologueWatched(false);
          localStorage.removeItem('soulbound_seen_cutscene');
          setAppMode('cutscene');
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
        // Show auth screen on error
        setAppMode('auth');
        setIsInitialized(true);
      }
    }
    
    initialize();
  }, []);

  // Auto-save narratives to cloud when they change (global data)
  useEffect(() => {
    if (!isInitialized) return; // Don't save during initial load
    
    const saveNarratives = async () => {
      try {
        await api.saveNarratives(prologueText, epilogueText);
        console.log('Narratives auto-saved to cloud');
      } catch (error) {
        console.error('Failed to auto-save narratives:', error);
      }
    };
    
    // Debounce the save to avoid too many API calls
    const timeoutId = setTimeout(saveNarratives, 1000);
    return () => clearTimeout(timeoutId);
  }, [prologueText, epilogueText, isInitialized]);

  // Auto-save global quest and inventory templates when in admin mode
  useEffect(() => {
    if (!isInitialized) return; // Don't save during initial load
    if (appMode !== 'admin') return; // Only save when in admin mode
    
    const saveGlobalTemplates = async () => {
      try {
        await api.saveGlobalQuests(quests);
        await api.saveGlobalInventory(inventory);
        console.log('✅ Global templates auto-saved to cloud');
      } catch (error) {
        console.error('Failed to auto-save global templates:', error);
      }
    };
    
    // Debounce the save to avoid too many API calls
    const timeoutId = setTimeout(saveGlobalTemplates, 2000);
    return () => clearTimeout(timeoutId);
  }, [quests, inventory, appMode, isInitialized]);

  // 🔥 AUTO-SAVE ALL USER PROGRESS TO CLOUD 🔥
  useEffect(() => {
    if (!isInitialized) return; // Don't save during initial load
    
    const saveProgress = async () => {
      try {
        await api.saveUserProgress({
          quests,
          inventory,
          currencies: { mora, primogems, adventureExp },
          messages,
          flags: { prologueWatched }
        });
      } catch (error) {
        console.error('Failed to auto-save progress:', error);
      }
    };
    
    // Debounce to avoid too many API calls (save after 2 seconds of inactivity)
    const timeoutId = setTimeout(saveProgress, 2000);
    return () => clearTimeout(timeoutId);
  }, [quests, inventory, mora, primogems, adventureExp, messages, prologueWatched, isInitialized]);

  // Parse reward strings and add to inventory
  const addRewardsToInventory = (rewards: string[], rewardTypes?: ('currency' | 'weapon' | 'artifact' | 'material')[]) => {
    const newItems: Item[] = [];
    
    console.log('🎁 Adding rewards:', rewards);

    rewards.forEach((reward, index) => {
      // Parse reward string (e.g., "Primogems x60", "Adventure EXP x500")
      const match = reward.match(/(.+?)\s*x([\d,]+)/);
      if (match) {
        const [, itemName, quantityStr] = match;
        const quantity = parseInt(quantityStr.replace(/,/g, ''));
        const cleanName = itemName.trim();

        console.log(`  - Processing reward: ${cleanName} x${quantity}`);

        // Update player stats for tracked currencies
        if (cleanName === 'Adventure EXP') {
          setAdventureExp(prev => {
            console.log(`    ✅ Adventure EXP: ${prev} → ${prev + quantity}`);
            return prev + quantity;
          });
        } else if (cleanName === 'Primogems') {
          setPrimogems(prev => {
            console.log(`    ✅ Primogems: ${prev} → ${prev + quantity}`);
            return prev + quantity;
          });
        } else if (cleanName === 'Mora') {
          setMora(prev => {
            console.log(`    ✅ Mora: ${prev} → ${prev + quantity}`);
            return prev + quantity;
          });
        }

        // Get item type from rewardTypes or default based on name
        const itemType: ItemType = rewardTypes?.[index] || 
          (cleanName.includes('EXP') || cleanName.includes('Mora') || cleanName.includes('Primogems') 
            ? 'currency' 
            : cleanName.includes('Ore') || cleanName.includes('Wit')
            ? 'material'
            : cleanName.includes('Fate')
            ? 'material'
            : 'material');

        // Store info for inventory update
        newItems.push({
          name: cleanName,
          type: itemType,
          quantity: quantity
        } as any);
      }
    });

    // Update inventory with functional setState to avoid stale state
    if (newItems.length > 0) {
      setInventory(prev => {
        const updatedInventory = [...prev];
        let nextId = Math.max(...prev.map(i => i.id), 0) + 1;

        newItems.forEach(newItem => {
          // Check if item already exists in inventory
          const existingItemIndex = updatedInventory.findIndex(
            item => item.name.toLowerCase() === newItem.name.toLowerCase()
          );

          if (existingItemIndex !== -1) {
            // Update existing item quantity
            console.log(`    📦 Updating existing item: ${newItem.name} +${newItem.quantity}`);
            updatedInventory[existingItemIndex] = {
              ...updatedInventory[existingItemIndex],
              quantity: (updatedInventory[existingItemIndex].quantity || 0) + newItem.quantity
            };
          } else {
            // Add new item
            console.log(`    ✨ Adding new item: ${newItem.name} x${newItem.quantity}`);
            updatedInventory.push({
              id: nextId++,
              name: newItem.name,
              type: newItem.type,
              rarity: 3,
              quantity: newItem.quantity,
              description: `Obtained from completing quests.`,
              image: 'https://images.unsplash.com/photo-1743448111530-3654e7b66f26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWdpY2FsJTIwY3J5c3RhbCUyMGdlbXxlbnwxfHx8fDE3NjUxMTYyNjF8MA&ixlib=rb-4.1.0&q=80&w=1080'
            });
          }
        });

        return updatedInventory;
      });
    }
  };

  // Monitor quest completions and add rewards
  const updateQuests = (updater: React.SetStateAction<Quest[]>) => {
    setQuests(prevQuests => {
      const oldQuests = prevQuests;
      const newQuests = typeof updater === 'function' ? updater(prevQuests) : updater;

      // Check for newly completed quests by comparing with old state by ID
      newQuests.forEach((newQuest) => {
        const oldQuest = oldQuests.find(q => q.id === newQuest.id);
        if (oldQuest && !oldQuest.completed && newQuest.completed) {
          // Quest just completed, add rewards
          console.log(`✨ Quest completed: ${newQuest.title}`);
          addRewardsToInventory(newQuest.rewards, newQuest.rewardTypes);
        }
      });

      return newQuests;
    });
  };

  const handleWish = (type: '1' | '10') => {
    setWishType(type);
    setShowWishResult(true); // Show results directly
  };

  const handleQuestUnlocked = (newQuest: Quest) => {
    setQuests(prevQuests => {
      // Check if quest already exists
      const exists = prevQuests.some(q => q.id === newQuest.id);
      if (exists) {
        return prevQuests;
      }
      return [...prevQuests, newQuest];
    });
  };

  const handleCloseWishResult = () => {
    setShowWishResult(false);
    setActiveScreen('quests');
  };

  const handleResetQuests = () => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      '⚠️ FACTORY RESET WARNING ⚠️\n\n' +
      'This will permanently delete ALL your progress including:\n' +
      '• All quest progress\n' +
      '• All inventory items\n' +
      '• All currencies (Mora, Primogems, Adventure EXP)\n' +
      '• All messages\n' +
      '• Prologue watch status\n\n' +
      'This action CANNOT be undone!\n\n' +
      'Are you absolutely sure you want to continue?'
    );

    if (!confirmed) {
      return; // User cancelled
    }

    console.log('🔄 Performing factory reset...');

    // Reset all quests to initial state
    setQuests(initialQuestsData);
    
    // Reset all inventory to initial state
    setInventory(initialInventoryData);
    
    // Reset all currencies
    setAdventureExp(0);
    setPrimogems(2025);
    setMora(50000);
    
    // Reset all messages
    setMessages([]);
    
    // Reset prologue watched status
    setPrologueWatched(false);
    localStorage.removeItem('soulbound_seen_cutscene');
    
    // Reset epilogue and any other flags
    setShowEpilogue(false);
    setShowPrologue(false);
    
    // Reset data in backend as well
    api.resetUserData().catch(error => {
      console.error('Failed to reset backend data:', error);
    });

    console.log('✅ Factory reset complete!');
    
    // Show confirmation
    alert('Factory reset complete! All data has been restored to defaults.');
  };

  const handleSelectMode = (mode: 'public' | 'admin') => {
    setAppMode(mode);
  };

  const handleExitAdmin = () => {
    setAppMode('selection');
  };

  const handleLogout = () => {
    api.signOut().then(() => {
      // Clear all local state
      setQuests(initialQuestsData);
      setInventory(initialInventoryData);
      setAdventureExp(0);
      setPrimogems(2025);
      setMora(50000);
      setMessages([]);
      setPrologueWatched(false);
      localStorage.removeItem('soulbound_seen_cutscene');
      setAppMode('auth');
    }).catch(error => {
      console.error('Failed to logout:', error);
      alert('Failed to logout. Please try again.');
    });
  };

  // Show loading screen
  if (appMode === 'loading') {
    return (
      <div className="w-full max-w-[412px] mx-auto h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0f0f1e] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#4a90e2]/30 border-t-[#4a90e2] rounded-full animate-spin" />
          <p className="text-white/60">Loading your journey...</p>
        </div>
      </div>
    );
  }

  // Show auth screen
  if (appMode === 'auth') {
    return (
      <div className="w-full max-w-[412px] mx-auto h-screen">
        <AuthScreen onAuthSuccess={(user) => {
          console.log('User authenticated:', user);
          // Re-initialize to load user data
          window.location.reload(); // Simple reload to re-run initialization
        }} />
      </div>
    );
  }

  // Show opening cutscene
  if (appMode === 'cutscene') {
    return (
      <div className="w-full max-w-[412px] mx-auto h-screen">
        <OpeningCutscene 
          onComplete={() => {
            setPrologueWatched(true);
            setAppMode('selection');
          }} 
          prologueText={prologueText}
          prologueMusicUrl={prologueMusicUrl}
        />
      </div>
    );
  }

  // Show selection screen
  if (appMode === 'selection') {
    const currentUser = api.getCurrentUser();
    return (
      <div className="w-full max-w-[412px] mx-auto h-screen">
        <SelectionScreen 
          onSelectMode={handleSelectMode}
          userEmail={currentUser?.email}
        />
      </div>
    );
  }

  // Show admin screen
  if (appMode === 'admin') {
    return (
      <div className="w-full max-w-[412px] mx-auto h-screen">
        <AdminScreen 
          quests={quests}
          setQuests={setQuests}
          inventory={inventory}
          setInventory={setInventory}
          prologueText={prologueText}
          setPrologueText={setPrologueText}
          epilogueText={epilogueText}
          setEpilogueText={setEpilogueText}
          messages={messages}
          setMessages={setMessages}
          prologueMusicUrl={prologueMusicUrl}
          setPrologueMusicUrl={setPrologueMusicUrl}
          epilogueMusicUrl={epilogueMusicUrl}
          setEpilogueMusicUrl={setEpilogueMusicUrl}
          onExit={handleExitAdmin}
        />
      </div>
    );
  }

  // Show public app
  return (
    <div className="w-full max-w-[412px] mx-auto h-screen bg-[#1a1a2e] relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2a2a4e]/30 via-transparent to-[#1a1a2e] pointer-events-none" />
      
      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Screen Content */}
        <div className="flex-1 overflow-y-auto pb-20">
          {activeScreen === 'quests' && (
            <QuestsScreen 
              quests={quests} 
              setQuests={updateQuests}
              onResetQuests={handleResetQuests}
              onShowEpilogue={() => setShowEpilogue(true)}
              onBackToSelection={() => setAppMode('selection')}
              onLogout={handleLogout}
              adventureExp={adventureExp}
              primogems={primogems}
              mora={mora}
            />
          )}
          {activeScreen === 'banner' && <BannerScreen onWish={handleWish} primogems={primogems} />}
          {activeScreen === 'objects' && <ObjectsScreen items={inventory} />}
          {activeScreen === 'achievements' && (
            <AchievementsScreen 
              quests={quests} 
              onRewatchEpilogue={() => setShowEpilogue(true)} 
              onRewatchPrologue={prologueWatched ? () => setShowPrologue(true) : undefined}
              username={api.getCurrentUser()?.username}
            />
          )}
          {activeScreen === 'messages' && <MessagesScreen messages={messages} setMessages={setMessages} onBack={() => setActiveScreen('quests')} />}
        </div>

        {/* Bottom Navigation - Fixed */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-[412px] mx-auto bg-gradient-to-t from-[#16213e] via-[#16213e]/95 to-transparent backdrop-blur-lg border-t border-white/10 z-50">
          <div className="flex items-center justify-around px-4 py-4">
            <NavButton
              icon={<Scroll className="w-6 h-6" />}
              label="Quests"
              active={activeScreen === 'quests'}
              onClick={() => setActiveScreen('quests')}
            />
            <NavButton
              icon={<Sparkles className="w-6 h-6" />}
              label="Wish"
              active={activeScreen === 'banner'}
              onClick={() => setActiveScreen('banner')}
            />
            <NavButton
              icon={<Package className="w-6 h-6" />}
              label="Inventory"
              active={activeScreen === 'objects'}
              onClick={() => setActiveScreen('objects')}
            />
            <NavButton
              icon={<Trophy className="w-6 h-6" />}
              label="Achievements"
              active={activeScreen === 'achievements'}
              onClick={() => setActiveScreen('achievements')}
            />
            <NavButton
              icon={<Mail className="w-6 h-6" />}
              label="Messages"
              active={activeScreen === 'messages'}
              onClick={() => setActiveScreen('messages')}
              badge={messages.filter(m => !m.read).length}
            />
          </div>
        </nav>
      </div>

      {/* Wish Result Screen */}
      {showWishResult && (
        <WishResultScreen
          onClose={handleCloseWishResult}
          onQuestUnlocked={handleQuestUnlocked}
          wishType={wishType}
        />
      )}

      {/* Epilogue Screen */}
      {showEpilogue && (
        <EpilogueScreen
          onClose={() => setShowEpilogue(false)}
          epilogueText={epilogueText}
          epilogueMusicUrl={epilogueMusicUrl}
        />
      )}

      {/* Prologue Screen */}
      {showPrologue && (
        <OpeningCutscene
          onComplete={() => setShowPrologue(false)}
          prologueText={prologueText}
          prologueMusicUrl={prologueMusicUrl}
        />
      )}
    </div>
  );
}

function NavButton({ 
  icon, 
  label, 
  active, 
  onClick,
  badge
}: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all relative ${
        active ? 'scale-110' : 'scale-100'
      }`}
    >
      <div className={`transition-colors relative ${
        active 
          ? 'text-[#4a90e2]' 
          : 'text-[#a8a8b8]'
      }`}>
        {icon}
        {badge !== undefined && badge > 0 && (
          <div className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-[#ef4444] rounded-full flex items-center justify-center px-1">
            <span className="text-white text-[9px]">{badge > 99 ? '99+' : badge}</span>
          </div>
        )}
      </div>
      <span className={`text-[10px] transition-colors ${
        active 
          ? 'text-[#4a90e2]' 
          : 'text-[#a8a8b8]'
      }`}>
        {label}
      </span>
      {active && (
        <div className="w-1 h-1 rounded-full bg-[#4a90e2] mt-0.5" />
      )}
    </button>
  );
}