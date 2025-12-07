import { Star, Sparkles, X, Scroll } from 'lucide-react';
import { useState, useEffect } from 'react';

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
  tasks: Array<{
    id: number;
    description: string;
    completed: boolean;
  }>;
}

interface WishResultScreenProps {
  onClose: () => void;
  onQuestUnlocked: (quest: Quest) => void;
  wishType: '1' | '10';
}

const newQuest: Quest = {
  id: 5,
  title: "Archon's Blessing",
  description: "A mysterious voice calls to you from beyond the stars. Seek out the forgotten shrine and uncover its ancient secrets.",
  location: "Starfell Valley",
  rewards: ["Adventure EXP x400", "Primogems x50", "Mystic Enhancement Ore x5"],
  progress: 0,
  difficulty: 4,
  type: 'main',
  completed: false,
  tasks: [
    { id: 1, description: "Find the hidden shrine in Starfell Valley", completed: false },
    { id: 2, description: "Activate the elemental monuments", completed: false },
    { id: 3, description: "Defeat the Abyss Mage", completed: false },
    { id: 4, description: "Claim the Archon's blessing", completed: false }
  ]
};

export function WishResultScreen({ onClose, onQuestUnlocked, wishType }: WishResultScreenProps) {
  const [phase, setPhase] = useState<'video' | 'quest'>('video');

  useEffect(() => {
    // Simulate video playing for 3 seconds
    const timer = setTimeout(() => {
      setPhase('quest');
      onQuestUnlocked(newQuest);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onQuestUnlocked]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {phase === 'video' ? (
        <VideoPhase wishType={wishType} />
      ) : (
        <QuestUnlockedPhase quest={newQuest} onClose={onClose} />
      )}
    </div>
  );
}

function VideoPhase({ wishType }: { wishType: '1' | '10' }) {
  return (
    <div className="w-full max-w-[412px] h-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4a90e2] via-[#7b68ee] to-[#f5a623] animate-pulse" />
      
      {/* Shooting stars effect */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random()
            }}
          />
        ))}
      </div>

      {/* Center content */}
      <div className="relative z-10 text-center">
        <div className="mb-6 animate-bounce">
          <Sparkles className="w-24 h-24 text-white mx-auto drop-shadow-lg" />
        </div>
        <h2 className="text-white mb-2 drop-shadow-lg">Making a Wish...</h2>
        <p className="text-white/80 text-sm">
          {wishType === '1' ? 'Single Wish' : '10 Wishes'}
        </p>
        
        {/* Stars falling animation */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-6 h-6 text-[#f5a623] fill-[#f5a623] animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function QuestUnlockedPhase({ quest, onClose }: { quest: Quest; onClose: () => void }) {
  const getTypeColor = () => {
    switch (quest.type) {
      case 'main': return '#f5a623';
      case 'side': return '#4a90e2';
      case 'commission': return '#7b68ee';
    }
  };

  return (
    <div className="w-full max-w-[412px] h-full flex flex-col items-center justify-center relative bg-gradient-to-b from-[#1a1a2e] to-[#2a2a4e] p-6">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#16213e]/80 backdrop-blur-sm flex items-center justify-center hover:bg-[#16213e] transition-colors z-20"
      >
        <X className="w-5 h-5 text-[#e8e8e8]" />
      </button>

      {/* Glow effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-gradient-to-r from-[#f5a623]/20 to-[#7b68ee]/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-6 max-w-sm animate-in fade-in slide-in-from-bottom duration-500">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f5a623] to-[#7b68ee] rounded-full blur-xl opacity-50" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#f5a623] to-[#7b68ee] flex items-center justify-center">
              <Scroll className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div>
          <p className="text-[#f5a623] text-sm mb-2 uppercase tracking-wider">New Quest Unlocked!</p>
          <h2 className="text-white mb-3">{quest.title}</h2>
          <span
            className="inline-block text-[10px] uppercase px-3 py-1 rounded-full mb-4"
            style={{
              backgroundColor: `${getTypeColor()}20`,
              color: getTypeColor()
            }}
          >
            {quest.type} Quest
          </span>
        </div>

        {/* Description */}
        <div className="bg-[#16213e]/50 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-[#a8a8b8] text-sm leading-relaxed">{quest.description}</p>
        </div>

        {/* Difficulty */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-[#a8a8b8] text-sm">Difficulty:</span>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < quest.difficulty ? 'text-[#f5a623] fill-[#f5a623]' : 'text-[#a8a8b8]/20'}`}
              />
            ))}
          </div>
        </div>

        {/* Rewards Preview */}
        <div className="bg-[#16213e]/50 backdrop-blur-sm rounded-xl p-4 border border-[#f5a623]/20">
          <p className="text-[#f5a623] text-xs uppercase mb-2">Rewards</p>
          <div className="space-y-1">
            {quest.rewards.slice(0, 2).map((reward, index) => (
              <p key={index} className="text-[#e8e8e8] text-xs">{reward}</p>
            ))}
            {quest.rewards.length > 2 && (
              <p className="text-[#a8a8b8] text-xs">+{quest.rewards.length - 2} more...</p>
            )}
          </div>
        </div>

        {/* Action */}
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-[#4a90e2] to-[#7b68ee] rounded-xl p-4 text-white hover:scale-[1.02] transition-transform"
        >
          View in Quest Log
        </button>
      </div>
    </div>
  );
}
