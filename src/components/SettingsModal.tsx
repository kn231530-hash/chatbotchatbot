import React from 'react';
import {
  X,
  User,
  Shield,
  Bell,
  Sparkles,
  Database,
  Moon,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';
import { Participant } from '../types/chat';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Participant;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-[#E9EDEF] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#F0F2F5] border-b border-[#E9EDEF] flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1F2C34]">Settings & Preferences</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#E9EDEF] text-[#54656F] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex flex-col gap-5">
          {/* User Profile Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F0F2F5] border border-[#E9EDEF]">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-full object-cover ring-2 ring-[#128C7E]"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-[#1F2C34]">{currentUser.name}</h3>
              <p className="text-xs font-semibold text-[#075E54]">{currentUser.role}</p>
              <p className="text-xs text-[#667781] truncate">{currentUser.email}</p>
            </div>
          </div>

          {/* Design System & Aesthetics */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-[#075E54] uppercase tracking-wider">
              Visual Design & Canvas Theme
            </span>
            <div className="p-3.5 rounded-2xl border border-[#E9EDEF] bg-white flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#1F2C34]">Modern Slate & Emerald</p>
                <p className="text-xs text-[#667781]">Tactile warm paper canvas (#ECE5DD) + Deep teal & emerald accents</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#128C7E]/10 text-[#075E54] text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                Active
              </span>
            </div>
          </div>

          {/* AI Engine Status */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-[#075E54] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#128C7E]" />
              Generative Intelligence Engine
            </span>
            <div className="p-3.5 rounded-2xl border border-[#E9EDEF] bg-[#F0F2F5]/60 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#54656F]">Active Architecture Model:</span>
                <span className="font-mono font-semibold text-[#1F2C34]">Gemini 2.5 Flash</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#54656F]">Streaming Buffer Latency:</span>
                <span className="font-mono text-[#25D366] font-bold">~42ms (Optimized)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#54656F]">Code Highlighting:</span>
                <span className="text-[#1F2C34] font-medium">TypeScript, Go, SQL, Python</span>
              </div>
            </div>
          </div>

          {/* Privacy & Encryption */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-[#075E54] uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#128C7E]" />
              Security Protocol
            </span>
            <div className="p-3.5 rounded-2xl border border-[#128C7E]/20 bg-[#E7FCE3]/40 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#1F2C34]">Signal Protocol Encrypted</p>
                <p className="text-xs text-[#667781]">256-bit AES ratchet with zero server-side plaintext storage</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-[#25D366] shrink-0" />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-[#F0F2F5] border-t border-[#E9EDEF] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#128C7E] text-white text-xs font-semibold hover:bg-[#075E54] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
