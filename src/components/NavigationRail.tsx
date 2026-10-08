import React from 'react';
import { MessageSquare, Bot, Phone, Star, Settings, ShieldCheck } from 'lucide-react';
import { Participant } from '../types/chat';

interface NavigationRailProps {
  activeTab: 'chats' | 'ai' | 'calls' | 'starred' | 'settings';
  setActiveTab: (tab: 'chats' | 'ai' | 'calls' | 'starred' | 'settings') => void;
  unreadTotal: number;
  currentUser: Participant;
  onOpenSettings: () => void;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({
  activeTab,
  setActiveTab,
  unreadTotal,
  currentUser,
  onOpenSettings,
}) => {
  return (
    <aside className="w-[68px] bg-[#121B22] flex flex-col items-center justify-between py-4 select-none shrink-0 border-r border-[#1F2C34]/50 z-20">
      {/* Top brand & nav items */}
      <div className="flex flex-col items-center gap-6 w-full">
        {/* Brand App Icon */}
        <div
          className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#075E54] to-[#128C7E] flex items-center justify-center text-white shadow-md shadow-[#000000]/20 cursor-pointer hover:scale-105 transition-transform"
          title="Slate & Emerald Messaging"
          onClick={() => setActiveTab('chats')}
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6 fill-white/20 stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#25D366] ring-2 ring-[#121B22]" />
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex flex-col items-center gap-2 w-full px-2" aria-label="Main Navigation">
          {/* Chats */}
          <button
            type="button"
            onClick={() => setActiveTab('chats')}
            className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-colors group ${
              activeTab === 'chats'
                ? 'bg-[#128C7E]/20 text-[#25D366]'
                : 'text-[#8696A0] hover:text-[#E9EDEF] hover:bg-[#202C33]'
            }`}
            title="All Chats"
          >
            <MessageSquare className="w-5 h-5" />
            {unreadTotal > 0 && (
              <span className="absolute top-2 right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-[#25D366] text-[#121B22] text-[10px] font-bold flex items-center justify-center ring-2 ring-[#121B22]">
                {unreadTotal}
              </span>
            )}
          </button>

          {/* AI Assistants Hub */}
          <button
            type="button"
            onClick={() => setActiveTab('ai')}
            className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-colors group ${
              activeTab === 'ai'
                ? 'bg-[#128C7E]/20 text-[#25D366]'
                : 'text-[#8696A0] hover:text-[#E9EDEF] hover:bg-[#202C33]'
            }`}
            title="AI Assistant Hub"
          >
            <Bot className="w-5 h-5" />
            <span className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#25D366]/80 ring-1 ring-[#121B22]" />
          </button>

          {/* Starred */}
          <button
            type="button"
            onClick={() => setActiveTab('starred')}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              activeTab === 'starred'
                ? 'bg-[#128C7E]/20 text-[#25D366]'
                : 'text-[#8696A0] hover:text-[#E9EDEF] hover:bg-[#202C33]'
            }`}
            title="Starred Messages"
          >
            <Star className="w-5 h-5" />
          </button>

          {/* Calls */}
          <button
            type="button"
            onClick={() => setActiveTab('calls')}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              activeTab === 'calls'
                ? 'bg-[#128C7E]/20 text-[#25D366]'
                : 'text-[#8696A0] hover:text-[#E9EDEF] hover:bg-[#202C33]'
            }`}
            title="Voice & Video Calls"
          >
            <Phone className="w-5 h-5" />
          </button>
        </nav>
      </div>

      {/* Bottom actions & user avatar */}
      <div className="flex flex-col items-center gap-3 w-full px-2">
        {/* Security badge tooltip */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-[#8696A0] hover:text-[#25D366] transition-colors cursor-pointer"
          title="End-to-End Encryption Verified"
        >
          <ShieldCheck className="w-5 h-5" />
        </div>

        {/* Settings button */}
        <button
          type="button"
          onClick={onOpenSettings}
          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
            activeTab === 'settings'
              ? 'bg-[#128C7E]/20 text-[#25D366]'
              : 'text-[#8696A0] hover:text-[#E9EDEF] hover:bg-[#202C33]'
          }`}
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Current user avatar */}
        <div className="relative mt-1 cursor-pointer group" onClick={onOpenSettings} title={currentUser.name}>
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-[#075E54] group-hover:ring-[#25D366] transition-all"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] rounded-full ring-2 ring-[#121B22]" />
        </div>
      </div>
    </aside>
  );
};
