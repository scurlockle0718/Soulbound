import { Trophy, Star, Award, TrendingUp, Target, Scroll, Swords, Map } from 'lucide-react';
import { useState } from 'react';

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

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: 'trophy' | 'star' | 'sword' | 'map';
  progress: number;
  maxProgress: number;
  rewards: string[];
  unlocked: boolean;
  category: 'quests' | 'exploration' | 'combat' | 'collection';
}

interface AchievementsScreenProps {
  quests: Quest[];
}

export function AchievementsScreen({ quests }: AchievementsScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | Achievement['category']>('all');

  // Calculate stats
  const totalQuests = quests.length;
  const completedQuests = quests.filter(q => q.completed).length;
  const totalRewardsEarned = quests
    .filter(q => q.completed)
    .reduce((acc, q) => acc + q.rewards.length, 0);
  const averageProgress = Math.round(
    quests.reduce((acc, q) => acc + q.progress, 0) / totalQuests
  );

  // Generate achievements based on quest completion
  const achievements: Achievement[] = [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first quest in Teyvat",
      icon: 'trophy',
      progress: completedQuests >= 1 ? 1 : 0,
      maxProgress: 1,
      rewards: ["Primogems x20", "Adventure EXP x100"],
      unlocked: completedQuests >= 1,
      category: 'quests'
    },
    {
      id: 2,
      title: "Quest Hunter",
      description: "Complete 3 quests",
      icon: 'star',
      progress: Math.min(completedQuests, 3),
      maxProgress: 3,
      rewards: ["Primogems x50", "Hero's Wit x3"],
      unlocked: completedQuests >= 3,
      category: 'quests'
    },
    {
      id: 3,
      title: "Master Adventurer",
      description: "Complete 5 quests",
      icon: 'trophy',
      progress: Math.min(completedQuests, 5),
      maxProgress: 5,
      rewards: ["Primogems x100", "Mystic Enhancement Ore x5"],
      unlocked: completedQuests >= 5,
      category: 'quests'
    },
    {
      id: 4,
      title: "Main Story Progress",
      description: "Complete all main quests",
      icon: 'sword',
      progress: quests.filter(q => q.type === 'main' && q.completed).length,
      maxProgress: quests.filter(q => q.type === 'main').length,
      rewards: ["Primogems x200", "Intertwined Fate x3"],
      unlocked: quests.filter(q => q.type === 'main').every(q => q.completed) && quests.filter(q => q.type === 'main').length > 0,
      category: 'quests'
    },
    {
      id: 5,
      title: "Side Quest Enthusiast",
      description: "Complete 3 side quests",
      icon: 'map',
      progress: Math.min(quests.filter(q => q.type === 'side' && q.completed).length, 3),
      maxProgress: 3,
      rewards: ["Primogems x60", "Mora x50,000"],
      unlocked: quests.filter(q => q.type === 'side' && q.completed).length >= 3,
      category: 'exploration'
    },
    {
      id: 6,
      title: "Daily Dedication",
      description: "Complete all commission quests",
      icon: 'star',
      progress: quests.filter(q => q.type === 'commission' && q.completed).length,
      maxProgress: quests.filter(q => q.type === 'commission').length,
      rewards: ["Primogems x40", "Mora x20,000"],
      unlocked: quests.filter(q => q.type === 'commission').every(q => q.completed) && quests.filter(q => q.type === 'commission').length > 0,
      category: 'quests'
    },
    {
      id: 7,
      title: "Perfect Execution",
      description: "Complete a quest with 100% progress",
      icon: 'trophy',
      progress: quests.filter(q => q.progress === 100).length >= 1 ? 1 : 0,
      maxProgress: 1,
      rewards: ["Primogems x30"],
      unlocked: quests.some(q => q.progress === 100),
      category: 'combat'
    }
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  return (
    <div className="h-full overflow-y-auto pb-20">
      {/* Header */}
      <div className="p-5 bg-gradient-to-b from-[#2a2a4e] to-transparent">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-6 h-6 text-[#f5a623]" />
          <h2 className="text-[#e8e8e8]">Achievements</h2>
        </div>
        <p className="text-[#a8a8b8] text-xs">Your journey through Teyvat</p>
      </div>

      {/* Stats Overview */}
      <div className="px-5 mb-6">
        <div className="bg-gradient-to-br from-[#16213e] to-[#1a1a2e] rounded-2xl p-4 border border-[#f5a623]/20">
          <h3 className="text-[#e8e8e8] mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#f5a623]" />
            Your Stats
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-[#4a90e2]" />
                <span className="text-[#a8a8b8] text-xs">Quests</span>
              </div>
              <div className="text-[#e8e8e8] text-xl">{completedQuests}/{totalQuests}</div>
            </div>

            <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-4 h-4 text-[#f5a623]" />
                <span className="text-[#a8a8b8] text-xs">Achievements</span>
              </div>
              <div className="text-[#e8e8e8] text-xl">{unlockedAchievements}/{achievements.length}</div>
            </div>

            <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-4 h-4 text-[#7b68ee]" />
                <span className="text-[#a8a8b8] text-xs">Rewards</span>
              </div>
              <div className="text-[#e8e8e8] text-xl">{totalRewardsEarned}</div>
            </div>

            <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-[#f5a623]" />
                <span className="text-[#a8a8b8] text-xs">Avg Progress</span>
              </div>
              <div className="text-[#e8e8e8] text-xl">{averageProgress}%</div>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#a8a8b8] text-xs">Overall Achievement Progress</span>
              <span className="text-[#4a90e2] text-xs">{Math.round((unlockedAchievements / achievements.length) * 100)}%</span>
            </div>
            <div className="w-full bg-[#1a1a2e] rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#f5a623] to-[#ef4444] transition-all duration-300"
                style={{ width: `${(unlockedAchievements / achievements.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-5 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <CategoryButton
            active={selectedCategory === 'all'}
            onClick={() => setSelectedCategory('all')}
            label="All"
          />
          <CategoryButton
            active={selectedCategory === 'quests'}
            onClick={() => setSelectedCategory('quests')}
            label="Quests"
          />
          <CategoryButton
            active={selectedCategory === 'exploration'}
            onClick={() => setSelectedCategory('exploration')}
            label="Exploration"
          />
          <CategoryButton
            active={selectedCategory === 'combat'}
            onClick={() => setSelectedCategory('combat')}
            label="Combat"
          />
          <CategoryButton
            active={selectedCategory === 'collection'}
            onClick={() => setSelectedCategory('collection')}
            label="Collection"
          />
        </div>
      </div>

      {/* Achievements List */}
      <div className="px-5 space-y-3">
        {filteredAchievements.map(achievement => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  );
}

function CategoryButton({ 
  active, 
  onClick, 
  label 
}: { 
  active: boolean; 
  onClick: () => void; 
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 px-4 py-2 rounded-lg transition-all text-xs ${
        active 
          ? 'bg-gradient-to-r from-[#4a90e2] to-[#7b68ee] text-white' 
          : 'bg-[#16213e]/50 text-[#a8a8b8] hover:text-[#e8e8e8]'
      }`}
    >
      {label}
    </button>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const getIcon = () => {
    switch (achievement.icon) {
      case 'trophy': return <Trophy className="w-5 h-5" />;
      case 'star': return <Star className="w-5 h-5" />;
      case 'sword': return <Swords className="w-5 h-5" />;
      case 'map': return <Map className="w-5 h-5" />;
    }
  };

  const getCategoryColor = () => {
    switch (achievement.category) {
      case 'quests': return '#f5a623';
      case 'exploration': return '#4a90e2';
      case 'combat': return '#ef4444';
      case 'collection': return '#7b68ee';
    }
  };

  return (
    <div 
      className={`bg-[#16213e]/80 backdrop-blur-sm rounded-xl border p-4 transition-all ${
        achievement.unlocked 
          ? 'border-[#f5a623]/30 shadow-lg shadow-[#f5a623]/10' 
          : 'border-white/5 opacity-60'
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        {/* Icon */}
        <div 
          className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
            achievement.unlocked ? 'bg-gradient-to-br from-[#f5a623] to-[#ef4444]' : 'bg-[#1a1a2e]/50'
          }`}
          style={!achievement.unlocked ? { color: getCategoryColor() } : {}}
        >
          <div className={achievement.unlocked ? 'text-white' : ''}>
            {getIcon()}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-[#e8e8e8] text-sm">{achievement.title}</h3>
            {achievement.unlocked && (
              <div className="bg-[#f5a623]/20 px-2 py-0.5 rounded">
                <Star className="w-3 h-3 text-[#f5a623] fill-[#f5a623]" />
              </div>
            )}
          </div>
          <p className="text-[#a8a8b8] text-xs mb-2 leading-relaxed">{achievement.description}</p>
          
          {/* Category Badge */}
          <span 
            className="inline-block text-[10px] uppercase px-2 py-0.5 rounded mb-2"
            style={{ 
              backgroundColor: `${getCategoryColor()}20`,
              color: getCategoryColor()
            }}
          >
            {achievement.category}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[#a8a8b8] text-[10px]">Progress</span>
          <span className="text-[#e8e8e8] text-[10px]">
            {achievement.progress}/{achievement.maxProgress}
          </span>
        </div>
        <div className="w-full bg-[#1a1a2e] rounded-full h-1.5 overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${
              achievement.unlocked 
                ? 'bg-gradient-to-r from-[#f5a623] to-[#ef4444]'
                : 'bg-gradient-to-r from-[#4a90e2] to-[#7b68ee]'
            }`}
            style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
          />
        </div>
      </div>

      {/* Rewards */}
      {achievement.unlocked && (
        <div className="pt-3 border-t border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-3 h-3 text-[#f5a623]" />
            <span className="text-[#f5a623] text-[10px] uppercase">Rewards</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {achievement.rewards.map((reward, index) => (
              <span 
                key={index}
                className="text-[#a8a8b8] text-[10px] bg-[#1a1a2e]/50 px-2 py-1 rounded"
              >
                {reward}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
