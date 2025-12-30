import { ArrowLeft, Plus, Trash2, Edit2, Save, Download, Upload, Image } from 'lucide-react';
import { useState, useRef } from 'react';
import { OpeningCutscene } from './OpeningCutscene';
import { EpilogueScreen } from './EpilogueScreen';
import type { Message } from './MessagesScreen';
import * as api from '../utils/api';

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
  rewardTypes?: ('currency' | 'weapon' | 'artifact' | 'material')[];
  progress: number;
  difficulty: number;
  type: 'main' | 'side' | 'commission';
  completed: boolean;
  tasks: QuestTask[];
  subQuests?: number[];
  bonusRewards?: string[];
  bonusRewardTypes?: ('currency' | 'weapon' | 'artifact' | 'material')[];
  lore?: string;
}

interface Item {
  id: number;
  name: string;
  type: 'weapon' | 'artifact' | 'currency' | 'material';
  rarity: number;
  level?: number;
  quantity?: number;
  description: string;
  image: string;
  element?: string;
}

interface AdminScreenProps {
  quests: Quest[];
  setQuests: React.Dispatch<React.SetStateAction<Quest[]>>;
  inventory: Item[];
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>;
  prologueText: string;
  setPrologueText: React.Dispatch<React.SetStateAction<string>>;
  epilogueText: string;
  setEpilogueText: React.Dispatch<React.SetStateAction<string>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  prologueMusicUrl: string;
  setPrologueMusicUrl: React.Dispatch<React.SetStateAction<string>>;
  epilogueMusicUrl: string;
  setEpilogueMusicUrl: React.Dispatch<React.SetStateAction<string>>;
  onExit: () => void;
}

type AdminTab = 'quests' | 'inventory' | 'narratives' | 'messages';

export function AdminScreen({ quests, setQuests, inventory, setInventory, prologueText, setPrologueText, epilogueText, setEpilogueText, messages, setMessages, prologueMusicUrl, setPrologueMusicUrl, epilogueMusicUrl, setEpilogueMusicUrl, onExit }: AdminScreenProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('quests');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>('');

  const handleManualSave = async () => {
    setIsSaving(true);
    try {
      console.log('💾 Manually saving all global templates...');
      console.log('  - Quests:', quests.length);
      console.log('  - Inventory:', inventory.length);
      
      await Promise.all([
        api.saveGlobalQuests(quests),
        api.saveGlobalInventory(inventory),
        api.saveNarratives(prologueText, epilogueText)
      ]);
      
      const now = new Date().toLocaleTimeString();
      setLastSaved(now);
      console.log('✅ All global templates saved successfully!');
      alert(`✅ All changes saved successfully!\n\n${quests.length} quests, ${inventory.length} items, and narratives are now live for all users.`);
    } catch (error) {
      console.error('❌ Failed to save global templates:', error);
      alert('❌ Failed to save changes. Please check the console for details.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = () => {
    const data = {
      quests,
      inventory,
      prologueText,
      epilogueText,
      messages,
      prologueMusicUrl,
      epilogueMusicUrl
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'teyvat-data.json';
    a.click();
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            if (data.quests) setQuests(data.quests);
            if (data.inventory) setInventory(data.inventory);
            if (data.prologueText) setPrologueText(data.prologueText);
            if (data.epilogueText) setEpilogueText(data.epilogueText);
            if (data.messages) setMessages(data.messages);
            if (data.prologueMusicUrl) setPrologueMusicUrl(data.prologueMusicUrl);
            if (data.epilogueMusicUrl) setEpilogueMusicUrl(data.epilogueMusicUrl);
            alert('Data imported successfully!');
          } catch (error) {
            alert('Error importing data. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="w-full h-full bg-[#1a1a2e] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#e6be8a] to-[#d4a574] p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h2 className="text-[rgb(30,22,62)]">Admin Mode</h2>
            <p className="text-xs text-[#1E163E]">Content Management</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleImportData}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            title="Import Data"
          >
            <Upload className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={handleExportData}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            title="Export Data"
          >
            <Download className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 bg-[#16213e]">
        <button
          onClick={() => setActiveTab('quests')}
          className={`flex-1 py-3 px-4 transition-colors ${
            activeTab === 'quests'
              ? 'text-[#4a90e2] border-b-2 border-[#4a90e2]'
              : 'text-[#a8a8b8]'
          }`}
        >
          Quests
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 py-3 px-4 transition-colors ${
            activeTab === 'inventory'
              ? 'text-[#4a90e2] border-b-2 border-[#4a90e2]'
              : 'text-[#a8a8b8]'
          }`}
        >
          Inventory Items
        </button>
        <button
          onClick={() => setActiveTab('narratives')}
          className={`flex-1 py-3 px-4 transition-colors ${
            activeTab === 'narratives'
              ? 'text-[#4a90e2] border-b-2 border-[#4a90e2]'
              : 'text-[#a8a8b8]'
          }`}
        >
          Narratives
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex-1 py-3 px-4 transition-colors ${
            activeTab === 'messages'
              ? 'text-[#4a90e2] border-b-2 border-[#4a90e2]'
              : 'text-[#a8a8b8]'
          }`}
        >
          Messages
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'quests' && (
          <QuestEditor quests={quests} setQuests={setQuests} />
        )}
        {activeTab === 'inventory' && (
          <InventoryEditor inventory={inventory} setInventory={setInventory} />
        )}
        {activeTab === 'narratives' && (
          <NarrativesEditor prologueText={prologueText} setPrologueText={setPrologueText} epilogueText={epilogueText} setEpilogueText={setEpilogueText} prologueMusicUrl={prologueMusicUrl} setPrologueMusicUrl={setPrologueMusicUrl} epilogueMusicUrl={epilogueMusicUrl} setEpilogueMusicUrl={setEpilogueMusicUrl} />
        )}
        {activeTab === 'messages' && (
          <MessagesEditor messages={messages} setMessages={setMessages} />
        )}
      </div>

      {/* Save Button */}
      <div className="p-5 bg-[#16213e] border-t border-white/10">
        <button
          onClick={handleManualSave}
          className={`w-full bg-gradient-to-r from-[#4a90e2] to-[#7b68ee] rounded-xl p-4 flex items-center justify-center gap-2 text-white hover:scale-[1.02] transition-transform ${
            isSaving ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isSaving}
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Saving...' : 'Save All Changes'}
        </button>
        {lastSaved && (
          <p className="text-[#a8a8b8] text-xs mt-2 text-center">
            Last saved: {lastSaved}
          </p>
        )}
      </div>
    </div>
  );
}

function QuestEditor({ quests, setQuests }: { quests: Quest[]; setQuests: React.Dispatch<React.SetStateAction<Quest[]>> }) {
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleAddQuest = () => {
    const newQuest: Quest = {
      id: Math.max(...quests.map(q => q.id), 0) + 1,
      title: "New Quest",
      description: "Quest description",
      location: "Location",
      rewards: ["Primogems x50"],
      rewardTypes: ['currency'],
      progress: 0,
      difficulty: 3,
      type: 'side',
      completed: false,
      tasks: [
        { id: 1, description: "Task 1", completed: false }
      ],
      subQuests: [],
      bonusRewards: []
    };
    setEditingQuest(newQuest);
    setIsCreating(true);
  };

  const handleSaveQuest = () => {
    if (!editingQuest) return;
    
    if (isCreating) {
      setQuests(prev => [...prev, editingQuest]);
      setIsCreating(false);
    } else {
      setQuests(prev => prev.map(q => q.id === editingQuest.id ? editingQuest : q));
    }
    setEditingQuest(null);
  };

  const handleDeleteQuest = (id: number) => {
    if (confirm('Are you sure you want to delete this quest?')) {
      setQuests(prev => prev.filter(q => q.id !== id));
    }
  };

  const handleCancel = () => {
    setEditingQuest(null);
    setIsCreating(false);
  };

  if (editingQuest) {
    return <QuestForm quest={editingQuest} setQuest={setEditingQuest} onSave={handleSaveQuest} onCancel={handleCancel} allQuests={quests} />;
  }

  return (
    <div className="p-5 space-y-3">
      <button
        onClick={handleAddQuest}
        className="w-full bg-gradient-to-r from-[#4a90e2] to-[#7b68ee] rounded-xl p-4 flex items-center justify-center gap-2 text-white hover:scale-[1.02] transition-transform"
      >
        <Plus className="w-5 h-5" />
        Add New Quest
      </button>

      {quests.map(quest => (
        <div key={quest.id} className="bg-[#16213e] rounded-xl p-4 border border-white/10">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-[#e8e8e8] mb-1">{quest.title}</h3>
              <p className="text-[#a8a8b8] text-xs mb-2">{quest.description}</p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-[10px] bg-[#4a90e2]/20 text-[#4a90e2] px-2 py-1 rounded">
                  {quest.type}
                </span>
                <span className="text-[10px] bg-[#7b68ee]/20 text-[#7b68ee] px-2 py-1 rounded">
                  {(quest.tasks || []).length} tasks
                </span>
                <span className="text-[10px] bg-[#f5a623]/20 text-[#f5a623] px-2 py-1 rounded">
                  {(quest.rewards || []).length} rewards
                </span>
                {quest.subQuests && quest.subQuests.length > 0 && (
                  <span className="text-[10px] bg-[#ef4444]/20 text-[#ef4444] px-2 py-1 rounded">
                    {quest.subQuests.length} sub-quests
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2 ml-3">
              <button
                onClick={() => setEditingQuest(quest)}
                className="w-8 h-8 rounded-full bg-[#4a90e2]/20 flex items-center justify-center hover:bg-[#4a90e2]/30 transition-colors"
              >
                <Edit2 className="w-4 h-4 text-[#4a90e2]" />
              </button>
              <button
                onClick={() => handleDeleteQuest(quest.id)}
                className="w-8 h-8 rounded-full bg-[#ef4444]/20 flex items-center justify-center hover:bg-[#ef4444]/30 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-[#ef4444]" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function QuestForm({ 
  quest, 
  setQuest, 
  onSave, 
  onCancel,
  allQuests
}: { 
  quest: Quest; 
  setQuest: (quest: Quest) => void; 
  onSave: () => void;
  onCancel: () => void;
  allQuests: Quest[];
}) {
  const handleAddTask = () => {
    const newTask = {
      id: Math.max(...(quest.tasks || []).map(t => t.id), 0) + 1,
      description: "New task",
      completed: false
    };
    setQuest({ ...quest, tasks: [...(quest.tasks || []), newTask] });
  };

  const handleRemoveTask = (taskId: number) => {
    setQuest({ ...quest, tasks: (quest.tasks || []).filter(t => t.id !== taskId) });
  };

  const handleUpdateTask = (taskId: number, description: string) => {
    setQuest({
      ...quest,
      tasks: (quest.tasks || []).map(t => t.id === taskId ? { ...t, description } : t)
    });
  };

  const handleAddReward = () => {
    setQuest({ 
      ...quest, 
      rewards: [...(quest.rewards || []), "New Reward x1"],
      rewardTypes: [...(quest.rewardTypes || []), 'currency']
    });
  };

  const handleRemoveReward = (index: number) => {
    setQuest({ 
      ...quest, 
      rewards: (quest.rewards || []).filter((_, i) => i !== index),
      rewardTypes: (quest.rewardTypes || []).filter((_, i) => i !== index)
    });
  };

  const handleUpdateReward = (index: number, value: string) => {
    setQuest({
      ...quest,
      rewards: (quest.rewards || []).map((r, i) => i === index ? value : r)
    });
  };

  const handleUpdateRewardType = (index: number, type: 'currency' | 'weapon' | 'artifact' | 'material') => {
    const newRewardTypes = [...(quest.rewardTypes || [])];
    newRewardTypes[index] = type;
    setQuest({
      ...quest,
      rewardTypes: newRewardTypes
    });
  };

  const handleAddBonusReward = () => {
    setQuest({ 
      ...quest, 
      bonusRewards: [...(quest.bonusRewards || []), "Bonus Reward x1"],
      bonusRewardTypes: [...(quest.bonusRewardTypes || []), 'currency']
    });
  };

  const handleRemoveBonusReward = (index: number) => {
    setQuest({ 
      ...quest, 
      bonusRewards: quest.bonusRewards?.filter((_, i) => i !== index),
      bonusRewardTypes: quest.bonusRewardTypes?.filter((_, i) => i !== index)
    });
  };

  const handleUpdateBonusReward = (index: number, value: string) => {
    setQuest({
      ...quest,
      bonusRewards: quest.bonusRewards?.map((r, i) => i === index ? value : r)
    });
  };

  const handleUpdateBonusRewardType = (index: number, type: 'currency' | 'weapon' | 'artifact' | 'material') => {
    const newBonusRewardTypes = [...(quest.bonusRewardTypes || [])];
    newBonusRewardTypes[index] = type;
    setQuest({
      ...quest,
      bonusRewardTypes: newBonusRewardTypes
    });
  };

  const handleRemoveSubQuest = (subQuestId: number) => {
    setQuest({ ...quest, subQuests: quest.subQuests?.filter(id => id !== subQuestId) });
  };

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#e8e8e8]">Edit Quest</h3>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-[#16213e] text-[#a8a8b8] hover:bg-[#1a1a2e] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#4a90e2] to-[#7b68ee] text-white hover:scale-[1.02] transition-transform flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[#a8a8b8] text-xs mb-1 block">Title</label>
          <input
            type="text"
            value={quest.title}
            onChange={(e) => setQuest({ ...quest, title: e.target.value })}
            className="w-full bg-[#16213e] border border-white/10 rounded-lg p-3 text-[#e8e8e8] focus:outline-none focus:border-[#4a90e2]"
          />
        </div>

        <div>
          <label className="text-[#a8a8b8] text-xs mb-1 block">Description</label>
          <textarea
            value={quest.description}
            onChange={(e) => setQuest({ ...quest, description: e.target.value })}
            className="w-full bg-[#16213e] border border-white/10 rounded-lg p-3 text-[#e8e8e8] focus:outline-none focus:border-[#4a90e2] min-h-[80px]"
          />
        </div>

        <div>
          <label className="text-[#a8a8b8] text-xs mb-1 block">Lore (Background Story)</label>
          <textarea
            value={quest.lore || ''}
            onChange={(e) => setQuest({ ...quest, lore: e.target.value })}
            className="w-full bg-[#16213e] border border-white/10 rounded-lg p-3 text-[#e8e8e8] focus:outline-none focus:border-[#4a90e2] min-h-[120px]"
            placeholder="Enter the deep lore and background story for this quest..."
          />
        </div>

        <div>
          <label className="text-[#a8a8b8] text-xs mb-1 block">Location</label>
          <input
            type="text"
            value={quest.location}
            onChange={(e) => setQuest({ ...quest, location: e.target.value })}
            className="w-full bg-[#16213e] border border-white/10 rounded-lg p-3 text-[#e8e8e8] focus:outline-none focus:border-[#4a90e2]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[#a8a8b8] text-xs mb-1 block">Type</label>
            <select
              value={quest.type}
              onChange={(e) => setQuest({ ...quest, type: e.target.value as Quest['type'] })}
              className="w-full bg-[#16213e] border border-white/10 rounded-lg p-3 text-[#e8e8e8] focus:outline-none focus:border-[#4a90e2]"
            >
              <option value="main">Main</option>
              <option value="side">Side</option>
              <option value="commission">Commission</option>
            </select>
          </div>

          <div>
            <label className="text-[#a8a8b8] text-xs mb-1 block">Difficulty (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={quest.difficulty}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '') {
                  setQuest({ ...quest, difficulty: 1 });
                } else {
                  const num = parseInt(val);
                  if (!isNaN(num) && num >= 1 && num <= 5) {
                    setQuest({ ...quest, difficulty: num });
                  }
                }
              }}
              className="w-full bg-[#16213e] border border-white/10 rounded-lg p-3 text-[#e8e8e8] focus:outline-none focus:border-[#4a90e2]"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[#a8a8b8] text-xs">Tasks</label>
            <button
              onClick={handleAddTask}
              className="text-[#4a90e2] text-xs flex items-center gap-1 hover:text-[#7b68ee]"
            >
              <Plus className="w-3 h-3" />
              Add Task
            </button>
          </div>
          <div className="space-y-2">
            {(quest.tasks || []).map((task, index) => (
              <div key={task.id} className="flex gap-2">
                <input
                  type="text"
                  value={task.description}
                  onChange={(e) => handleUpdateTask(task.id, e.target.value)}
                  className="flex-1 bg-[#16213e] border border-white/10 rounded-lg p-2 text-[#e8e8e8] text-sm focus:outline-none focus:border-[#4a90e2]"
                  placeholder={`Task ${index + 1}`}
                />
                <button
                  onClick={() => handleRemoveTask(task.id)}
                  className="w-8 h-8 rounded-lg bg-[#ef4444]/20 flex items-center justify-center hover:bg-[#ef4444]/30 transition-colors"
                >
                  <Trash2 className="w-3 h-3 text-[#ef4444]" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[#a8a8b8] text-xs">Rewards</label>
            <button
              onClick={handleAddReward}
              className="text-[#4a90e2] text-xs flex items-center gap-1 hover:text-[#7b68ee]"
            >
              <Plus className="w-3 h-3" />
              Add Reward
            </button>
          </div>
          <div className="space-y-2">
            {(quest.rewards || []).map((reward, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={reward}
                  onChange={(e) => handleUpdateReward(index, e.target.value)}
                  className="flex-1 bg-[#16213e] border border-white/10 rounded-lg p-2 text-[#e8e8e8] text-sm focus:outline-none focus:border-[#4a90e2]"
                  placeholder="Item Name x Amount"
                />
                <select
                  value={(quest.rewardTypes || [])[index] || 'currency'}
                  onChange={(e) => handleUpdateRewardType(index, e.target.value as 'currency' | 'weapon' | 'artifact' | 'material')}
                  className="bg-[#16213e] border border-white/10 rounded-lg p-2 text-[#e8e8e8] text-sm focus:outline-none focus:border-[#4a90e2]"
                >
                  <option value="currency">Currency</option>
                  <option value="weapon">Weapon</option>
                  <option value="artifact">Artifact</option>
                  <option value="material">Material</option>
                </select>
                <button
                  onClick={() => handleRemoveReward(index)}
                  className="w-8 h-8 rounded-lg bg-[#ef4444]/20 flex items-center justify-center hover:bg-[#ef4444]/30 transition-colors"
                >
                  <Trash2 className="w-3 h-3 text-[#ef4444]" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[#a8a8b8] text-xs">Bonus Rewards</label>
            <button
              onClick={handleAddBonusReward}
              className="text-[#4a90e2] text-xs flex items-center gap-1 hover:text-[#7b68ee]"
            >
              <Plus className="w-3 h-3" />
              Add Bonus Reward
            </button>
          </div>
          <div className="space-y-2">
            {quest.bonusRewards?.map((reward, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={reward}
                  onChange={(e) => handleUpdateBonusReward(index, e.target.value)}
                  className="flex-1 bg-[#16213e] border border-white/10 rounded-lg p-2 text-[#e8e8e8] text-sm focus:outline-none focus:border-[#4a90e2]"
                  placeholder="Item Name x Amount"
                />
                <select
                  value={quest.bonusRewardTypes?.[index] || 'currency'}
                  onChange={(e) => handleUpdateBonusRewardType(index, e.target.value as 'currency' | 'weapon' | 'artifact' | 'material')}
                  className="w-20 bg-[#16213e] border border-white/10 rounded-lg p-2 text-[#e8e8e8] text-sm focus:outline-none focus:border-[#4a90e2]"
                >
                  <option value="currency">Currency</option>
                  <option value="weapon">Weapon</option>
                  <option value="artifact">Artifact</option>
                  <option value="material">Material</option>
                </select>
                <button
                  onClick={() => handleRemoveBonusReward(index)}
                  className="w-8 h-8 rounded-lg bg-[#ef4444]/20 flex items-center justify-center hover:bg-[#ef4444]/30 transition-colors"
                >
                  <Trash2 className="w-3 h-3 text-[#ef4444]" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {quest.type === 'main' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[#a8a8b8] text-xs">Embedded Side Quests</label>
            </div>
            <select
              onChange={(e) => {
                const id = parseInt(e.target.value);
                if (id && !quest.subQuests?.includes(id)) {
                  setQuest({ ...quest, subQuests: [...(quest.subQuests || []), id] });
                }
                e.target.value = '';
              }}
              className="w-full bg-[#16213e] border border-white/10 rounded-lg p-3 text-[#e8e8e8] focus:outline-none focus:border-[#4a90e2] mb-2"
              defaultValue=""
            >
              <option value="" disabled>Select a side quest...</option>
              {allQuests
                .filter(q => q.type === 'side' && q.id !== quest.id && !quest.subQuests?.includes(q.id))
                .map(q => (
                  <option key={q.id} value={q.id}>
                    {q.title} (ID: {q.id})
                  </option>
                ))}
            </select>
            <div className="space-y-2">
              {quest.subQuests?.map((subQuestId) => {
                const subQuest = allQuests.find(q => q.id === subQuestId);
                return (
                  <div key={subQuestId} className="flex gap-2 items-center bg-[#1a1a2e]/50 rounded-lg p-3">
                    <div className="flex-1">
                      <p className="text-[#e8e8e8] text-sm">{subQuest?.title || `Quest ID: ${subQuestId}`}</p>
                      <p className="text-[#a8a8b8] text-xs">{subQuest?.description || 'Quest not found'}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveSubQuest(subQuestId)}
                      className="w-8 h-8 rounded-lg bg-[#ef4444]/20 flex items-center justify-center hover:bg-[#ef4444]/30 transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-[#ef4444]" />
                    </button>
                  </div>
                );
              })}
              {(!quest.subQuests || quest.subQuests.length === 0) && (
                <p className="text-[#a8a8b8] text-xs italic">No sub-quests added yet</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InventoryEditor({ inventory, setInventory }: { inventory: Item[]; setInventory: React.Dispatch<React.SetStateAction<Item[]>> }) {
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddItem = () => {
    const newItem: Item = {
      id: Math.max(...inventory.map(i => i.id), 0) + 1,
      name: "New Item",
      type: 'material',
      rarity: 3,
      quantity: 1,
      description: "Item description",
      image: 'https://images.unsplash.com/photo-1743448111530-3654e7b66f26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWdpY2FsJTIwY3J5c3RhbCUyMGdlbXxlbnwxfHx8fDE3NjUxMTYyNjF8MA&ixlib=rb-4.1.0&q=80&w=1080'
    };
    setInventory(prev => [...prev, newItem]);
    setEditingItem(newItem);
  };

  const handleSaveItem = () => {
    if (!editingItem) return;
    setInventory(prev => prev.map(i => i.id === editingItem.id ? editingItem : i));
    setEditingItem(null);
  };

  const handleDeleteItem = (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setInventory(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (editingItem) {
          setEditingItem({ ...editingItem, image: event.target?.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (editingItem) {
    return (
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#e8e8e8]">Edit Item</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setEditingItem(null)}
              className="px-4 py-2 rounded-lg bg-[#16213e] text-[#a8a8b8] hover:bg-[#1a1a2e] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveItem}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#4a90e2] to-[#7b68ee] text-white hover:scale-[1.02] transition-transform flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[#a8a8b8] text-xs mb-1 block">Name</label>
            <input
              type="text"
              value={editingItem.name}
              onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
              className="w-full bg-[#16213e] border border-white/10 rounded-lg p-3 text-[#e8e8e8] focus:outline-none focus:border-[#4a90e2]"
            />
          </div>

          <div>
            <label className="text-[#a8a8b8] text-xs mb-1 block">Description</label>
            <textarea
              value={editingItem.description}
              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              className="w-full bg-[#16213e] border border-white/10 rounded-lg p-3 text-[#e8e8e8] focus:outline-none focus:border-[#4a90e2] min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#a8a8b8] text-xs mb-1 block">Type</label>
              <select
                value={editingItem.type}
                onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value as Item['type'] })}
                className="w-full bg-[#16213e] border border-white/10 rounded-lg p-3 text-[#e8e8e8] focus:outline-none focus:border-[#4a90e2]"
              >
                <option value="weapon">Weapon</option>
                <option value="artifact">Artifact</option>
                <option value="material">Material</option>
                <option value="currency">Currency</option>
              </select>
            </div>

            <div>
              <label className="text-[#a8a8b8] text-xs mb-1 block">Rarity (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={editingItem.rarity}
                onChange={(e) => setEditingItem({ ...editingItem, rarity: parseInt(e.target.value) || 1 })}
                className="w-full bg-[#16213e] border border-white/10 rounded-lg p-3 text-[#e8e8e8] focus:outline-none focus:border-[#4a90e2]"
              />
            </div>
          </div>

          <div>
            <label className="text-[#a8a8b8] text-xs mb-1 block">Quantity</label>
            <input
              type="number"
              min="0"
              value={editingItem.quantity || 0}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '') {
                  setEditingItem({ ...editingItem, quantity: 0 });
                } else {
                  const num = parseInt(val);
                  if (!isNaN(num) && num >= 0) {
                    setEditingItem({ ...editingItem, quantity: num });
                  }
                }
              }}
              className="w-full bg-[#16213e] border border-white/10 rounded-lg p-3 text-[#e8e8e8] focus:outline-none focus:border-[#4a90e2]"
            />
          </div>

          <div>
            <label className="text-[#a8a8b8] text-xs mb-1 block">Image URL or Upload</label>
            <div className="space-y-2">
              <input
                type="text"
                value={editingItem.image}
                onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                className="w-full bg-[#16213e] border border-white/10 rounded-lg p-3 text-[#e8e8e8] focus:outline-none focus:border-[#4a90e2]"
                placeholder="https://..."
              />
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*,image/svg+xml"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#4a90e2] to-[#7b68ee] text-white hover:scale-[1.02] transition-transform flex items-center gap-2 text-sm"
                >
                  <Image className="w-4 h-4" />
                  Upload Image/SVG
                </button>
                <span className="text-[#a8a8b8] text-xs">Accepts PNG, JPG, SVG</span>
              </div>
              {editingItem.image && (
                <div className="mt-2">
                  <p className="text-[#a8a8b8] text-xs mb-1">Preview:</p>
                  <img 
                    src={editingItem.image} 
                    alt="Preview" 
                    className="w-20 h-20 object-cover rounded-lg border border-white/10"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-3">
      <button
        onClick={handleAddItem}
        className="w-full bg-gradient-to-r from-[#4a90e2] to-[#7b68ee] rounded-xl p-4 flex items-center justify-center gap-2 text-white hover:scale-[1.02] transition-transform"
      >
        <Plus className="w-5 h-5" />
        Add New Item
      </button>

      {inventory.map(item => (
        <div key={item.id} className="bg-[#16213e] rounded-xl p-4 border border-white/10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-[#e8e8e8] mb-1">{item.name}</h3>
              <p className="text-[#a8a8b8] text-xs mb-2">{item.description}</p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-[10px] bg-[#4a90e2]/20 text-[#4a90e2] px-2 py-1 rounded">
                  {item.type}
                </span>
                <span className="text-[10px] bg-[#f5a623]/20 text-[#f5a623] px-2 py-1 rounded">
                  {item.rarity}★
                </span>
                {item.quantity && (
                  <span className="text-[10px] bg-[#7b68ee]/20 text-[#7b68ee] px-2 py-1 rounded">
                    ×{item.quantity}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2 ml-3">
              <button
                onClick={() => setEditingItem(item)}
                className="w-8 h-8 rounded-full bg-[#4a90e2]/20 flex items-center justify-center hover:bg-[#4a90e2]/30 transition-colors"
              >
                <Edit2 className="w-4 h-4 text-[#4a90e2]" />
              </button>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="w-8 h-8 rounded-full bg-[#ef4444]/20 flex items-center justify-center hover:bg-[#ef4444]/30 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-[#ef4444]" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function NarrativesEditor({ prologueText, setPrologueText, epilogueText, setEpilogueText, prologueMusicUrl, setPrologueMusicUrl, epilogueMusicUrl, setEpilogueMusicUrl }: { prologueText: string; setPrologueText: React.Dispatch<React.SetStateAction<string>>; epilogueText: string; setEpilogueText: React.Dispatch<React.SetStateAction<string>>; prologueMusicUrl: string; setPrologueMusicUrl: React.Dispatch<React.SetStateAction<string>>; epilogueMusicUrl: string; setEpilogueMusicUrl: React.Dispatch<React.SetStateAction<string>> }) {
  const [showProloguePreview, setShowProloguePreview] = useState(false);
  const [showEpiloguePreview, setShowEpiloguePreview] = useState(false);

  const handleResetCutscene = () => {
    if (confirm('This will reset the cutscene flag so the prologue plays again on next app load. Continue?')) {
      localStorage.removeItem('soulbound_seen_cutscene');
      alert('Cutscene flag cleared! The prologue will play on next app load.');
    }
  };

  return (
    <>
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#e8e8e8]">Edit Narratives</h3>
          <button
            onClick={handleResetCutscene}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white text-xs hover:scale-[1.02] transition-transform"
          >
            Reset Cutscene Flag
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[#a8a8b8] text-xs">Prologue Text</label>
              <button
                onClick={() => setShowProloguePreview(true)}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#4a90e2] to-[#7b68ee] text-white text-xs hover:scale-[1.02] transition-transform"
              >
                Preview Prologue
              </button>
            </div>
            <textarea
              value={prologueText}
              onChange={(e) => setPrologueText(e.target.value)}
              className="w-full bg-[#16213e] border border-white/10 rounded-lg p-3 text-[#e8e8e8] focus:outline-none focus:border-[#4a90e2] min-h-[150px] font-mono text-sm"
              placeholder="Use double line breaks to separate sections..."
            />
            <p className="text-[#a8a8b8] text-xs mt-1 italic">
              Tip: Use double line breaks (press Enter twice) to separate sections. Each section will appear on its own screen.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[#a8a8b8] text-xs">Epilogue Text</label>
              <button
                onClick={() => setShowEpiloguePreview(true)}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#e6be8a] to-[#d4a574] text-white text-xs hover:scale-[1.02] transition-transform"
              >
                Preview Epilogue
              </button>
            </div>
            <textarea
              value={epilogueText}
              onChange={(e) => setEpilogueText(e.target.value)}
              className="w-full bg-[#16213e] border border-white/10 rounded-lg p-3 text-[#e8e8e8] focus:outline-none focus:border-[#4a90e2] min-h-[150px] font-mono text-sm"
              placeholder="Use double line breaks to separate sections..."
            />
            <p className="text-[#a8a8b8] text-xs mt-1 italic">
              Tip: Use double line breaks (press Enter twice) to separate sections. Each section will appear on its own screen.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[#a8a8b8] text-xs">Prologue Music URL</label>
            </div>
            <input
              type="text"
              value={prologueMusicUrl}
              onChange={(e) => setPrologueMusicUrl(e.target.value)}
              className="w-full bg-[#16213e] border border-white/10 rounded-lg p-3 text-[#e8e8e8] focus:outline-none focus:border-[#4a90e2]"
              placeholder="https://..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[#a8a8b8] text-xs">Epilogue Music URL</label>
            </div>
            <input
              type="text"
              value={epilogueMusicUrl}
              onChange={(e) => setEpilogueMusicUrl(e.target.value)}
              className="w-full bg-[#16213e] border border-white/10 rounded-lg p-3 text-[#e8e8e8] focus:outline-none focus:border-[#4a90e2]"
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      {/* Prologue Preview */}
      {showProloguePreview && (
        <div className="fixed inset-0 z-50">
          <OpeningCutscene 
            onComplete={() => setShowProloguePreview(false)}
            prologueText={prologueText}
            prologueMusicUrl={prologueMusicUrl}
          />
        </div>
      )}

      {/* Epilogue Preview */}
      {showEpiloguePreview && (
        <EpilogueScreen
          onClose={() => setShowEpiloguePreview(false)}
          epilogueText={epilogueText}
          epilogueMusicUrl={epilogueMusicUrl}
        />
      )}
    </>
  );
}

function MessagesEditor({ messages, setMessages }: { messages: Message[]; setMessages: React.Dispatch<React.SetStateAction<Message[]>> }) {
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleAddMessage = () => {
    const now = new Date();
    const formattedDate = now.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
    
    const newMessage: Message = {
      id: Math.max(...messages.map(m => m.id), 0) + 1,
      title: "New Message",
      content: "Message content goes here...",
      sender: "System Admin",
      timestamp: formattedDate,
      read: false,
      priority: 'normal'
    };
    setEditingMessage(newMessage);
    setIsCreating(true);
  };

  const handleSaveMessage = () => {
    if (!editingMessage) return;
    
    if (isCreating) {
      setMessages(prev => [...prev, editingMessage]);
      setIsCreating(false);
    } else {
      setMessages(prev => prev.map(m => m.id === editingMessage.id ? editingMessage : m));
    }
    setEditingMessage(null);
  };

  const handleDeleteMessage = (id: number) => {
    if (confirm('Are you sure you want to delete this message?')) {
      setMessages(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleCancel = () => {
    setEditingMessage(null);
    setIsCreating(false);
  };

  if (editingMessage) {
    return <MessageForm message={editingMessage} setMessage={setEditingMessage} onSave={handleSaveMessage} onCancel={handleCancel} />;
  }

  return (
    <div className="p-5 space-y-3">
      <button
        onClick={handleAddMessage}
        className="w-full bg-gradient-to-r from-[#4a90e2] to-[#7b68ee] rounded-xl p-4 flex items-center justify-center gap-2 text-white hover:scale-[1.02] transition-transform"
      >
        <Plus className="w-5 h-5" />
        Add New Message
      </button>

      {messages.length === 0 && (
        <div className="text-center py-8">
          <p className="text-[#a8a8b8]">No messages yet</p>
          <p className="text-[#a8a8b8]/60 text-xs mt-2">Create a message to send to users</p>
        </div>
      )}

      {messages.map(message => (
        <div key={message.id} className="bg-[#16213e] rounded-xl p-4 border border-white/10">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[#e8e8e8]">{message.title}</h3>
                {!message.read && (
                  <span className="w-2 h-2 bg-[#4a90e2] rounded-full" />
                )}
              </div>
              <p className="text-[#a8a8b8] text-xs mb-2 line-clamp-2">{message.content}</p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-[10px] bg-[#4a90e2]/20 text-[#4a90e2] px-2 py-1 rounded">
                  From: {message.sender}
                </span>
                <span className="text-[10px] bg-[#7b68ee]/20 text-[#7b68ee] px-2 py-1 rounded">
                  {message.timestamp}
                </span>
                <span className={`text-[10px] px-2 py-1 rounded ${
                  message.priority === 'high' ? 'bg-[#ef4444]/20 text-[#ef4444]' :
                  message.priority === 'normal' ? 'bg-[#f5a623]/20 text-[#f5a623]' :
                  'bg-[#a8a8b8]/20 text-[#a8a8b8]'
                }`}>
                  {message.priority}
                </span>
              </div>
            </div>
            <div className="flex gap-2 ml-3">
              <button
                onClick={() => setEditingMessage(message)}
                className="w-8 h-8 rounded-full bg-[#4a90e2]/20 flex items-center justify-center hover:bg-[#4a90e2]/30 transition-colors"
              >
                <Edit2 className="w-4 h-4 text-[#4a90e2]" />
              </button>
              <button
                onClick={() => handleDeleteMessage(message.id)}
                className="w-8 h-8 rounded-full bg-[#ef4444]/20 flex items-center justify-center hover:bg-[#ef4444]/30 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-[#ef4444]" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MessageForm({ 
  message, 
  setMessage, 
  onSave, 
  onCancel
}: { 
  message: Message; 
  setMessage: (message: Message) => void; 
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#e8e8e8]">Edit Message</h3>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-[#16213e] text-[#a8a8b8] hover:bg-[#1a1a2e] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#4a90e2] to-[#7b68ee] text-white hover:scale-[1.02] transition-transform flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save & Push to Users
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[#a8a8b8] text-xs mb-1 block">Title</label>
          <input
            type="text"
            value={message.title}
            onChange={(e) => setMessage({ ...message, title: e.target.value })}
            className="w-full bg-[#16213e] border border-white/10 rounded-lg p-3 text-[#e8e8e8] focus:outline-none focus:border-[#4a90e2]"
            placeholder="Message title"
          />
        </div>

        <div>
          <label className="text-[#a8a8b8] text-xs mb-1 block">Sender Name</label>
          <input
            type="text"
            value={message.sender}
            onChange={(e) => setMessage({ ...message, sender: e.target.value })}
            className="w-full bg-[#16213e] border border-white/10 rounded-lg p-3 text-[#e8e8e8] focus:outline-none focus:border-[#4a90e2]"
            placeholder="System Admin, NPC Name, etc."
          />
        </div>

        <div>
          <label className="text-[#a8a8b8] text-xs mb-1 block">Content</label>
          <textarea
            value={message.content}
            onChange={(e) => setMessage({ ...message, content: e.target.value })}
            className="w-full bg-[#16213e] border border-white/10 rounded-lg p-3 text-[#e8e8e8] focus:outline-none focus:border-[#4a90e2] min-h-[120px]"
            placeholder="Message content..."
          />
        </div>

        <div>
          <label className="text-[#a8a8b8] text-xs mb-1 block">Priority</label>
          <select
            value={message.priority}
            onChange={(e) => setMessage({ ...message, priority: e.target.value as 'low' | 'normal' | 'high' })}
            className="w-full bg-[#16213e] border border-white/10 rounded-lg p-3 text-[#e8e8e8] focus:outline-none focus:border-[#4a90e2]"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="bg-[#4a90e2]/10 border border-[#4a90e2]/30 rounded-lg p-3">
          <p className="text-[#4a90e2] text-xs">
            💡 <strong>Tip:</strong> When you save this message, it will be pushed to all users' message centers as unread.
          </p>
        </div>
      </div>
    </div>
  );
}