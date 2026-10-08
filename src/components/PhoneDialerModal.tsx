import React, { useState } from 'react';
import {
  X,
  Phone,
  Delete,
  Clock,
  BookUser,
  Hash,
  ShieldCheck,
  Building2,
  Sparkles,
  MessageCircle,
  UserPlus,
} from 'lucide-react';
import { Participant } from '../types/chat';
import { playDTMF } from '../utils/audioSystem';

interface PhoneDialerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInitiateCall: (participant: Participant, phoneNumber?: string) => void;
  contacts: Participant[];
  onOpenAddContact?: (initialPhone?: string) => void;
}

interface CallHistoryItem {
  id: string;
  name: string;
  number: string;
  type: 'incoming' | 'outgoing' | 'missed';
  time: string;
  duration: string;
}

const DEFAULT_CALL_HISTORY: CallHistoryItem[] = [
  {
    id: 'ch_0',
    name: 'Sarah Jenkins (Apex Retail NY)',
    number: '+1 (212) 555-0184',
    type: 'incoming',
    time: 'Today 11:00 AM',
    duration: '3m 12s',
  },
  {
    id: 'ch_fin',
    name: 'David Miller (Nova Fintech TX)',
    number: '+1 (512) 555-0192',
    type: 'outgoing',
    time: 'Today 10:50 AM',
    duration: '2m 45s',
  },
  {
    id: 'ch_1',
    name: 'Aya (Company & KRA Registry)',
    number: '+1 (800) 555-4292',
    type: 'outgoing',
    time: 'Today 10:12 AM',
    duration: '2m 14s',
  },
  {
    id: 'ch_str',
    name: 'Stripe USA Enterprise',
    number: '+1 (888) 963-8955',
    type: 'incoming',
    time: 'Today 10:05 AM',
    duration: '1m 40s',
  },
  {
    id: 'ch_2',
    name: 'Marcus Chen',
    number: '+1 (555) 392-8819',
    type: 'incoming',
    time: 'Yesterday 4:20 PM',
    duration: '4m 38s',
  },
];

const DIAL_KEYS = [
  { key: '1', letters: '' },
  { key: '2', letters: 'ABC' },
  { key: '3', letters: 'DEF' },
  { key: '4', letters: 'GHI' },
  { key: '5', letters: 'JKL' },
  { key: '6', letters: 'MNO' },
  { key: '7', letters: 'PQRS' },
  { key: '8', letters: 'TUV' },
  { key: '9', letters: 'WXYZ' },
  { key: '*', letters: '' },
  { key: '0', letters: '+' },
  { key: '#', letters: '' },
];

export const PhoneDialerModal: React.FC<PhoneDialerModalProps> = ({
  isOpen,
  onClose,
  onInitiateCall,
  contacts,
  onOpenAddContact,
}) => {
  const [activeTab, setActiveTab] = useState<'keypad' | 'contacts' | 'history'>('keypad');
  const [dialedNumber, setDialedNumber] = useState('');
  const [callHistory, setCallHistory] = useState<CallHistoryItem[]>(DEFAULT_CALL_HISTORY);

  if (!isOpen) return null;

  const handleKeyPress = (digit: string) => {
    playDTMF(digit);
    setDialedNumber((prev) => prev + digit);
  };

  const handleBackspace = () => {
    setDialedNumber((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setDialedNumber('');
  };

  const handleCallDialed = () => {
    if (!dialedNumber) return;

    // Check if dialed number matches a contact
    const matched = contacts.find((c) => c.phone?.replace(/\D/g, '') === dialedNumber.replace(/\D/g, ''));

    const targetParticipant: Participant = matched || {
      id: `phone_user_${Date.now()}`,
      name: `Direct Line (${dialedNumber})`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Telephone Subscriber',
      isAI: false,
      status: 'online',
      statusText: `Direct dialed: ${dialedNumber}`,
      bio: 'Direct encrypted telephone line.',
      phone: dialedNumber,
    };

    // Add to call history
    setCallHistory((prev) => [
      {
        id: `ch_${Date.now()}`,
        name: targetParticipant.name,
        number: dialedNumber,
        type: 'outgoing',
        time: 'Just now',
        duration: '0s',
      },
      ...prev,
    ]);

    onInitiateCall(targetParticipant, dialedNumber);
    onClose();
  };

  const handleCallContact = (contact: Participant) => {
    setCallHistory((prev) => [
      {
        id: `ch_${Date.now()}`,
        name: contact.name,
        number: contact.phone || '+1 (800) 555-0199',
        type: 'outgoing',
        time: 'Just now',
        duration: '0s',
      },
      ...prev,
    ]);
    onInitiateCall(contact, contact.phone);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-[#E9EDEF] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-[#F0F2F5] border-b border-[#E9EDEF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#128C7E]/10 text-[#075E54] flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1F2C34]">Phone Call Hub</h2>
              <p className="text-[11px] text-[#667781]">Real DTMF Dialpad & Old Numbers</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#E9EDEF] text-[#54656F] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs (Keypad, Contacts, Recents) */}
        <div className="grid grid-cols-3 border-b border-[#E9EDEF] bg-[#F5FAFF] text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('keypad')}
            className={`py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'keypad'
                ? 'border-[#128C7E] text-[#075E54] bg-white'
                : 'border-transparent text-[#667781] hover:text-[#1F2C34]'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            Keypad
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('contacts')}
            className={`py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'contacts'
                ? 'border-[#128C7E] text-[#075E54] bg-white'
                : 'border-transparent text-[#667781] hover:text-[#1F2C34]'
            }`}
          >
            <BookUser className="w-3.5 h-3.5" />
            Numbers
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-[#128C7E] text-[#075E54] bg-white'
                : 'border-transparent text-[#667781] hover:text-[#1F2C34]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Recents
          </button>
        </div>

        {/* Tab 1: Classic Keypad */}
        {activeTab === 'keypad' && (
          <div className="p-5 flex flex-col items-center flex-1 overflow-y-auto">
            {/* Number Display Screen */}
            <div className="w-full flex flex-col items-center justify-center min-h-[64px] mb-3 px-2">
              <span className="text-2xl sm:text-3xl font-mono font-bold tracking-wider text-[#1F2C34] truncate max-w-full">
                {dialedNumber || (
                  <span className="text-[#A0AEB5] text-lg font-sans font-normal">
                    Enter phone number...
                  </span>
                )}
              </span>
              {dialedNumber && (
                <div className="flex flex-col items-center gap-1.5 mt-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#25D366] font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Encrypted line ready
                    </span>
                    <button
                      type="button"
                      onClick={handleClear}
                      className="text-[10px] text-[#667781] hover:text-red-500 uppercase tracking-wider font-semibold"
                    >
                      Clear
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onOpenAddContact?.(dialedNumber);
                      onClose();
                    }}
                    className="text-[11px] text-[#128C7E] font-bold hover:underline flex items-center gap-1 bg-[#128C7E]/10 hover:bg-[#128C7E]/20 px-2.5 py-0.5 rounded-full transition-colors"
                  >
                    <UserPlus className="w-3 h-3" />
                    <span>Save {dialedNumber} as Contact</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3x4 Dialpad Grid */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
              {DIAL_KEYS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleKeyPress(item.key)}
                  className="w-[72px] h-[72px] mx-auto rounded-full bg-[#F0F2F5] hover:bg-[#E2F0FB] active:bg-[#128C7E]/20 text-[#1F2C34] flex flex-col items-center justify-center transition-all active:scale-95 shadow-xs border border-[#E9EDEF]"
                >
                  <span className="text-2xl font-bold leading-none">{item.key}</span>
                  {item.letters && (
                    <span className="text-[9px] font-bold text-[#667781] tracking-widest mt-0.5 leading-none">
                      {item.letters}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Bottom Call & Backspace Controls */}
            <div className="flex items-center justify-center gap-6 mt-4 w-full max-w-[280px]">
              <div className="w-12 h-12" /> {/* Spacer */}

              {/* Big Green Call Button */}
              <button
                type="button"
                onClick={handleCallDialed}
                disabled={!dialedNumber}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all shadow-lg active:scale-90 ${
                  dialedNumber
                    ? 'bg-[#25D366] hover:bg-[#1faa53] shadow-[#25D366]/40 cursor-pointer'
                    : 'bg-[#A0AEB5] opacity-50 cursor-not-allowed'
                }`}
                title="Call phone number"
              >
                <Phone className="w-7 h-7 fill-current" />
              </button>

              {/* Backspace Button */}
              {dialedNumber ? (
                <button
                  type="button"
                  onClick={handleBackspace}
                  className="w-12 h-12 rounded-full hover:bg-[#F0F2F5] text-[#54656F] flex items-center justify-center transition-transform active:scale-90"
                  title="Delete digit"
                >
                  <Delete className="w-5 h-5" />
                </button>
              ) : (
                <div className="w-12 h-12" />
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Real Contact Numbers */}
        {activeTab === 'contacts' && (
          <div className="p-4 flex flex-col gap-2 overflow-y-auto flex-1 divide-y divide-[#F0F2F5]">
            {/* Add New Phone Number / Contact Button */}
            <div className="pb-2">
              <button
                type="button"
                onClick={() => {
                  onOpenAddContact?.();
                  onClose();
                }}
                className="w-full py-2.5 px-3 rounded-2xl bg-[#128C7E] hover:bg-[#075E54] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Add New Phone Number / Client Contact</span>
              </button>
            </div>

            {/* Featured Hotline: Aya Company & KRA */}
            <div className="pb-2">
              <span className="text-[10px] font-bold text-[#075E54] uppercase tracking-wider block mb-1">
                Verified Enterprise Hotline
              </span>
              <div
                onClick={() =>
                  handleCallContact({
                    id: 'bot_aya',
                    name: 'Aya (Company & KRA Registry)',
                    avatar: contacts[0]?.avatar || '',
                    role: 'Company Intelligence Bot',
                    isAI: true,
                    status: 'online',
                    bio: 'Online company registry hotline.',
                    phone: '+1 (800) 555-4292',
                  })
                }
                className="flex items-center justify-between p-3 rounded-2xl bg-[#E7FCE3]/60 border border-[#128C7E]/30 hover:bg-[#E7FCE3] cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#075E54] text-white flex items-center justify-center font-bold text-sm">
                    AYA
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#075E54] flex items-center gap-1">
                      Aya Company Registry
                      <Sparkles className="w-3 h-3 text-[#128C7E]" />
                    </h4>
                    <p className="text-[11px] font-mono text-[#1F2C34] font-semibold">
                      +1 (800) 555-4292
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-105"
                >
                  <Phone className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>

            {/* Other contacts with real phone numbers */}
            {contacts.map((c) => {
              const phone = c.phone || '+1 (555) 741-9230';
              return (
                <div
                  key={c.id}
                  onClick={() => handleCallContact(c)}
                  className="pt-2.5 pb-2 flex items-center justify-between hover:bg-[#F5FAFF] p-2 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-black/10"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#1F2C34]">{c.name}</h4>
                      <p className="text-[11px] font-mono text-[#075E54] font-semibold">{phone}</p>
                      <p className="text-[10px] text-[#667781]">{c.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {c.phone && (
                      <a
                        href={`https://wa.me/${c.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                          `Hello ${c.name}! Reaching out regarding website development and custom AI chatbot services.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-9 h-9 rounded-full bg-[#25D366]/15 hover:bg-[#25D366] text-[#075E54] hover:text-white flex items-center justify-center transition-all"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4 fill-current" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCallContact(c);
                      }}
                      className="w-9 h-9 rounded-full bg-[#128C7E]/10 hover:bg-[#25D366] hover:text-white text-[#075E54] flex items-center justify-center transition-all"
                      title="Call directly"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Recent Call History */}
        {activeTab === 'history' && (
          <div className="p-4 flex flex-col gap-2 overflow-y-auto flex-1 divide-y divide-[#F0F2F5]">
            {callHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setDialedNumber(item.number.replace(/\D/g, ''));
                  setActiveTab('keypad');
                }}
                className="pt-2.5 pb-2 flex items-center justify-between hover:bg-[#F5FAFF] p-2 rounded-xl cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      item.type === 'missed'
                        ? 'bg-red-100 text-red-600'
                        : item.type === 'outgoing'
                        ? 'bg-emerald-100 text-[#075E54]'
                        : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4
                      className={`text-xs font-bold ${
                        item.type === 'missed' ? 'text-red-600' : 'text-[#1F2C34]'
                      }`}
                    >
                      {item.name}
                    </h4>
                    <p className="text-[11px] font-mono text-[#667781]">{item.number}</p>
                    <p className="text-[10px] text-[#8696A0]">
                      {item.time} • {item.duration}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const target = contacts.find((c) => c.phone === item.number) || {
                      id: `hist_${Date.now()}`,
                      name: item.name,
                      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                      role: 'Subscriber',
                      isAI: false,
                      status: 'online',
                      bio: 'Dialed contact',
                      phone: item.number,
                    };
                    handleCallContact(target);
                  }}
                  className="p-2 rounded-full hover:bg-[#25D366] hover:text-white text-[#128C7E] transition-colors"
                  title="Redial"
                >
                  <Phone className="w-4 h-4 fill-current" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
