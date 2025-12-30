import { Scroll, MapPin, Star, RotateCcw, ArrowLeft, TrendingUp, X, Sparkles, Coins, Sword, Target, Circle, CheckCircle2, Flag, BookOpen, Gift, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

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
}

export function QuestsScreen({ 
  quests, 
  setQuests,
  onResetQuests,
  onShowEpilogue,
  onBackToSelection,
  onLogout,
  adventureExp,
  primogems,
  mora
}: { 
  quests: Quest[];
  setQuests: React.Dispatch<React.SetStateAction<Quest[]>>;
  onResetQuests: () => void;
  onShowEpilogue: () => void;
  onBackToSelection: () => void;
  onLogout: () => void;
  adventureExp: number;
  primogems: number;
  mora: number;
}) {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const activeQuests = Array.isArray(quests) ? quests.filter(q => !q.completed) : [];
  const completedQuests = Array.isArray(quests) ? quests.filter(q => q.completed) : [];
  const allQuestsCompleted = quests && quests.length > 0 && activeQuests.length === 0;

  // Sync selected quest with quests array when quests change
  useEffect(() => {
    if (selectedQuest) {
      const updatedSelectedQuest = quests.find(q => q.id === selectedQuest.id);
      if (updatedSelectedQuest) {
        setSelectedQuest(updatedSelectedQuest);
      }
    }
  }, [quests]);
  
  // Show completion modal when all quests are completed
  useEffect(() => {
    if (allQuestsCompleted) {
      setShowCompletionModal(true);
    }
  }, [allQuestsCompleted]);

  const handleTaskToggle = (questId: number, taskId: number) => {
    setQuests(prevQuests => {
      return prevQuests.map(quest => {
        if (quest.id === questId) {
          const updatedTasks = quest.tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
          );
          
          const completedTasksCount = updatedTasks.filter(t => t.completed).length;
          const progress = Math.round((completedTasksCount / updatedTasks.length) * 100);
          const completed = progress === 100;

          return {
            ...quest,
            tasks: updatedTasks,
            progress,
            completed
          };
        }
        return quest;
      });
    });
  };

  const handleTrackQuest = () => {
    setIsTracking(true);
  };

  const handleCloseDetail = () => {
    setSelectedQuest(null);
    setIsTracking(false);
  };

  return (
    <div className="h-full overflow-y-auto pb-20">
      {/* Header */}
      <div className="p-5 bg-gradient-to-b from-[#2a2a4e] to-transparent">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={onBackToSelection}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={onLogout}
            className="w-10 h-10 rounded-full bg-[#4a90e2] flex items-center justify-center hover:bg-[#3a79c0] transition-colors flex-shrink-0"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5 text-white" />
          </button>
          <Scroll className="w-6 h-6 text-[#e6be8a]" />
          <h2 className="text-[#e8e8e8]">Quest Log</h2>
          <button
            onClick={onResetQuests}
            className="ml-auto w-8 h-8 rounded-full bg-gradient-to-br from-[#ef4444] to-[#dc2626] hover:from-[#dc2626] hover:to-[#b91c1c] flex items-center justify-center transition-all hover:scale-110 shadow-lg shadow-red-500/30"
            title="Factory Reset (Danger Zone)"
          >
            <RotateCcw className="w-4 h-4 text-white" />
          </button>
        </div>
        <p className="text-[#a8a8b8] text-xs">Track your adventures across Teyvat</p>
      </div>

      {/* Player Stats */}
      <div className="px-5 mb-6">
        <div className="bg-gradient-to-br from-[#16213e] to-[#1a1a2e] rounded-2xl p-4 border border-[#e6be8a]/20">
          <h3 className="text-[#e8e8e8] mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#e6be8a]" />
            Traveler Stats
          </h3>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-[#4a90e2]" />
                <span className="text-[#a8a8b8] text-xs">Adv. EXP</span>
              </div>
              <div className="text-[#e8e8e8]">{adventureExp.toLocaleString()}</div>
            </div>

            <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-[#7b68ee]" />
                <span className="text-[#a8a8b8] text-xs">Primogems</span>
              </div>
              <div className="text-[#e8e8e8]">{primogems.toLocaleString()}</div>
            </div>

            <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Coins className="w-4 h-4 text-[#f5a623]" />
                <span className="text-[#a8a8b8] text-xs">Mora</span>
              </div>
              <div className="text-[#e8e8e8]">{mora.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Quests */}
      <div className="px-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-[#4a90e2]" />
          <h3 className="text-[#e8e8e8]">Active Quests</h3>
          <span className="ml-auto bg-[#4a90e2]/20 text-[#4a90e2] px-2 py-1 rounded-full text-xs">
            {activeQuests.length}
          </span>
        </div>

        <div className="space-y-3">
          {activeQuests.map(quest => (
            <QuestCard key={quest.id} quest={quest} onClick={() => setSelectedQuest(quest)} />
          ))}
        </div>
      </div>

      {/* Completed Quests */}
      {completedQuests.length > 0 && (
        <div className="px-5">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-[#e6be8a]" />
            <h3 className="text-[#e8e8e8]">Completed</h3>
            <span className="ml-auto bg-[#e6be8a]/20 text-[#e6be8a] px-2 py-1 rounded-full text-xs">
              {completedQuests.length}
            </span>
          </div>

          <div className="space-y-3">
            {completedQuests.map(quest => (
              <QuestCard key={quest.id} quest={quest} onClick={() => setSelectedQuest(quest)} />
            ))}
          </div>
        </div>
      )}

      {/* Quest Detail Modal */}
      {selectedQuest && (
        <QuestDetail 
          quest={selectedQuest} 
          onClose={handleCloseDetail}
          onTaskToggle={handleTaskToggle}
          isTracking={isTracking}
          onTrackQuest={handleTrackQuest}
        />
      )}

      {/* Epilogue */}
      {allQuestsCompleted && showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-[380px] bg-[#16213e] rounded-3xl border border-white/10 max-h-[50vh] overflow-y-auto animate-in slide-in-from-bottom mx-4">
            {/* Header */}
            <div className="bg-gradient-to-b from-[#16213e] to-[#16213e]/95 backdrop-blur-sm p-5 border-b border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span 
                    className="text-[10px] uppercase px-2 py-0.5 rounded"
                    style={{ 
                      backgroundColor: '#e6be8a20',
                      color: '#e6be8a'
                    }}
                  >
                    All Quests Complete
                  </span>
                </div>
                <button 
                  onClick={() => setShowCompletionModal(false)}
                  className="w-8 h-8 rounded-full bg-[#1a1a2e]/80 flex items-center justify-center hover:bg-[#1a1a2e] transition-colors"
                >
                  <X className="w-5 h-5 text-[#e8e8e8]" />
                </button>
              </div>
              <h2 className="text-[#e8e8e8] text-xl">Journey Complete</h2>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Description */}
              <div>
                <h3 className="text-[#e8e8e8] mb-2 flex items-center gap-2">
                  <Scroll className="w-4 h-4 text-[#4a90e2]" />
                  Epilogue Available
                </h3>
                <p className="text-[#a8a8b8] text-sm leading-relaxed">
                  Congratulations on completing all quests! Your journey has reached its end. 
                  View the epilogue to reflect on your adventure.
                </p>
              </div>

              {/* Action Button */}
              <button 
                onClick={onShowEpilogue}
                className="w-full bg-gradient-to-r from-[#e6be8a] to-[#d4a574] rounded-xl p-4 text-white hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
              >
                <Star className="w-5 h-5" />
                View Epilogue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function QuestCard({ quest, onClick }: { quest: Quest; onClick: () => void }) {
  const getTypeColor = (type: Quest['type']) => {
    switch (type) {
      case 'main': return '#e6be8a';
      case 'side': return '#4a90e2';
      case 'commission': return '#7b68ee';
    }
  };

  const getTypeBg = (type: Quest['type']) => {
    switch (type) {
      case 'main': return 'bg-[#e6be8a]/10 border-[#e6be8a]/30';
      case 'side': return 'bg-[#4a90e2]/10 border-[#4a90e2]/30';
      case 'commission': return 'bg-[#7b68ee]/10 border-[#7b68ee]/30';
    }
  };

  return (
    <button 
      onClick={onClick}
      className={`w-full bg-[#16213e]/80 backdrop-blur-sm rounded-xl border ${getTypeBg(quest.type)} p-4 ${quest.completed ? 'opacity-60' : ''} hover:scale-[1.02] transition-transform text-left`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span 
              className="text-[10px] uppercase px-2 py-0.5 rounded"
              style={{ 
                backgroundColor: `${getTypeColor(quest.type)}20`,
                color: getTypeColor(quest.type)
              }}
            >
              {quest.type}
            </span>
            {quest.completed && (
              <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                Complete
              </span>
            )}
          </div>
          <h3 className="text-[#e8e8e8] text-sm mb-1">{quest.title}</h3>
          <p className="text-[#a8a8b8] text-xs leading-relaxed">{quest.description}</p>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-3 h-3 text-[#a8a8b8]" />
        <span className="text-[#a8a8b8] text-xs">{quest.location}</span>
      </div>

      {/* Progress Bar */}
      {!quest.completed && (
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[#a8a8b8] text-[10px]">Progress</span>
            <span className="text-[#e8e8e8] text-[10px]">{quest.progress}%</span>
          </div>
          <div className="w-full bg-[#1a1a2e] rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#4a90e2] to-[#7b68ee] transition-all duration-300"
              style={{ width: `${quest.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Difficulty & Rewards */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Sword 
              key={i} 
              className={`w-3 h-3 ${i < quest.difficulty ? 'text-[#e6be8a]' : 'text-[#a8a8b8]/20'}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-[#e6be8a]" />
          <span className="text-[#a8a8b8] text-xs">{quest.rewards?.length || 0} rewards</span>
        </div>
      </div>
    </button>
  );
}

function QuestDetail({ 
  quest, 
  onClose, 
  onTaskToggle,
  isTracking,
  onTrackQuest
}: { 
  quest: Quest; 
  onClose: () => void;
  onTaskToggle: (questId: number, taskId: number) => void;
  isTracking: boolean;
  onTrackQuest: () => void;
}) {
  const getTypeColor = (type: Quest['type']) => {
    switch (type) {
      case 'main': return '#e6be8a';
      case 'side': return '#4a90e2';
      case 'commission': return '#7b68ee';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-[412px] bg-[#16213e] rounded-t-3xl border-t border-white/10 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-b from-[#16213e] to-[#16213e]/95 backdrop-blur-sm p-5 border-b border-white/10 z-10">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span 
                  className="text-[10px] uppercase px-2 py-0.5 rounded"
                  style={{ 
                    backgroundColor: `${getTypeColor(quest.type)}20`,
                    color: getTypeColor(quest.type)
                  }}
                >
                  {quest.type}
                </span>
                {quest.completed && (
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                    Complete
                  </span>
                )}
                {isTracking && !quest.completed && (
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-[#4a90e2]/20 text-[#4a90e2] flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Tracking
                  </span>
                )}
              </div>
              <h2 className="text-[#e8e8e8]">{quest.title}</h2>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#1a1a2e]/80 flex items-center justify-center hover:bg-[#1a1a2e] transition-colors"
            >
              <X className="w-5 h-5 text-[#e8e8e8]" />
            </button>
          </div>

          {/* Difficulty */}
          <div className="flex items-center gap-2">
            <span className="text-[#a8a8b8] text-xs">Difficulty:</span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Sword 
                  key={i} 
                  className={`w-3 h-3 ${i < quest.difficulty ? 'text-[#e6be8a]' : 'text-[#a8a8b8]/20'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-[#e8e8e8] mb-2 flex items-center gap-2">
              <Scroll className="w-4 h-4 text-[#4a90e2]" />
              Description
            </h3>
            <p className="text-[#a8a8b8] text-sm leading-relaxed">{quest.description}</p>
          </div>

          {/* Lore */}
          {quest.lore && (
            <div>
              <h3 className="text-[#e8e8e8] mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#7b68ee]" />
                Lore
              </h3>
              <div className="bg-gradient-to-r from-[#7b68ee]/10 to-transparent border border-[#7b68ee]/20 rounded-lg p-4">
                <p className="text-[#a8a8b8] text-sm leading-relaxed italic">{quest.lore}</p>
              </div>
            </div>
          )}

          {/* Location */}
          <div>
            <h3 className="text-[#e8e8e8] mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#4a90e2]" />
              Location
            </h3>
            <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
              <p className="text-[#e8e8e8]">{quest.location}</p>
            </div>
          </div>

          {/* Tasks */}
          {isTracking && (
            <div>
              <h3 className="text-[#e8e8e8] mb-3 flex items-center gap-2">
                <Flag className="w-4 h-4 text-[#4a90e2]" />
                Objectives
              </h3>
              <div className="space-y-2">
                {quest.tasks.map(task => (
                  <button
                    key={task.id}
                    onClick={() => onTaskToggle(quest.id, task.id)}
                    className="w-full bg-[#1a1a2e]/50 hover:bg-[#1a1a2e]/70 rounded-lg p-3 flex items-center gap-3 transition-colors text-left"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-[#4ade80] flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#a8a8b8] flex-shrink-0" />
                    )}
                    <span className={`text-sm ${task.completed ? 'text-[#a8a8b8] line-through' : 'text-[#e8e8e8]'}`}>
                      {task.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Progress */}
          {!quest.completed && (
            <div>
              <h3 className="text-[#e8e8e8] mb-2 flex items-center gap-2">
                <Flag className="w-4 h-4 text-[#4a90e2]" />
                Progress
              </h3>
              <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#a8a8b8] text-sm">Quest Completion</span>
                  <span className="text-[#4a90e2]">{quest.progress}%</span>
                </div>
                <div className="w-full bg-[#1a1a2e] rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#4a90e2] to-[#7b68ee] transition-all duration-300"
                    style={{ width: `${quest.progress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2 text-xs text-[#a8a8b8]">
                  <span>
                    {Array.isArray(quest.tasks) ? quest.tasks.filter(t => t.completed).length : 0} / {Array.isArray(quest.tasks) ? quest.tasks.length : 0} objectives completed
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Rewards */}
          <div>
            <h3 className="text-[#e8e8e8] mb-3 flex items-center gap-2">
              <Gift className="w-4 h-4 text-[#e6be8a]" />
              Rewards
            </h3>
            <div className="space-y-2">
              {quest.rewards.map((reward, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-r from-[#e6be8a]/10 to-transparent border border-[#e6be8a]/20 rounded-lg p-3 flex items-center gap-3"
                >
                  <Star className="w-4 h-4 text-[#e6be8a] flex-shrink-0" />
                  <span className="text-[#e8e8e8] text-sm">{reward}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          {!isTracking && (
            <button 
              onClick={onTrackQuest}
              className="w-full bg-gradient-to-r from-[#4a90e2] to-[#7b68ee] rounded-xl p-4 text-white hover:scale-[1.02] transition-transform"
            >
              {quest.completed ? 'View Progress' : 'Track Quest'}
            </button>
          )}
          {quest.completed && isTracking && (
            <div className="bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/20 rounded-xl p-4 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="text-green-400">Quest Completed!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}