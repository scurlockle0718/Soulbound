import { Package, Sword, Shield, Sparkles, Droplet, Flame, X, TrendingUp, Zap } from 'lucide-react';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';

type ItemType = 'weapon' | 'artifact' | 'material';
type ItemRarity = 1 | 2 | 3 | 4 | 5;

interface Item {
  id: number;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  level?: number;
  quantity?: number;
  description: string;
  image: string;
  element?: 'anemo' | 'geo' | 'electro' | 'pyro' | 'hydro';
}

interface ObjectsScreenProps {
  items: Item[];
}

type FilterType = 'all' | ItemType;

export function ObjectsScreen({ items }: ObjectsScreenProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.type === filter);

  return (
    <div className="h-full overflow-y-auto pb-24">
      {/* Header */}
      <div className="p-5 bg-gradient-to-b from-[#2a2a4e] to-transparent">
        <div className="flex items-center gap-3 mb-2">
          <Package className="w-6 h-6 text-[#7b68ee]" />
          <h2 className="text-[#e8e8e8]">Inventory</h2>
        </div>
        <p className="text-[#a8a8b8] text-xs">Manage your items and equipment</p>
      </div>

      {/* Filter Tabs */}
      <div className="px-5 mb-6">
        <div className="flex gap-2 bg-[#16213e]/50 rounded-xl p-1">
          <FilterButton
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            icon={<Package className="w-4 h-4" />}
            label="All"
          />
          <FilterButton
            active={filter === 'weapon'}
            onClick={() => setFilter('weapon')}
            icon={<Sword className="w-4 h-4" />}
            label="Weapons"
          />
          <FilterButton
            active={filter === 'artifact'}
            onClick={() => setFilter('artifact')}
            icon={<Shield className="w-4 h-4" />}
            label="Artifacts"
          />
          <FilterButton
            active={filter === 'material'}
            onClick={() => setFilter('material')}
            icon={<Sparkles className="w-4 h-4" />}
            label="Materials"
          />
        </div>
      </div>

      {/* Items Grid */}
      <div className="px-5">
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
          ))}
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && createPortal(
        <ItemDetail item={selectedItem} onClose={() => setSelectedItem(null)} />,
        document.body
      )}
    </div>
  );
}

function FilterButton({ 
  active, 
  onClick, 
  icon, 
  label 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${
        active 
          ? 'bg-gradient-to-br from-[#4a90e2] to-[#7b68ee] text-white' 
          : 'bg-transparent text-[#a8a8b8] hover:text-[#e8e8e8]'
      }`}
    >
      {icon}
      <span className="text-xs hidden sm:inline">{label}</span>
    </button>
  );
}

function ItemCard({ item, onClick }: { item: Item; onClick: () => void }) {
  const getRarityColor = (rarity: ItemRarity) => {
    switch (rarity) {
      case 5: return 'from-[#e6be8a] to-[#c9a05e]';
      case 4: return 'from-[#8b5cf6] to-[#7c3aed]';
      case 3: return 'from-[#4a90e2] to-[#3b82f6]';
      case 2: return 'from-[#4ade80] to-[#22c55e]';
      case 1: return 'from-[#6b7280] to-[#4b5563]';
      default: return 'from-[#6b7280] to-[#4b5563]';
    }
  };

  const getElementIcon = (element?: Item['element']) => {
    if (!element) return null;
    switch (element) {
      case 'anemo': return <Droplet className="w-3 h-3 text-[#4fb3bf]" />;
      case 'pyro': return <Flame className="w-3 h-3 text-[#ef4444]" />;
      case 'hydro': return <Droplet className="w-3 h-3 text-[#3b82f6]" />;
      case 'electro': return <Sparkles className="w-3 h-3 text-[#a855f7]" />;
      case 'geo': return <Shield className="w-3 h-3 text-[#f59e0b]" />;
    }
  };

  return (
    <button 
      onClick={onClick}
      className="bg-[#16213e]/80 backdrop-blur-sm rounded-xl overflow-hidden border border-white/5 hover:scale-[1.02] transition-transform text-left"
    >
      {/* Image Header */}
      <div className="relative h-32 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(item.rarity)} opacity-20`} />
        <ImageWithFallback
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          {item.element && (
            <div className="w-6 h-6 rounded-full bg-[#1a1a2e]/80 backdrop-blur-sm flex items-center justify-center">
              {getElementIcon(item.element)}
            </div>
          )}
        </div>
        {item.quantity && (
          <div className="absolute bottom-2 right-2 bg-[#1a1a2e]/90 backdrop-blur-sm px-2 py-1 rounded-lg">
            <span className="text-[#e8e8e8] text-xs">×{item.quantity}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="flex items-center gap-1 mb-1">
          {[...Array(item.rarity)].map((_, i) => (
            <div 
              key={i} 
              className="w-1 h-1 rounded-full"
              style={{ background: `linear-gradient(to right, ${getRarityColor(item.rarity).split(' ')[0].replace('from-', '')}, ${getRarityColor(item.rarity).split(' ')[1].replace('to-', '')})` }}
            />
          ))}
        </div>
        <h3 className="text-[#e8e8e8] text-sm mb-1 line-clamp-1">{item.name}</h3>
        <p className="text-[#a8a8b8] text-[10px] leading-relaxed line-clamp-2 mb-2">
          {item.description}
        </p>
        {item.level && (
          <div className="pt-2 border-t border-white/5">
            <span className="text-[#4a90e2] text-xs">Lv. {item.level}</span>
          </div>
        )}
      </div>
    </button>
  );
}

function ItemDetail({ item, onClose }: { item: Item; onClose: () => void }) {
  const getRarityColor = (rarity: ItemRarity) => {
    switch (rarity) {
      case 5: return '#e6be8a';
      case 4: return '#8b5cf6';
      case 3: return '#4a90e2';
      case 2: return '#4ade80';
      case 1: return '#94a3b8';
    }
  };

  const getRarityGradient = (rarity: ItemRarity) => {
    switch (rarity) {
      case 5: return 'from-[#e6be8a] to-[#c9a05e]';
      case 4: return 'from-[#8b5cf6] to-[#7c3aed]';
      case 3: return 'from-[#4a90e2] to-[#3b82f6]';
      case 2: return 'from-[#4ade80] to-[#22c55e]';
      case 1: return 'from-[#94a3b8] to-[#64748b]';
    }
  };

  const getElementIcon = (element?: Item['element']) => {
    if (!element) return null;
    switch (element) {
      case 'anemo': return <Droplet className="w-5 h-5 text-[#4fb3bf]" />;
      case 'pyro': return <Flame className="w-5 h-5 text-[#ef4444]" />;
      case 'hydro': return <Droplet className="w-5 h-5 text-[#3b82f6]" />;
      case 'electro': return <Sparkles className="w-5 h-5 text-[#a855f7]" />;
      case 'geo': return <Shield className="w-5 h-5 text-[#f59e0b]" />;
    }
  };

  const getElementName = (element?: Item['element']) => {
    if (!element) return null;
    return element.charAt(0).toUpperCase() + element.slice(1);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in p-4">
      <div className="w-full max-w-[412px] bg-[#16213e] rounded-3xl border border-white/10 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom">
        {/* Header with Image */}
        <div className="relative">
          <div className="relative h-64 overflow-hidden">
            <div 
              className={`absolute inset-0 bg-gradient-to-br ${getRarityGradient(item.rarity)} opacity-30`} 
            />
            <ImageWithFallback
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#16213e] via-transparent to-transparent" />
            
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1a1a2e]/80 backdrop-blur-sm flex items-center justify-center hover:bg-[#1a1a2e] transition-colors z-10"
            >
              <X className="w-5 h-5 text-[#e8e8e8]" />
            </button>

            {/* Rarity Stars */}
            <div className="absolute top-4 left-4 flex items-center gap-1">
              {[...Array(item.rarity)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${getRarityColor(item.rarity)}40` }}
                >
                  <Sparkles className="w-3 h-3" style={{ color: getRarityColor(item.rarity) }} />
                </div>
              ))}
            </div>

            {/* Item Info Overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-end justify-between">
                <div>
                  <span 
                    className="text-[10px] uppercase px-2 py-1 rounded mb-2 inline-block"
                    style={{ 
                      backgroundColor: `${getRarityColor(item.rarity)}20`,
                      color: getRarityColor(item.rarity)
                    }}
                  >
                    {item.type}
                  </span>
                  <h2 className="text-white drop-shadow-lg">{item.name}</h2>
                  {item.level && (
                    <span className="text-[#4a90e2] text-sm">Level {item.level}</span>
                  )}
                  {item.quantity && (
                    <span className="text-[#e8e8e8] text-sm">Quantity: ×{item.quantity}</span>
                  )}
                </div>
                {item.element && (
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${getRarityColor(item.rarity)}20` }}
                  >
                    {getElementIcon(item.element)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-[#e8e8e8] mb-2 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#4a90e2]" />
              Description
            </h3>
            <p className="text-[#a8a8b8] text-sm leading-relaxed">{item.description}</p>
          </div>

          {/* Stats for Weapons/Artifacts */}
          {(item.type === 'weapon' || item.type === 'artifact') && (
            <div>
              <h3 className="text-[#e8e8e8] mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#4a90e2]" />
                Stats
              </h3>
              <div className="space-y-2">
                {item.type === 'weapon' && (
                  <>
                    <div className="bg-[#1a1a2e]/50 rounded-lg p-3 flex items-center justify-between">
                      <span className="text-[#a8a8b8] text-sm">Base ATK</span>
                      <span className="text-[#e8e8e8]">{Math.floor(Math.random() * 200) + 300}</span>
                    </div>
                    <div className="bg-[#1a1a2e]/50 rounded-lg p-3 flex items-center justify-between">
                      <span className="text-[#a8a8b8] text-sm">Sub Stat</span>
                      <span className="text-[#4a90e2]">Energy Recharge +{Math.floor(Math.random() * 20) + 30}%</span>
                    </div>
                  </>
                )}
                {item.type === 'artifact' && (
                  <>
                    <div className="bg-[#1a1a2e]/50 rounded-lg p-3 flex items-center justify-between">
                      <span className="text-[#a8a8b8] text-sm">Main Stat</span>
                      <span className="text-[#e8e8e8]">ATK +{Math.floor(Math.random() * 20) + 30}%</span>
                    </div>
                    <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
                      <span className="text-[#a8a8b8] text-sm block mb-2">Sub Stats</span>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between text-[#e8e8e8]">
                          <span>CRIT Rate</span>
                          <span>+{(Math.random() * 10 + 5).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-[#e8e8e8]">
                          <span>CRIT DMG</span>
                          <span>+{(Math.random() * 20 + 10).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Element Info */}
          {item.element && (
            <div>
              <h3 className="text-[#e8e8e8] mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#4a90e2]" />
                Element
              </h3>
              <div className="bg-[#1a1a2e]/50 rounded-lg p-3 flex items-center gap-3">
                {getElementIcon(item.element)}
                <span className="text-[#e8e8e8]">{getElementName(item.element)}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {(item.type === 'weapon' || item.type === 'artifact') && (
              <>
                <button 
                  className="flex-1 bg-gradient-to-r from-[#4a90e2] to-[#7b68ee] rounded-xl p-3 text-white hover:scale-[1.02] transition-transform"
                >
                  Enhance
                </button>
                <button 
                  className="flex-1 bg-[#1a1a2e]/50 border border-white/10 rounded-xl p-3 text-[#e8e8e8] hover:bg-[#1a1a2e] transition-colors"
                >
                  Equip
                </button>
              </>
            )}
            {item.type === 'material' && (
              <button 
                className="flex-1 bg-[#1a1a2e]/50 border border-white/10 rounded-xl p-3 text-[#e8e8e8] hover:bg-[#1a1a2e] transition-colors"
              >
                Use Item
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}