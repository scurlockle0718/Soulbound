import { Star, Sparkles, ChevronRight, Clock, Info } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Banner {
  id: number;
  name: string;
  type: 'character' | 'weapon';
  featured5Star: string;
  featured4Stars: string[];
  endsIn: string;
  image: string;
  color: string;
}

const bannersData: Banner[] = [
  {
    id: 1,
    name: "Wanderlust Invocation",
    type: 'character',
    featured5Star: "Molly",
    featured4Stars: ["Carmen", "Oscar", "Nora"],
    endsIn: "12d 5h",
    image: 'https://i.imgur.com/ppTQQQp.png',
    color: '#ef4444'
  },
  {
    id: 2,
    name: "Epitome Invocation",
    type: 'weapon',
    featured5Star: "Mo the Monster",
    featured4Stars: ["Badge of the Chosen", "Pocket Token", "Threadbound Atlas"],
    endsIn: "12d 5h",
    image: 'https://i.imgur.com/tNgiTxs.png',
    color: '#8b5cf6'
  }
];

export function BannerScreen({ onWish, primogems }: { onWish: (type: '1' | '10') => void; primogems: number }) {
  const [activeBanner, setActiveBanner] = useState(0);
  const currentBanner = bannersData[activeBanner];

  return (
    <div className="h-full overflow-y-auto pb-20">
      {/* Header */}
      <div className="p-5 bg-gradient-to-b from-[#2a2a4e] to-transparent">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 h-6 text-[#e6be8a]" />
          <h2 className="text-[#e8e8e8]">Wish</h2>
        </div>
        <p className="text-[#a8a8b8] text-xs">May the blessings of the Anemo Archon bring you fortune</p>
      </div>

      {/* Banner Selector */}
      <div className="px-5 mb-6">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {bannersData.map((banner, index) => (
            <button
              key={banner.id}
              onClick={() => setActiveBanner(index)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg transition-all ${
                activeBanner === index
                  ? 'bg-gradient-to-r from-[#4a90e2] to-[#7b68ee] text-white'
                  : 'bg-[#16213e]/50 text-[#a8a8b8]'
              }`}
            >
              <div className="text-xs whitespace-nowrap">{banner.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Banner */}
      <div className="px-5 mb-6">
        <div className="relative rounded-2xl overflow-hidden border border-white/10">
          {/* Background Image */}
          <div className="relative h-80">
            <ImageWithFallback
              src={currentBanner.image}
              alt={currentBanner.name}
              className="w-full h-full object-cover"
            />
            <div 
              className="absolute inset-0 opacity-30"
              style={{ 
                background: `linear-gradient(to bottom, transparent, ${currentBanner.color}99)` 
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-transparent to-transparent" />
            
            {/* Banner Info Overlay */}
            <div className="absolute top-4 left-4 right-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#e6be8a] text-[#1a1a2e] text-[10px] px-2 py-1 rounded uppercase">
                      Featured
                    </span>
                    <span className="bg-[#1a1a2e]/80 backdrop-blur-sm text-[#e8e8e8] text-[10px] px-2 py-1 rounded">
                      {currentBanner.type === 'character' ? 'Character' : 'Weapon'} Event
                    </span>
                  </div>
                  <h3 className="text-white drop-shadow-lg">{currentBanner.featured5Star}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-[#e6be8a] fill-[#e6be8a]" />
                    ))}
                  </div>
                </div>
                <button className="bg-[#1a1a2e]/80 backdrop-blur-sm p-2 rounded-full">
                  <Info className="w-4 h-4 text-[#e8e8e8]" />
                </button>
              </div>
            </div>

            {/* Time Remaining */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-[#1a1a2e]/80 backdrop-blur-sm px-3 py-2 rounded-lg">
              <Clock className="w-4 h-4 text-[#e6be8a]" />
              <span className="text-[#e8e8e8] text-xs">Ends in {currentBanner.endsIn}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Characters/Items */}
      <div className="px-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-[#e6be8a]" />
          <h3 className="text-[#e8e8e8]">Featured 4-Star Items</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {currentBanner.featured4Stars.map((item, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-[#8b5cf6]/20 to-[#7c3aed]/20 border border-[#8b5cf6]/30 rounded-xl p-3 text-center"
            >
              <div className="w-full aspect-square bg-[#1a1a2e]/50 rounded-lg mb-2 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#8b5cf6]" />
              </div>
              <div className="flex items-center justify-center gap-0.5 mb-1">
                {[...Array(4)].map((_, i) => (
                  <Star key={i} className="w-2 h-2 text-[#8b5cf6] fill-[#8b5cf6]" />
                ))}
              </div>
              <p className="text-[#e8e8e8] text-xs line-clamp-2">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Wish Counter */}
      <div className="px-5 mb-6">
        <div className="bg-gradient-to-br from-[#16213e] to-[#1a1a2e] rounded-xl p-4 border border-[#4a90e2]/20">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-[#4a90e2] text-xl mb-1">47</div>
              <div className="text-[#a8a8b8] text-[10px]">Pity Counter</div>
            </div>
            <div className="text-center border-l border-r border-white/5">
              <div className="text-[#f5a623] text-xl mb-1">{primogems.toLocaleString()}</div>
              <div className="text-[#a8a8b8] text-[10px]">Primogems</div>
            </div>
            <div className="text-center">
              <div className="text-[#7b68ee] text-xl mb-1">8</div>
              <div className="text-[#a8a8b8] text-[10px]">Fates</div>
            </div>
          </div>
        </div>
      </div>

      {/* Wish Buttons */}
      <div className="px-5 mb-6">
        <div className="space-y-3">
          <button 
            onClick={() => onWish('1')}
            className="w-full bg-gradient-to-r from-[#4a90e2] to-[#7b68ee] rounded-xl p-4 flex items-center justify-between group hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="text-white">Wish ×1</div>
                <div className="text-white/80 text-xs">160 Primogems</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
          </button>

          <button 
            onClick={() => onWish('10')}
            className="w-full bg-gradient-to-r from-[#e6be8a] to-[#d4a574] rounded-xl p-4 flex items-center justify-between group hover:scale-[1.02] transition-transform text-[rgb(23,22,62)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="text-[rgb(30,22,62)]">Wish ×10</div>
                <div className="text-white/80 text-xs text-[rgba(30,22,62,0.8)]">1600 Primogems</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Wish History */}
      <div className="px-5">
        <button className="w-full bg-[#16213e]/50 rounded-xl p-3 flex items-center justify-between hover:bg-[#16213e]/70 transition-colors">
          <span className="text-[#a8a8b8] text-sm">Wish History</span>
          <ChevronRight className="w-4 h-4 text-[#a8a8b8]" />
        </button>
      </div>
    </div>
  );
}