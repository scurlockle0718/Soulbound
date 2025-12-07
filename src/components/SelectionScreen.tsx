import { Play, Settings } from 'lucide-react';

interface SelectionScreenProps {
  onSelectMode: (mode: 'public' | 'admin') => void;
}

export function SelectionScreen({ onSelectMode }: SelectionScreenProps) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#2a2a4e] to-[#1a1a2e] relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-8 px-8 max-w-md">
        {/* Logo/Title */}
        <div className="space-y-3">
          <h1 className="text-[#f5a623] mb-2 drop-shadow-lg text-5xl tracking-wider" style={{ fontFamily: 'serif' }}>
            Soulbound
          </h1>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#f5a623] to-transparent mx-auto mb-4" />
          <p className="text-[#a8a8b8]">Choose your path</p>
        </div>

        {/* Selection Cards */}
        <div className="space-y-4">
          <button
            onClick={() => onSelectMode('public')}
            className="w-full bg-gradient-to-r from-[#4a90e2] to-[#7b68ee] rounded-2xl p-6 hover:scale-[1.02] transition-transform group"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Play className="w-8 h-8 text-white" />
              </div>
              <div className="text-left flex-1">
                <h2 className="text-white mb-1">Enter Teyvat</h2>
                <p className="text-white/80 text-sm">Begin your adventure</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onSelectMode('admin')}
            className="w-full bg-gradient-to-r from-[#f5a623] to-[#ef4444] rounded-2xl p-6 hover:scale-[1.02] transition-transform group"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <div className="text-left flex-1">
                <h2 className="text-white mb-1">Admin Mode</h2>
                <p className="text-white/80 text-sm">Manage quests & content</p>
              </div>
            </div>
          </button>
        </div>

        <p className="text-[#a8a8b8] text-xs mt-8">
          Inspired by Genshin Impact
        </p>
      </div>
    </div>
  );
}