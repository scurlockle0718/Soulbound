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
  lore: string;
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
  lore: "In the age before the Archon War, when the gods walked freely upon Teyvat, certain places were blessed with divine resonance. Starfell Valley holds one such shrine, hidden from mortal eyes by layers of time and elemental energy. The voice that calls to you is neither threat nor simple invitation—it is recognition. You have been chosen, not by chance, but by a design woven into the very fabric of this world. What awaits at the shrine may change the course of your journey forever.",
  tasks: [
    { id: 1, description: "Find the hidden shrine in Starfell Valley", completed: false },
    { id: 2, description: "Activate the elemental monuments", completed: false },
    { id: 3, description: "Defeat the Abyss Mage", completed: false },
    { id: 4, description: "Claim the Archon's blessing", completed: false }
  ]
};

export function WishResultScreen({ onClose, onQuestUnlocked, wishType }: WishResultScreenProps) {
  const [phase, setPhase] = useState<'video' | 'quest'>('video');
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    // Show skip button after 3 seconds
    const skipTimer = setTimeout(() => {
      setShowSkip(true);
    }, 3000);

    // Auto-advance after video (~10 seconds)
    const videoTimer = setTimeout(() => {
      setPhase('quest');
      onQuestUnlocked(newQuest);
    }, 8000);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(videoTimer);
    };
  }, [onQuestUnlocked]);

  const handleSkip = () => {
    setPhase('quest');
    onQuestUnlocked(newQuest);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {phase === 'video' ? (
        <VideoPhase wishType={wishType} showSkip={showSkip} onSkip={handleSkip} />
      ) : (
        <QuestUnlockedPhase quest={newQuest} onClose={onClose} />
      )}
    </div>
  );
}

function VideoPhase({ wishType, showSkip, onSkip }: { wishType: '1' | '10'; showSkip: boolean; onSkip: () => void }) {
  const videoId = '0aF6z1yfkwo';

  return (
    <div className="w-full h-full relative">
      {/* YouTube Video - Autoplay with no controls */}
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&fs=0&iv_load_policy=3&disablekb=1`}
        title="Wish Animation"
        allow="autoplay; encrypted-media"
        allowFullScreen
        style={{ border: 'none' }}
      />

      {/* Skip Button */}
      {showSkip && (
        <button
          onClick={onSkip}
          className="absolute top-6 right-6 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-black/80 transition-all z-10"
        >
          <span className="text-sm">Skip</span>
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function QuestUnlockedPhase({ quest, onClose }: { quest: Quest; onClose: () => void }) {
  const getTypeColor = () => {
    switch (quest.type) {
      case 'main': return '#e6be8a';
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
        <div className="w-96 h-96 bg-gradient-to-r from-[#e6be8a]/20 to-[#7b68ee]/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-6 max-w-sm animate-in fade-in slide-in-from-bottom duration-500">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#e6be8a] to-[#7b68ee] rounded-full blur-xl opacity-50" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#e6be8a] to-[#7b68ee] flex items-center justify-center">
              <Scroll className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div>
          <p className="text-[#e6be8a] text-sm mb-2 uppercase tracking-wider">New Quest Unlocked!</p>
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
                className={`w-4 h-4 ${i < quest.difficulty ? 'text-[#e6be8a] fill-[#e6be8a]' : 'text-[#a8a8b8]/20'}`}
              />
            ))}
          </div>
        </div>

        {/* Rewards Preview */}
        <div className="bg-[#16213e]/50 backdrop-blur-sm rounded-xl p-4 border border-[#e6be8a]/20">
          <p className="text-[#e6be8a] text-xs uppercase mb-2">Rewards</p>
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