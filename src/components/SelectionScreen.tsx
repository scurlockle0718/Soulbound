import { Play, Settings } from 'lucide-react';

interface SelectionScreenProps {
  onSelectMode: (mode: 'public' | 'admin') => void;
  userEmail?: string;
}

export function SelectionScreen({ onSelectMode, userEmail }: SelectionScreenProps) {
  const isAdmin = userEmail === 'scurlocklaurynn@gmail.com';
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#2a2a4e] to-[#1a1a2e] relative overflow-hidden p-4">
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
      <div className="relative z-10 text-center space-y-6 sm:space-y-8 w-full max-w-md">
        {/* Logo/Title */}
        <div className="space-y-3">
          <h1 className="text-[#e6be8a] mb-2 drop-shadow-lg text-4xl sm:text-5xl tracking-wider" style={{ fontFamily: 'serif' }}>
            Soulbound
          </h1>
          <div className="w-24 sm:w-32 h-px bg-gradient-to-r from-transparent via-[#e6be8a] to-transparent mx-auto mb-4" />
          <p className="text-[#a8a8b8]">Choose your path</p>
        </div>

        {/* Selection Cards */}
        <div className="space-y-3 sm:space-y-4">
          <button
            onClick={() => onSelectMode('public')}
            className="w-full bg-gradient-to-r from-[#4a90e2] to-[#7b68ee] rounded-2xl p-5 sm:p-6 hover:scale-[1.02] transition-transform group"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors flex-shrink-0">
                <Play className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-left flex-1">
                <h2 className="text-white mb-1">Enter Lauriel</h2>
                <p className="text-white/80 text-sm">Begin your adventure</p>
              </div>
            </div>
          </button>

          {isAdmin && (
            <button
              onClick={() => onSelectMode('admin')}
              className="w-full bg-gradient-to-r from-[#e6be8a] to-[#d4a574] rounded-2xl p-5 sm:p-6 hover:scale-[1.02] transition-transform group"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors flex-shrink-0">
                  <Settings className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="text-left flex-1">
                  <h2 className="text-[rgb(30,22,62)] mb-1">Admin Mode</h2>
                  <p className="text-[#1E163E] text-sm">Manage quests & content</p>
                </div>
              </div>
            </button>
          )}
        </div>

        <p className="text-[#a8a8b8] text-xs mt-8">
          Inspired by Genshin Impact. Made with love.
        </p>
      </div>
    </div>
  );
}
