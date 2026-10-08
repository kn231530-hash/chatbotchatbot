import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Phone,
  Video,
  Star,
  Bell,
  BellOff,
  ShieldCheck,
  FileText,
  Image as ImageIcon,
  ChevronRight,
  Sliders,
  Terminal,
  Trash2,
  Copy,
  Check,
} from 'lucide-react';
import { Participant } from '../types/chat';

interface ProfileDrawerProps {
  participant: Participant;
  isOpen: boolean;
  onClose: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onStartVoiceCall: () => void;
  onStartVideoCall: () => void;
  onClearChat: () => void;
  onImageClick?: (url: string, title: string) => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  participant,
  isOpen,
  onClose,
  isMuted,
  onToggleMute,
  isFavorite,
  onToggleFavorite,
  onStartVoiceCall,
  onStartVideoCall,
  onClearChat,
  onImageClick,
}) => {
  const [temperature, setTemperature] = useState(participant.temperature ?? 0.3);
  const [copiedFingerprint, setCopiedFingerprint] = useState(false);

  if (!isOpen) return null;

  const handleCopyFingerprint = () => {
    navigator.clipboard.writeText('884F 29A1 D603 B4C8 920E FE12 7701 4C58');
    setCopiedFingerprint(true);
    setTimeout(() => setCopiedFingerprint(false), 2000);
  };

  return (
    <aside className="w-full sm:w-[360px] lg:w-[380px] h-full bg-[#FFFFFF] border-l border-[#E9EDEF] flex flex-col shrink-0 overflow-y-auto select-none z-30 shadow-xl">
      {/* Drawer Header */}
      <div className="h-[64px] px-4 bg-[#F0F2F5] border-b border-[#E9EDEF] flex items-center justify-between shrink-0">
        <h3 className="text-base font-semibold text-[#1F2C34]">
          {participant.isAI ? 'AI Assistant Profile' : 'Contact Overview'}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full hover:bg-[#E9EDEF] text-[#54656F] transition-colors"
          aria-label="Close profile drawer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-5">
        {/* Centered 72px Avatar & Name Card */}
        <div className="flex flex-col items-center text-center pb-4 border-b border-[#F0F2F5]">
          <div className="relative mb-3">
            <img
              src={participant.avatar}
              alt={participant.name}
              referrerPolicy="no-referrer"
              className="w-[76px] h-[76px] rounded-full object-cover shadow-sm ring-4 ring-[#128C7E]/10"
            />
            {participant.isAI ? (
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#075E54] text-white flex items-center justify-center ring-2 ring-white shadow-xs">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
              </span>
            ) : (
              <span
                className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ring-2 ring-white ${
                  participant.status === 'online' ? 'bg-[#25D366]' : 'bg-[#8696A0]'
                }`}
              />
            )}
          </div>

          <div className="flex items-center gap-1.5 justify-center">
            <h2 className="text-lg font-bold text-[#1F2C34]">{participant.name}</h2>
            {participant.isAI && (
              <span className="w-2 h-2 rounded-full bg-[#25D366]" title="Operational" />
            )}
          </div>
          <p className="text-xs font-semibold text-[#075E54] mt-0.5">{participant.role}</p>
          <p className="text-xs text-[#667781] mt-1 max-w-[260px] leading-relaxed">
            {participant.bio}
          </p>

          {/* Action Row */}
          <div className="flex items-center justify-center gap-3 mt-4 w-full">
            <button
              type="button"
              onClick={onStartVoiceCall}
              className="flex-1 py-2 px-3 rounded-xl bg-[#F0F2F5] hover:bg-[#E9EDEF] text-[#128C7E] flex flex-col items-center gap-1 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="text-[11px] font-semibold">Audio</span>
            </button>

            <button
              type="button"
              onClick={onStartVideoCall}
              className="flex-1 py-2 px-3 rounded-xl bg-[#F0F2F5] hover:bg-[#E9EDEF] text-[#128C7E] flex flex-col items-center gap-1 transition-colors"
            >
              <Video className="w-4 h-4" />
              <span className="text-[11px] font-semibold">Video</span>
            </button>

            <button
              type="button"
              onClick={onToggleFavorite}
              className={`flex-1 py-2 px-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                isFavorite
                  ? 'bg-[#128C7E]/10 text-[#075E54]'
                  : 'bg-[#F0F2F5] hover:bg-[#E9EDEF] text-[#54656F]'
              }`}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-current text-[#075E54]' : ''}`} />
              <span className="text-[11px] font-semibold">Starred</span>
            </button>

            <button
              type="button"
              onClick={onToggleMute}
              className={`flex-1 py-2 px-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                isMuted
                  ? 'bg-amber-50 text-amber-800'
                  : 'bg-[#F0F2F5] hover:bg-[#E9EDEF] text-[#54656F]'
              }`}
            >
              {isMuted ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              <span className="text-[11px] font-semibold">{isMuted ? 'Muted' : 'Mute'}</span>
            </button>
          </div>
        </div>

        {/* AI Model Architecture & Engine Specs (If AI Assistant) */}
        {participant.isAI && (
          <div className="bg-[#F0F2F5]/80 rounded-2xl p-4 border border-[#E9EDEF] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#075E54] flex items-center gap-1.5 uppercase tracking-wider">
                <Terminal className="w-3.5 h-3.5 text-[#128C7E]" />
                Engine Specs
              </span>
              <span className="text-[11px] font-mono text-[#667781] px-2 py-0.5 rounded-full bg-white border border-[#E9EDEF]">
                {participant.model || 'Gemini 2.5 Flash'}
              </span>
            </div>

            {/* Temperature Slider */}
            <div>
              <div className="flex items-center justify-between text-xs text-[#54656F] mb-1">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-[#128C7E]" />
                  Temperature / Creativity
                </span>
                <span className="font-mono text-[#1F2C34] font-semibold">{temperature.toFixed(2)}</span>
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

            {/* Core Capabilities */}
            {participant.capabilities && (
              <div className="mt-1">
                <span className="text-[11px] font-semibold text-[#54656F] block mb-1.5">
                  Verified Capabilities
                </span>
                <div className="flex flex-col gap-1.5">
                  {participant.capabilities.map((cap, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs text-[#1F2C34] bg-white px-2.5 py-1.5 rounded-lg border border-[#E9EDEF]"
                    >
                      <Sparkles className="w-3 h-3 text-[#25D366] shrink-0" />
                      <span className="truncate">{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Contact Information (If human team member) */}
        {!participant.isAI && (
          <div className="bg-[#F0F2F5]/80 rounded-2xl p-4 border border-[#E9EDEF] flex flex-col gap-2 text-xs">
            <span className="font-bold text-[#075E54] uppercase tracking-wider text-[11px]">
              Direct Contact
            </span>
            {participant.email && (
              <div className="flex items-center justify-between py-1">
                <span className="text-[#667781]">Email</span>
                <span className="text-[#1F2C34] font-medium">{participant.email}</span>
              </div>
            )}
            {participant.phone && (
              <div className="flex items-center justify-between py-1 border-t border-[#E9EDEF]">
                <span className="text-[#667781]">Phone</span>
                <span className="text-[#1F2C34] font-medium">{participant.phone}</span>
              </div>
            )}
          </div>
        )}

        {/* Shared Media, Links & Docs */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#1F2C34] flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#128C7E]" />
              Media, Links and Docs
            </span>
            <span className="text-xs text-[#128C7E] hover:underline cursor-pointer">
              3 items
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div
              onClick={() =>
                onImageClick?.(
                  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
                  'Workspace architectural photography'
                )
              }
              className="aspect-square rounded-xl overflow-hidden bg-slate-200 cursor-pointer hover:opacity-90 transition-opacity border border-black/5"
            >
              <img
                src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=300&auto=format&fit=crop&q=80"
                alt="Shared media"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="aspect-square rounded-xl bg-[#F0F2F5] border border-[#E9EDEF] p-2 flex flex-col justify-between text-left hover:bg-[#E9EDEF] cursor-pointer transition-colors">
              <FileText className="w-5 h-5 text-[#128C7E]" />
              <div>
                <p className="text-[10px] font-bold text-[#1F2C34] truncate">gateway.ts</p>
                <p className="text-[9px] text-[#667781]">14 KB</p>
              </div>
            </div>

            <div className="aspect-square rounded-xl bg-[#F0F2F5] border border-[#E9EDEF] p-2 flex flex-col justify-between text-left hover:bg-[#E9EDEF] cursor-pointer transition-colors">
              <FileText className="w-5 h-5 text-[#075E54]" />
              <div>
                <p className="text-[10px] font-bold text-[#1F2C34] truncate">schema.sql</p>
                <p className="text-[9px] text-[#667781]">28 KB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Encryption Verification */}
        <div className="bg-[#E7FCE3]/50 rounded-2xl p-4 border border-[#128C7E]/20 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#075E54]">
            <ShieldCheck className="w-4 h-4 text-[#128C7E]" />
            <h4 className="text-xs font-bold">End-to-End Encryption</h4>
          </div>
          <p className="text-[11px] text-[#3D4946] leading-relaxed">
            Messages and calls are end-to-end encrypted with Signal Protocol AES-256. Not even emerald servers can read them.
          </p>

          <div className="mt-1 pt-2 border-t border-[#128C7E]/15 flex items-center justify-between text-[11px]">
            <span className="font-mono text-[#667781]">Key: 884F...4C58</span>
            <button
              type="button"
              onClick={handleCopyFingerprint}
              className="text-[#075E54] hover:text-[#128C7E] flex items-center gap-1 font-semibold"
            >
              {copiedFingerprint ? (
                <>
                  <Check className="w-3 h-3 text-[#25D366]" />
                  <span>Verified</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Destructive Actions */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClearChat}
            className="w-full py-2.5 px-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 flex items-center justify-center gap-2 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Message History
          </button>
        </div>
      </div>
    </aside>
  );
};
