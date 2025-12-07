import { MapPin, Star, Clock, ChevronRight } from 'lucide-react';

interface Quest {
  id: number;
  title: string;
  description: string;
  location: string;
  reward: number;
  difficulty: number;
  type: 'main' | 'side' | 'daily';
  progress: number;
}

const quests: Quest[] = [
  {
    id: 1,
    title: 'A New Star Approaches',
    description: 'Investigate the mysterious meteorite that fell near Starfell Lake',
    location: 'Starfell Valley',
    reward: 500,
    difficulty: 3,
    type: 'main',
    progress: 60,
  },
  {
    id: 2,
    title: 'The Outlander Who Caught the Wind',
    description: 'Meet with the Knights of Favonius at their headquarters',
    location: 'Mondstadt',
    reward: 300,
    difficulty: 2,
    type: 'main',
    progress: 100,
  },
  {
    id: 3,
    title: 'Daily Commission: Destroy Hilichurl Camp',
    description: 'Clear out the hilichurl encampment threatening trade routes',
    location: 'Windrise',
    reward: 150,
    difficulty: 1,
    type: 'daily',
    progress: 0,
  },
  {
    id: 4,
    title: 'The Chi of Guyun',
    description: 'Discover the secret of the ancient ruins in Liyue Harbor',
    location: 'Guyun Stone Forest',
    reward: 450,
    difficulty: 4,
    type: 'side',
    progress: 30,
  },
];

export function QuestScreen() {
  const getQuestTypeColor = (type: Quest['type']) => {
    switch (type) {
      case 'main':
        return 'from-amber-500 to-orange-600';
      case 'side':
        return 'from-blue-500 to-cyan-600';
      case 'daily':
        return 'from-purple-500 to-pink-600';
    }
  };

  const getQuestTypeBg = (type: Quest['type']) => {
    switch (type) {
      case 'main':
        return 'bg-gradient-to-r from-amber-500/20 to-orange-600/20 border-amber-500/30';
      case 'side':
        return 'bg-gradient-to-r from-blue-500/20 to-cyan-600/20 border-blue-500/30';
      case 'daily':
        return 'bg-gradient-to-r from-purple-500/20 to-pink-600/20 border-purple-500/30';
    }
  };

  return (
    <div className="h-full overflow-y-auto pb-20 px-4 pt-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-8 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full"></div>
          <h1 className="text-amber-100">Quest Log</h1>
        </div>
        <p className="text-slate-400 ml-7">Track your adventures across Teyvat</p>
      </div>

      {/* Quest Filters */}
      <div className="flex gap-2 mb-6">
        <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg text-white">
          All Quests
        </button>
        <button className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800">
          Main
        </button>
        <button className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800">
          Daily
        </button>
      </div>

      {/* Quest List */}
      <div className="space-y-4">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className={`relative overflow-hidden rounded-xl border ${getQuestTypeBg(quest.type)} backdrop-blur-sm p-4 transition-all hover:scale-[1.02]`}
          >
            {/* Decorative corner */}
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${getQuestTypeColor(quest.type)} opacity-20 rounded-bl-full`}></div>
            
            <div className="relative">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[0.7rem] uppercase tracking-wider px-2 py-0.5 bg-gradient-to-r from-slate-900/80 to-slate-800/80 rounded text-amber-300 border border-amber-500/30">
                      {quest.type}
                    </span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < quest.difficulty
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <h3 className="text-amber-50 mb-2">{quest.title}</h3>
                  <p className="text-slate-300 text-[0.85rem] mb-3">{quest.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500 flex-shrink-0 ml-2" />
              </div>

              {/* Progress Bar */}
              {quest.progress > 0 && (
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[0.75rem] text-slate-400">Progress</span>
                    <span className="text-[0.75rem] text-amber-400">{quest.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getQuestTypeColor(quest.type)} rounded-full transition-all`}
                      style={{ width: `${quest.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Quest Info */}
              <div className="flex items-center gap-4 text-[0.8rem]">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span>{quest.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{quest.reward} XP</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
