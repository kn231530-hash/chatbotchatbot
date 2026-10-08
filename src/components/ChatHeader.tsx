import React from 'react';
import {
  ArrowLeft,
  Phone,
  Video,
  Search,
  MoreVertical,
  PanelRight,
  Sparkles,
} from 'lucide-react';
import { Participant } from '../types/chat';

interface ChatHeaderProps {
  participant: Participant;
  onBackMobile: () => void;
  onStartVoiceCall: () => void;
  onStartVideoCall: () => void;
  onToggleSearch: () => void;
  onToggleProfileDrawer: () => void;
  isProfileOpen: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  participant,
  onBackMobile,
  onStartVoiceCall,
  onStartVideoCall,
  onToggleSearch,
  onToggleProfileDrawer,
  isProfileOpen,
}) => {
  return (
    <header className="h-[64px] px-4 bg-[#F0F2F5] border-b border-[#E9EDEF] flex items-center justify-between shrink-0 select-none z-10 shadow-xs">
      {/* Left: Mobile back button + Avatar + Name & Subtitle */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Back Button */}
        <button
          type="button"
          onClick={onBackMobile}
          className="md:hidden p-2 -ml-2 rounded-full text-[#54656F] hover:bg-[#E9EDEF] hover:text-[#1F2C34] transition-colors"
          aria-label="Back to chat list"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Avatar with click to open profile */}
        <div
          className="relative cursor-pointer group shrink-0"
          onClick={onToggleProfileDrawer}
          title="View profile details"
        >
          <img
            src={participant.avatar}
            alt={participant.name}
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-full object-cover border border-black/10 group-hover:ring-2 group-hover:ring-[#128C7E] transition-all"
          />
          {participant.isAI ? (
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#075E54] text-white flex items-center justify-center ring-2 ring-[#F0F2F5]">
              <Sparkles className="w-2 h-2 fill-current" />
            </span>
          ) : (
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-[#F0F2F5] ${
                participant.status === 'online' ? 'bg-[#25D366]' : 'bg-[#8696A0]'
              }`}
            />
          )}
        </div>

        {/* Contact / Bot Information */}
        <div
          className="flex flex-col min-w-0 cursor-pointer"
          onClick={onToggleProfileDrawer}
        >
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-semibold text-[#1F2C34] truncate leading-tight">
              {participant.name}
            </h2>
            {participant.isAI && (
              <span className="text-[10px] font-bold text-[#075E54] bg-[#128C7E]/10 px-1.5 py-0.2 rounded-full border border-[#128C7E]/20">
                VERIFIED BOT
              </span>
            )}
          </div>
          <p className="text-[12px] text-[#667781] truncate leading-tight mt-0.5">
            {participant.statusText || (participant.isAI ? 'Generative Intelligence • Online' : 'Active now')}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Audio Call */}
        <button
          type="button"
          onClick={onStartVoiceCall}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#54656F] hover:bg-[#E9EDEF] hover:text-[#128C7E] transition-colors"
          title="Voice Call"
          aria-label="Start voice call"
        >
          <Phone className="w-5 h-5" />
        </button>

        {/* Video Call */}
        <button
          type="button"
          onClick={onStartVideoCall}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#54656F] hover:bg-[#E9EDEF] hover:text-[#128C7E] transition-colors"
          title="Video Call"
          aria-label="Start video call"
        >
          <Video className="w-5 h-5" />
        </button>

        {/* In-chat Search */}
        <button
          type="button"
          onClick={onToggleSearch}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#54656F] hover:bg-[#E9EDEF] hover:text-[#128C7E] transition-colors"
          title="Search in conversation"
          aria-label="Search conversation"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Divider */}
        <div className="w-[1px] h-6 bg-[#E9EDEF] mx-1 hidden sm:block" />

        {/* Profile / Details Drawer Toggle */}
        <button
          type="button"
          onClick={onToggleProfileDrawer}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            isProfileOpen
              ? 'bg-[#128C7E]/15 text-[#128C7E]'
              : 'text-[#54656F] hover:bg-[#E9EDEF] hover:text-[#128C7E]'
          }`}
          title="Contact & Bot Info"
          aria-label="Open profile details drawer"
        >
          <PanelRight className="w-5 h-5" />
        </button>

        {/* More Options */}
        <button
          type="button"
          onClick={onToggleProfileDrawer}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#54656F] hover:bg-[#E9EDEF] hover:text-[#128C7E] transition-colors sm:hidden"
          title="More options"
          aria-label="More options"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
