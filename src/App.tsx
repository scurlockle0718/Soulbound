import { useState } from 'react';
import { Scroll, Sparkles, Package, Trophy } from 'lucide-react';
import { QuestsScreen } from './components/QuestsScreen';
import { BannerScreen } from './components/BannerScreen';
import { ObjectsScreen } from './components/ObjectsScreen';
import { AchievementsScreen } from './components/AchievementsScreen';
import { WishResultScreen } from './components/WishResultScreen';
import { SelectionScreen } from './components/SelectionScreen';
import { AdminScreen } from './components/AdminScreen';
import { OpeningCutscene } from './components/OpeningCutscene';
import { EpilogueScreen } from './components/EpilogueScreen';

type Screen = 'quests' | 'banner' | 'objects' | 'achievements';
type AppMode = 'cutscene' | 'selection' | 'public' | 'admin';

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
}

const initialQuestsData: Quest[] = [
  {
    id: 1,
    title: "The Outlander Who Caught the Wind",
    description: "Search for answers about your lost sibling in the vast world of Teyvat.",
    location: "Mondstadt",
    rewards: ["Adventure EXP x500", "Primogems x60", "Mora x20,000"],
    progress: 75,
    difficulty: 5,
    type: 'main',
    completed: false,
    tasks: [
      { id: 1, description: "Talk to the Knights of Favonius", completed: true },
      { id: 2, description: "Investigate the Statue of The Seven", completed: true },
      { id: 3, description: "Defeat the Ruin Guard", completed: true },
      { id: 4, description: "Return to Jean", completed: false }
    ]
  },
  {
    id: 2,
    title: "Dragon Storm",
    description: "Investigate the strange disturbances affecting Stormterror's Lair.",
    location: "Stormterror's Lair",
    rewards: ["Adventure EXP x300", "Primogems x40"],
    progress: 45,
    difficulty: 4,
    type: 'main',
    completed: false,
    tasks: [
      { id: 1, description: "Enter Stormterror's Lair", completed: true },
      { id: 2, description: "Clear the area of monsters", completed: true },
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
    progress: 100,
    difficulty: 2,
    type: 'commission',
    completed: true,
    tasks: [
      { id: 1, description: "Patrol the city gates", completed: true },
      { id: 2, description: "Defeat slimes near the bridge", completed: true },
      { id: 3, description: "Report back to Huffman", completed: true }
    ]
  },
  {
    id: 4,
    title: "Lost Treasures of the Vale",
    description: "Discover ancient artifacts hidden throughout Brightcrown Canyon.",
    location: "Brightcrown Canyon",
    rewards: ["Adventure EXP x200", "Hero's Wit x3"],
    progress: 30,
    difficulty: 3,
    type: 'side',
    completed: false,
    tasks: [
      { id: 1, description: "Find the first treasure chest", completed: true },
      { id: 2, description: "Solve the elemental puzzle", completed: true },
      { id: 3, description: "Defeat the treasure hoarders", completed: true },
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
  const [appMode, setAppMode] = useState<AppMode>('cutscene');
  const [activeScreen, setActiveScreen] = useState<Screen>('quests');
  const [quests, setQuests] = useState<Quest[]>(initialQuestsData);
  const [inventory, setInventory] = useState<Item[]>(initialInventoryData);
  const [showWishResult, setShowWishResult] = useState(false);
  const [showEpilogue, setShowEpilogue] = useState(false);
  const [wishType, setWishType] = useState<'1' | '10'>('1');
  
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

  // Parse reward strings and add to inventory
  const addRewardsToInventory = (rewards: string[]) => {
    const newItems: Item[] = [];
    let nextId = Math.max(...inventory.map(i => i.id), 0) + 1;

    rewards.forEach(reward => {
      // Parse reward string (e.g., "Primogems x60", "Adventure EXP x500")
      const match = reward.match(/(.+?)\s*x(\d+)/);
      if (match) {
        const [, itemName, quantityStr] = match;
        const quantity = parseInt(quantityStr);

        // Check if item already exists in inventory
        const existingItemIndex = inventory.findIndex(
          item => item.name.toLowerCase() === itemName.trim().toLowerCase()
        );

        if (existingItemIndex !== -1) {
          // Update existing item quantity
          setInventory(prev => prev.map((item, index) => 
            index === existingItemIndex 
              ? { ...item, quantity: (item.quantity || 0) + quantity }
              : item
          ));
        } else {
          // Add new item
          const itemType: ItemType = 
            itemName.includes('EXP') || itemName.includes('Mora') || itemName.includes('Primogems') 
              ? 'currency' 
              : itemName.includes('Ore') || itemName.includes('Wit')
              ? 'material'
              : itemName.includes('Fate')
              ? 'material'
              : 'material';

          newItems.push({
            id: nextId++,
            name: itemName.trim(),
            type: itemType,
            rarity: 3,
            quantity: quantity,
            description: `Obtained from completing quests.`,
            image: 'https://images.unsplash.com/photo-1743448111530-3654e7b66f26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWdpY2FsJTIwY3J5c3RhbCUyMGdlbXxlbnwxfHx8fDE3NjUxMTYyNjF8MA&ixlib=rb-4.1.0&q=80&w=1080'
          });
        }
      }
    });

    if (newItems.length > 0) {
      setInventory(prev => [...prev, ...newItems]);
    }
  };

  // Monitor quest completions and add rewards
  const updateQuests = (updater: React.SetStateAction<Quest[]>) => {
    setQuests(prevQuests => {
      const oldQuests = prevQuests;
      const newQuests = typeof updater === 'function' ? updater(prevQuests) : updater;

      // Check for newly completed quests
      newQuests.forEach((newQuest, index) => {
        const oldQuest = oldQuests[index];
        if (oldQuest && !oldQuest.completed && newQuest.completed) {
          // Quest just completed, add rewards
          addRewardsToInventory(newQuest.rewards);
        }
      });

      return newQuests;
    });
  };

  const handleWish = (type: '1' | '10') => {
    setWishType(type);
    setShowWishResult(true);
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
    setQuests(initialQuestsData);
    setInventory(initialInventoryData);
  };

  const handleSelectMode = (mode: 'public' | 'admin') => {
    setAppMode(mode);
  };

  const handleExitAdmin = () => {
    setAppMode('selection');
  };

  // Show opening cutscene
  if (appMode === 'cutscene') {
    return (
      <div className="w-full max-w-[412px] mx-auto h-screen">
        <OpeningCutscene 
          onComplete={() => setAppMode('selection')} 
          prologueText={prologueText}
        />
      </div>
    );
  }

  // Show selection screen
  if (appMode === 'selection') {
    return (
      <div className="w-full max-w-[412px] mx-auto h-screen">
        <SelectionScreen onSelectMode={handleSelectMode} />
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
        <div className="flex-1 overflow-hidden">
          {activeScreen === 'quests' && (
            <QuestsScreen 
              quests={quests} 
              setQuests={updateQuests}
              onResetQuests={handleResetQuests}
              onShowEpilogue={() => setShowEpilogue(true)}
            />
          )}
          {activeScreen === 'banner' && <BannerScreen onWish={handleWish} />}
          {activeScreen === 'objects' && <ObjectsScreen items={inventory} />}
          {activeScreen === 'achievements' && <AchievementsScreen quests={quests} />}
        </div>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#16213e] via-[#16213e]/95 to-transparent backdrop-blur-lg border-t border-white/10">
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
        />
      )}
    </div>
  );
}

function NavButton({ 
  icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all ${
        active ? 'scale-110' : 'scale-100'
      }`}
    >
      <div className={`transition-colors ${
        active 
          ? 'text-[#4a90e2]' 
          : 'text-[#a8a8b8]'
      }`}>
        {icon}
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