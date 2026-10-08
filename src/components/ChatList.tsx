import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  CheckCheck,
  Check,
  Pin,
  VolumeX,
  Plus,
  X,
  Code2,
  FileText,
  Palette,
  Database,
  Users,
  Building2,
  Phone,
  Briefcase,
  MessageCircle,
  UserPlus,
} from 'lucide-react';
import { Conversation, ChatFilter } from '../types/chat';

interface ChatListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  activeFilter: ChatFilter;
  setActiveFilter: (filter: ChatFilter) => void;
  onOpenNewChat: () => void;
  onOpenDialer?: () => void;
  onOpenAddContact?: () => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  activeFilter,
  setActiveFilter,
  onOpenNewChat,
  onOpenDialer,
  onOpenAddContact,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering
  const filteredConversations = conversations.filter((c) => {
    // Filter chip check
    if (activeFilter === 'client_leads' && !(c.participant.category === 'Client Lead' || c.participant.clientLead)) return false;
    if (activeFilter === 'us_companies' && !(c.participant.isUSCompany || c.participant.category === 'USA Enterprise')) return false;
    if (activeFilter === 'unread' && c.unreadCount === 0) return false;
    if (activeFilter === 'ai' && !c.participant.isAI) return false;
    if (activeFilter === 'teams' && c.participant.isAI) return false;
    if (activeFilter === 'favorites' && !c.isFavorite) return false;

    // Search query check
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const nameMatch = c.participant.name.toLowerCase().includes(q);
    const roleMatch = c.participant.role.toLowerCase().includes(q);
    const lastMsgMatch = c.lastMessage.toLowerCase().includes(q);
    const categoryMatch = c.participant.category?.toLowerCase().includes(q);
    return nameMatch || roleMatch || lastMsgMatch || categoryMatch;
  });

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'Architecture':
        return <Sparkles className="w-3 h-3 text-[#075E54]" />;
      case 'Code Review':
        return <Code2 className="w-3 h-3 text-[#075E54]" />;
      case 'Design & UX':
        return <Palette className="w-3 h-3 text-[#075E54]" />;
      case 'Data & SQL':
        return <Database className="w-3 h-3 text-[#075E54]" />;
      case 'Company & KRA':
        return <Building2 className="w-3 h-3 text-[#075E54]" />;
      case 'USA Enterprise':
        return <Building2 className="w-3 h-3 text-[#128C7E]" />;
      case 'Client Lead':
        return <Briefcase className="w-3 h-3 text-[#25D366]" />;
      case 'Writing':
        return <FileText className="w-3 h-3 text-[#075E54]" />;
      default:
        return <Users className="w-3 h-3 text-[#075E54]" />;
    }
  };

  return (
    <div className="w-full md:w-[380px] lg:w-[400px] h-full flex flex-col bg-[#FFFFFF] border-r border-[#E9EDEF] shrink-0 relative select-none">
      {/* Top Header */}
      <div className="px-4 pt-4 pb-2 bg-[#F0F2F5] border-b border-[#E9EDEF]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h1 className="text-[22px] font-bold tracking-tight text-[#1F2C34]">Chats</h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#128C7E]/10 text-[#075E54]">
              {conversations.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenAddContact}
              className="p-2 rounded-full hover:bg-[#E9EDEF] text-[#54656F] hover:text-[#128C7E] transition-colors"
              title="Add New Phone Number / Contact"
            >
              <UserPlus className="w-4.5 h-4.5" />
            </button>
            <button
              type="button"
              onClick={onOpenDialer}
              className="p-2 rounded-full hover:bg-[#E9EDEF] text-[#54656F] hover:text-[#128C7E] transition-colors"
              title="Open Phone Dialer & Keypad"
            >
              <Phone className="w-4.5 h-4.5" />
            </button>
            <button
              type="button"
              onClick={onOpenNewChat}
              className="p-2 rounded-full hover:bg-[#E9EDEF] text-[#54656F] hover:text-[#128C7E] transition-colors"
              title="New Chat or AI Assistant"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Input Box */}
        <div className="relative flex items-center mb-2">
          <Search className="w-4 h-4 text-[#667781] absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search or ask an AI agent..."
            className="w-full h-9 pl-9 pr-8 bg-[#FFFFFF] rounded-lg text-sm text-[#1F2C34] placeholder-[#667781] border border-transparent focus:border-[#128C7E]/40 focus:outline-none transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 p-1 text-[#667781] hover:text-[#1F2C34]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'client_leads', label: 'Clients (Web & Bots)' },
              { id: 'us_companies', label: 'USA Companies' },
              { id: 'unread', label: 'Unread' },
              { id: 'ai', label: 'AI Bots' },
              { id: 'teams', label: 'Team' },
              { id: 'favorites', label: 'Starred' },
            ] as const
          ).map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#128C7E] text-white shadow-xs'
                    : 'bg-[#FFFFFF] text-[#54656F] hover:bg-[#E9EDEF] border border-[#E9EDEF]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat List Rows (72px fixed height) */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#F0F2F5]">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-[#667781] h-64">
            <Search className="w-8 h-8 mb-2 stroke-1 text-[#8696A0]" />
            <p className="text-sm font-medium">No conversations found</p>
            <p className="text-xs text-[#8696A0] mt-1">Try adjusting your filter or search query</p>
          </div>
        ) : (
          filteredConversations.map((c) => {
            const isSelected = activeConversationId === c.id;
            const isAI = c.participant.isAI;
            const lastMsg = c.messages[c.messages.length - 1];
            const isOutgoing = lastMsg ? lastMsg.isOutgoing : false;

            return (
              <div
                key={c.id}
                onClick={() => onSelectConversation(c.id)}
                className={`relative flex items-center h-[72px] px-4 cursor-pointer transition-colors group ${
                  isSelected
                    ? 'bg-[#E9EDEF]'
                    : 'hover:bg-[#F5F6F6] bg-[#FFFFFF]'
                }`}
              >
                {/* Avatar with Status Ring */}
                <div className="relative w-[52px] h-[52px] shrink-0 mr-3">
                  <img
                    src={c.participant.avatar}
                    alt={c.participant.name}
                    referrerPolicy="no-referrer"
                    className="w-[52px] h-[52px] rounded-full object-cover shadow-xs border border-black/5"
                  />
                  {/* Status Ring / AI spark */}
                  {isAI ? (
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-full bg-[#075E54] text-white flex items-center justify-center ring-2 ring-white shadow-xs"
                      title="Verified AI Agent"
                    >
                      <Sparkles className="w-2.5 h-2.5 fill-current" />
                    </span>
                  ) : (
                    <span
                      className={`absolute bottom-0 right-0 w-[14px] h-[14px] rounded-full ring-2 ring-white ${
                        c.participant.status === 'online' ? 'bg-[#25D366]' : 'bg-[#8696A0]'
                      }`}
                    />
                  )}
                </div>

                {/* Right Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center h-full">
                  {/* Top Tier: Name & Timestamp */}
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5 min-w-0 pr-2">
                      <span className="text-[15px] font-semibold text-[#1F2C34] truncate">
                        {c.participant.name}
                      </span>
                      {isAI && c.participant.category && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#128C7E]/10 border border-[#128C7E]/20 text-[10px] font-semibold text-[#075E54] shrink-0">
                          {getCategoryIcon(c.participant.category)}
                          <span>{c.participant.category}</span>
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[11px] shrink-0 ${
                        c.unreadCount > 0 ? 'text-[#25D366] font-semibold' : 'text-[#667781]'
                      }`}
                    >
                      {c.lastTimestamp}
                    </span>
                  </div>

                  {/* Bottom Tier: Preview & Badges */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 min-w-0 text-[13px] text-[#667781] pr-2">
                      {/* Read receipts for user's outgoing message */}
                      {isOutgoing && (
                        <span className="shrink-0">
                          {lastMsg?.status === 'read' ? (
                            <CheckCheck className="w-4 h-4 text-[#25D366]" />
                          ) : (
                            <Check className="w-4 h-4 text-[#8696A0]" />
                          )}
                        </span>
                      )}
                      <span className="truncate">
                        {c.lastMessage}
                      </span>
                    </div>

                    {/* Right indicators: Pin / Mute / Unread Badge */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {c.isMuted && <VolumeX className="w-3.5 h-3.5 text-[#8696A0]" />}
                      {c.isPinned && <Pin className="w-3.5 h-3.5 text-[#8696A0] fill-current" />}
                      {c.unreadCount > 0 && (
                        <span className="min-w-[18px] h-[18px] px-1.5 rounded-full bg-[#25D366] text-white text-[11px] font-bold flex items-center justify-center">
                          {c.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Subtle row bottom divider line starting at 80px */}
                <div className="absolute bottom-0 left-[80px] right-0 h-[1px] bg-[#F0F2F5]" />
              </div>
            );
          })
        )}
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        type="button"
        onClick={onOpenNewChat}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center fab-glow hover:scale-105 active:scale-95 transition-all z-10"
        title="Start New Conversation or AI Agent"
        aria-label="New chat"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>
    </div>
  );
};
