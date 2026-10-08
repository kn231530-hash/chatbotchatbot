import React, { useState } from 'react';
import {
  X,
  Search,
  Sparkles,
  Bot,
  User,
  Plus,
  Code2,
  Palette,
  Database,
  FileText,
  Sliders,
  Building2,
} from 'lucide-react';
import { Participant } from '../types/chat';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBots: Participant[];
  onStartChatWithParticipant: (participant: Participant) => void;
  onCreateCustomBot: (bot: Partial<Participant>) => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  isOpen,
  onClose,
  availableBots,
  onStartChatWithParticipant,
  onCreateCustomBot,
}) => {
  const [activeTab, setActiveTab] = useState<'agents' | 'custom'>('agents');
  const [search, setSearch] = useState('');

  // Custom Bot Form State
  const [botName, setBotName] = useState('');
  const [botRole, setBotRole] = useState('');
  const [botCategory, setBotCategory] = useState<'Architecture' | 'Code Review' | 'Design & UX' | 'Data & SQL' | 'Writing' | 'Company & KRA'>('Company & KRA');
  const [botBio, setBotBio] = useState('');
  const [temperature, setTemperature] = useState(0.3);

  if (!isOpen) return null;

  const filteredBots = availableBots.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.role.toLowerCase().includes(search.toLowerCase()) ||
      b.category?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!botName.trim() || !botRole.trim()) return;

    onCreateCustomBot({
      name: botName.trim(),
      role: botRole.trim(),
      category: botCategory,
      bio: botBio.trim() || `Specialized AI agent focusing on ${botCategory}.`,
      isAI: true,
      status: 'online',
      statusText: `${botCategory} • Ready for queries`,
      model: 'Gemini 2.5 Flash Custom',
      temperature,
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      capabilities: [`Specialized in ${botCategory}`, 'Contextual code & architecture analysis'],
      promptStarters: [
        `Help me optimize my ${botCategory.toLowerCase()} project`,
        `What are the industry best practices for ${botCategory.toLowerCase()}?`,
      ],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-[#E9EDEF] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#F0F2F5] border-b border-[#E9EDEF] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#1F2C34]">New Conversation</h2>
            <p className="text-xs text-[#667781]">Connect with teammates or verified AI agents</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#E9EDEF] text-[#54656F] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#E9EDEF] px-6 pt-3 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('agents')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors mr-6 ${
              activeTab === 'agents'
                ? 'border-[#128C7E] text-[#075E54]'
                : 'border-transparent text-[#667781] hover:text-[#1F2C34]'
            }`}
          >
            <Bot className="w-4 h-4 text-[#128C7E]" />
            AI Bot Directory
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'custom'
                ? 'border-[#128C7E] text-[#075E54]'
                : 'border-transparent text-[#667781] hover:text-[#1F2C34]'
            }`}
          >
            <Plus className="w-4 h-4 text-[#128C7E]" />
            Deploy Custom Agent
          </button>
        </div>

        {/* Tab 1: AI Directory */}
        {activeTab === 'agents' && (
          <div className="p-6 flex flex-col gap-4 overflow-y-auto flex-1">
            {/* Search */}
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#667781] absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search bot catalog by skill..."
                className="w-full h-10 pl-9 pr-4 bg-[#F0F2F5] rounded-xl text-sm text-[#1F2C34] placeholder-[#667781] border border-transparent focus:border-[#128C7E]/40 focus:outline-none"
              />
            </div>

            {/* List */}
            <div className="flex flex-col gap-2.5">
              {filteredBots.map((bot) => (
                <div
                  key={bot.id}
                  onClick={() => {
                    onStartChatWithParticipant(bot);
                    onClose();
                  }}
                  className="flex items-center gap-3.5 p-3 rounded-2xl border border-[#E9EDEF] hover:border-[#128C7E]/40 hover:bg-[#F5F6F6] cursor-pointer transition-all group"
                >
                  <div className="relative">
                    <img
                      src={bot.avatar}
                      alt={bot.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover shadow-xs"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#075E54] text-white flex items-center justify-center ring-2 ring-white">
                      <Sparkles className="w-2.5 h-2.5" />
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#1F2C34] group-hover:text-[#128C7E] transition-colors">
                        {bot.name}
                      </h4>
                      {bot.category && (
                        <span className="text-[10px] font-semibold text-[#075E54] bg-[#128C7E]/10 px-2 py-0.5 rounded-full border border-[#128C7E]/20">
                          {bot.category}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#54656F] font-medium truncate">{bot.role}</p>
                    <p className="text-[11px] text-[#8696A0] truncate mt-0.5">{bot.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Deploy Custom Agent */}
        {activeTab === 'custom' && (
          <form onSubmit={handleCreateCustom} className="p-6 flex flex-col gap-4 overflow-y-auto flex-1">
            <div>
              <label className="text-xs font-semibold text-[#54656F] block mb-1">
                Assistant Name
              </label>
              <input
                type="text"
                required
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                placeholder="e.g. Nexus, Ada, or Sentinel"
                className="w-full h-10 px-3 bg-[#F0F2F5] rounded-xl text-sm border border-transparent focus:border-[#128C7E] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#54656F] block mb-1">
                Specialization / Role
              </label>
              <input
                type="text"
                required
                value={botRole}
                onChange={(e) => setBotRole(e.target.value)}
                placeholder="e.g. Lead Kubernetes Reliability Specialist"
                className="w-full h-10 px-3 bg-[#F0F2F5] rounded-xl text-sm border border-transparent focus:border-[#128C7E] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#54656F] block mb-1">
                Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    'Company & KRA',
                    'Architecture',
                    'Code Review',
                    'Design & UX',
                    'Data & SQL',
                    'Writing',
                  ] as const
                ).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setBotCategory(cat)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-left flex items-center gap-2 transition-all ${
                      botCategory === cat
                        ? 'border-[#128C7E] bg-[#128C7E]/10 text-[#075E54] font-semibold'
                        : 'border-[#E9EDEF] bg-white text-[#54656F] hover:bg-[#F0F2F5]'
                    }`}
                  >
                    {cat === 'Company & KRA' && <Building2 className="w-3.5 h-3.5 text-[#128C7E]" />}
                    {cat === 'Architecture' && <Sparkles className="w-3.5 h-3.5 text-[#128C7E]" />}
                    {cat === 'Code Review' && <Code2 className="w-3.5 h-3.5 text-[#128C7E]" />}
                    {cat === 'Design & UX' && <Palette className="w-3.5 h-3.5 text-[#128C7E]" />}
                    {cat === 'Data & SQL' && <Database className="w-3.5 h-3.5 text-[#128C7E]" />}
                    {cat === 'Writing' && <FileText className="w-3.5 h-3.5 text-[#128C7E]" />}
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#54656F] block mb-1">
                System Prompt / Directive
              </label>
              <textarea
                rows={3}
                value={botBio}
                onChange={(e) => setBotBio(e.target.value)}
                placeholder="Instruct the agent on tone, formatting, and domain knowledge..."
                className="w-full p-3 bg-[#F0F2F5] rounded-xl text-sm border border-transparent focus:border-[#128C7E] focus:outline-none resize-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-[#54656F] mb-1">
                <span className="flex items-center gap-1 font-semibold">
                  <Sliders className="w-3 h-3 text-[#128C7E]" />
                  Temperature: {temperature}
                </span>
                <span className="text-[10px] text-[#667781]">Deterministic ↔ Creative</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-[#128C7E] h-1.5 bg-[#CBD5E1] rounded-lg cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-[#F0F2F5] flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium rounded-xl hover:bg-[#F0F2F5] text-[#54656F]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white shadow-xs"
              >
                Launch Bot Thread
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
