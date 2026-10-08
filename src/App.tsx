import React, { useState, useEffect, useRef } from 'react';
import {
  INITIAL_CONVERSATIONS,
  AI_BOT_DIRECTORY,
  CURRENT_USER,
} from './data/mockData';
import {
  Conversation,
  Participant,
  ChatFilter,
  CallState,
  Message,
} from './types/chat';
import { NavigationRail } from './components/NavigationRail';
import { ChatList } from './components/ChatList';
import { ChatHeader } from './components/ChatHeader';
import { MessageItem } from './components/MessageItem';
import { MessageComposer } from './components/MessageComposer';
import { ProfileDrawer } from './components/ProfileDrawer';
import { CallModal } from './components/CallModal';
import { NewChatModal } from './components/NewChatModal';
import { MediaLightbox } from './components/MediaLightbox';
import { SettingsModal } from './components/SettingsModal';
import { generateAIResponse } from './services/aiService';
import { Lock, Sparkles, X, Search, PhoneCall } from 'lucide-react';

import sharedPhoto from './assets/images/chat_shared_photo_1791442421129.jpg';

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('emerald_conversations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Conversation[];
        if (parsed.some((c) => c.id === 'conv_aya_bot')) {
          return parsed;
        }
        return INITIAL_CONVERSATIONS;
      } catch (e) {
        return INITIAL_CONVERSATIONS;
      }
    }
    return INITIAL_CONVERSATIONS;
  });

  const [activeConversationId, setActiveConversationId] = useState<string>('conv_aya_bot');
  const [activeFilter, setActiveFilter] = useState<ChatFilter>('all');
  const [activeNavTab, setActiveNavTab] = useState<'chats' | 'ai' | 'calls' | 'starred' | 'settings'>('chats');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [showChatSearch, setShowChatSearch] = useState(false);

  // Modals & Lightbox
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [lightboxData, setLightboxData] = useState<{ isOpen: boolean; url: string; title?: string }>({
    isOpen: false,
    url: '',
  });

  // Call State
  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    type: 'voice',
    participant: null,
    status: 'connecting',
    durationSeconds: 0,
    isMuted: false,
    isVideoEnabled: false,
    isSpeakerOn: true,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('emerald_conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Current active conversation
  const activeConversation = conversations.find((c) => c.id === activeConversationId) || conversations[0];

  // Scroll to bottom on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, isGeneratingAI]);

  // Unread total across all conversations
  const totalUnread = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  // Select a conversation and clear unread count
  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  };

  // Switch navigation tabs
  const handleNavTabChange = (tab: 'chats' | 'ai' | 'calls' | 'starred' | 'settings') => {
    setActiveNavTab(tab);
    if (tab === 'settings') {
      setIsSettingsOpen(true);
    } else if (tab === 'ai') {
      setActiveFilter('ai');
    } else if (tab === 'starred') {
      setActiveFilter('favorites');
    } else if (tab === 'calls') {
      // Prompt call with active participant
      startVoiceCall();
    } else {
      setActiveFilter('all');
    }
  };

  // Send standard text message
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !activeConversation) return;

    const timeString = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(new Date());

    const newMessage: Message = {
      id: `msg_user_${Date.now()}`,
      senderId: CURRENT_USER.id,
      text,
      timestamp: timeString,
      isOutgoing: true,
      status: 'sent',
    };

    const targetBot = activeConversation.participant;
    const isBot = targetBot.isAI;

    // Append outgoing message
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversation.id) {
          return {
            ...c,
            lastMessage: text,
            lastTimestamp: timeString,
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      })
    );

    // Simulate delivery receipt transition
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConversation.id) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === newMessage.id ? { ...m, status: 'delivered' as const } : m
              ),
            };
          }
          return c;
        })
      );
    }, 600);

    // If active conversation is an AI Assistant, generate verified response!
    if (isBot) {
      setIsGeneratingAI(true);
      try {
        const history = activeConversation.messages.slice(-6).map((m) => ({
          role: m.isOutgoing ? ('user' as const) : ('model' as const),
          text: m.text,
        }));

        const aiResult = await generateAIResponse(text, targetBot, history);

        const aiMessage: Message = {
          id: `msg_bot_${Date.now()}`,
          senderId: targetBot.id,
          senderName: targetBot.name,
          text: aiResult.text,
          timestamp: new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          }).format(new Date()),
          isOutgoing: false,
          status: 'read' as const,
          isAI: true,
          aiBadge: targetBot.category,
          codeBlock: aiResult.codeBlock,
          companyStats: aiResult.companyStats,
          suggestions: aiResult.suggestions,
        };

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === activeConversation.id) {
              return {
                ...c,
                lastMessage: aiResult.text.slice(0, 75) + '...',
                lastTimestamp: aiMessage.timestamp,
                messages: [
                  ...c.messages.map((m) =>
                    m.id === newMessage.id ? { ...m, status: 'read' as const } : m
                  ),
                  aiMessage,
                ],
              };
            }
            return c;
          })
        );
      } catch (err) {
        console.error('Failed to generate AI response:', err);
      } finally {
        setIsGeneratingAI(false);
      }
    } else {
      // Mark as read after 1.5 seconds for human contact
      setTimeout(() => {
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === activeConversation.id) {
              return {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === newMessage.id ? { ...m, status: 'read' as const } : m
                ),
              };
            }
            return c;
          })
        );
      }, 1500);
    }
  };

  // Send a voice note
  const handleSendVoiceNote = () => {
    if (!activeConversation) return;
    const timeString = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(new Date());

    const voiceMessage: Message = {
      id: `msg_voice_${Date.now()}`,
      senderId: CURRENT_USER.id,
      text: '',
      timestamp: timeString,
      isOutgoing: true,
      status: 'read',
      voiceNote: {
        durationSec: 18,
        waveform: [20, 35, 60, 80, 50, 40, 70, 95, 85, 60, 45, 30, 55, 75, 45, 25, 35, 20],
      },
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? {
              ...c,
              lastMessage: 'Voice message (0:18)',
              lastTimestamp: timeString,
              messages: [...c.messages, voiceMessage],
            }
          : c
      )
    );
  };

  // Send an image attachment
  const handleSendImage = () => {
    if (!activeConversation) return;
    const timeString = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(new Date());

    const imgMessage: Message = {
      id: `msg_img_${Date.now()}`,
      senderId: CURRENT_USER.id,
      text: 'Sharing high-resolution architecture & Scandinavian layout snapshot for reference.',
      timestamp: timeString,
      isOutgoing: true,
      status: 'read',
      attachment: {
        id: `att_${Date.now()}`,
        type: 'image',
        url: sharedPhoto,
        title: 'Modern Architecture Studio Blueprint',
        fileSize: '3.1 MB',
        dimensions: '2048 × 1536',
      },
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? {
              ...c,
              lastMessage: 'Photo: Modern Architecture Studio Blueprint',
              lastTimestamp: timeString,
              messages: [...c.messages, imgMessage],
            }
          : c
      )
    );
  };

  // Send an interactive poll
  const handleSendPoll = (question: string, options: string[]) => {
    if (!activeConversation) return;
    const timeString = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(new Date());

    const pollMessage: Message = {
      id: `msg_poll_${Date.now()}`,
      senderId: CURRENT_USER.id,
      text: '',
      timestamp: timeString,
      isOutgoing: true,
      status: 'read',
      poll: {
        id: `poll_${Date.now()}`,
        question,
        totalVotes: 1,
        options: options.map((opt, i) => ({
          id: `opt_${i}`,
          text: opt,
          votes: i === 0 ? 1 : 0,
          votedByMe: i === 0,
        })),
      },
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? {
              ...c,
              lastMessage: `Poll: ${question}`,
              lastTimestamp: timeString,
              messages: [...c.messages, pollMessage],
            }
          : c
      )
    );
  };

  // Vote on interactive poll
  const handleVotePoll = (messageId: string, optionId: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversation.id) {
          return {
            ...c,
            messages: c.messages.map((m) => {
              if (m.id === messageId && m.poll) {
                const hadPreviousVote = m.poll.options.some((o) => o.votedByMe);
                const updatedOptions = m.poll.options.map((o) => {
                  if (o.id === optionId) {
                    return {
                      ...o,
                      votes: o.votedByMe ? o.votes - 1 : o.votes + 1,
                      votedByMe: !o.votedByMe,
                    };
                  }
                  if (o.votedByMe) {
                    return { ...o, votes: Math.max(0, o.votes - 1), votedByMe: false };
                  }
                  return o;
                });

                const totalVotes = updatedOptions.reduce((acc, curr) => acc + curr.votes, 0);

                return {
                  ...m,
                  poll: {
                    ...m.poll,
                    options: updatedOptions,
                    totalVotes,
                  },
                };
              }
              return m;
            }),
          };
        }
        return c;
      })
    );
  };

  // Add emoji reaction
  const handleAddReaction = (messageId: string, emoji: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversation.id) {
          return {
            ...c,
            messages: c.messages.map((m) => {
              if (m.id === messageId) {
                const existing = m.reactions || [];
                const found = existing.find((r) => r.emoji === emoji);

                let newReactions;
                if (found) {
                  if (found.reactedByMe) {
                    newReactions = existing
                      .map((r) => (r.emoji === emoji ? { ...r, count: r.count - 1, reactedByMe: false } : r))
                      .filter((r) => r.count > 0);
                  } else {
                    newReactions = existing.map((r) =>
                      r.emoji === emoji ? { ...r, count: r.count + 1, reactedByMe: true } : r
                    );
                  }
                } else {
                  newReactions = [...existing, { emoji, count: 1, reactedByMe: true }];
                }

                return { ...m, reactions: newReactions };
              }
              return m;
            }),
          };
        }
        return c;
      })
    );
  };

  // Toggle favorite / starred
  const handleToggleFavorite = () => {
    if (!activeConversation) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id ? { ...c, isFavorite: !c.isFavorite } : c
      )
    );
  };

  // Toggle mute
  const handleToggleMute = () => {
    if (!activeConversation) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id ? { ...c, isMuted: !c.isMuted } : c
      )
    );
  };

  // Clear chat history
  const handleClearChat = () => {
    if (!activeConversation) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? {
              ...c,
              lastMessage: 'Conversation history cleared.',
              messages: [],
            }
          : c
      )
    );
  };

  // Start voice or video call
  const startVoiceCall = () => {
    if (!activeConversation) return;
    setCallState({
      isActive: true,
      type: 'voice',
      participant: activeConversation.participant,
      status: 'connecting',
      durationSeconds: 0,
      isMuted: false,
      isVideoEnabled: false,
      isSpeakerOn: true,
    });
    setTimeout(() => {
      setCallState((prev) => ({ ...prev, status: 'connected' }));
    }, 1800);
  };

  const startVideoCall = () => {
    if (!activeConversation) return;
    setCallState({
      isActive: true,
      type: 'video',
      participant: activeConversation.participant,
      status: 'connecting',
      durationSeconds: 0,
      isMuted: false,
      isVideoEnabled: true,
      isSpeakerOn: true,
    });
    setTimeout(() => {
      setCallState((prev) => ({ ...prev, status: 'connected' }));
    }, 1800);
  };

  // Start chat with participant from directory
  const handleStartChatWithParticipant = (p: Participant) => {
    const existing = conversations.find((c) => c.participant.id === p.id);
    if (existing) {
      setActiveConversationId(existing.id);
    } else {
      const newConv: Conversation = {
        id: `conv_${p.id}_${Date.now()}`,
        participant: p,
        lastMessage: p.isAI
          ? `Hello Alex! I am ${p.name}, ready to assist with ${p.category || 'engineering'}.`
          : 'Started a new thread.',
        lastTimestamp: 'Just now',
        unreadCount: 0,
        isPinned: false,
        isFavorite: false,
        isMuted: false,
        messages: [
          {
            id: `msg_init_${Date.now()}`,
            senderId: p.id,
            senderName: p.name,
            text: p.isAI
              ? `Hello Alex! I am ${p.name}, your verified ${p.role}. What would you like to review or build today?`
              : `Hi Alex, starting our direct conversation thread here.`,
            timestamp: 'Just now',
            isOutgoing: false,
            status: 'read',
            isAI: p.isAI,
            aiBadge: p.category,
            suggestions: p.promptStarters || [
              'Review system topology',
              'Check performance bottlenecks',
            ],
          },
        ],
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
    }
  };

  // Create custom AI Agent
  const handleCreateCustomBot = (botData: Partial<Participant>) => {
    const newParticipant: Participant = {
      id: `bot_custom_${Date.now()}`,
      name: botData.name || 'Custom Agent',
      avatar:
        botData.avatar ||
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      role: botData.role || 'Domain Specialist',
      isAI: true,
      category: botData.category || 'Architecture',
      status: 'online',
      statusText: `${botData.category} • Ready`,
      bio: botData.bio || 'Custom specialized generative intelligence.',
      model: botData.model || 'Gemini 2.5 Flash',
      temperature: botData.temperature ?? 0.3,
      capabilities: botData.capabilities || ['Custom System Intelligence'],
      promptStarters: botData.promptStarters || [
        `Analyze ${botData.name}'s focus area`,
        'Generate implementation proposal',
      ],
    };

    handleStartChatWithParticipant(newParticipant);
  };

  // Filter messages if search query inside chat
  const displayedMessages = activeConversation
    ? activeConversation.messages.filter((m) =>
        chatSearchQuery
          ? m.text.toLowerCase().includes(chatSearchQuery.toLowerCase())
          : true
      )
    : [];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F0F2F5] text-[#1F2C34]">
      {/* 1. Left Navigation Rail (Desktop) */}
      <NavigationRail
        activeTab={activeNavTab}
        setActiveTab={handleNavTabChange}
        unreadTotal={totalUnread}
        currentUser={CURRENT_USER}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* 2. Master Chat List (Hidden on mobile if conversation is selected) */}
      <div
        className={`h-full ${
          activeConversationId ? 'hidden md:flex' : 'flex w-full'
        }`}
      >
        <ChatList
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          onOpenNewChat={() => setIsNewChatOpen(true)}
        />
      </div>

      {/* 3. Detail Active Conversation Canvas */}
      <div
        className={`flex-1 h-full flex flex-col min-w-0 bg-[#ECE5DD] relative ${
          !activeConversationId ? 'hidden md:flex' : 'flex'
        }`}
      >
        {activeConversation ? (
          <>
            {/* Chat Top Header */}
            <ChatHeader
              participant={activeConversation.participant}
              onBackMobile={() => setActiveConversationId('')}
              onStartVoiceCall={startVoiceCall}
              onStartVideoCall={startVideoCall}
              onToggleSearch={() => setShowChatSearch((prev) => !prev)}
              onToggleProfileDrawer={() => setIsProfileOpen((prev) => !prev)}
              isProfileOpen={isProfileOpen}
            />

            {/* In-Chat Search Bar Drawer */}
            {showChatSearch && (
              <div className="px-4 py-2 bg-white border-b border-[#E9EDEF] flex items-center justify-between z-10 animate-in fade-in duration-100">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <Search className="w-4 h-4 text-[#667781]" />
                  <input
                    type="text"
                    autoFocus
                    value={chatSearchQuery}
                    onChange={(e) => setChatSearchQuery(e.target.value)}
                    placeholder="Search inside this conversation..."
                    className="w-full text-sm bg-transparent focus:outline-none text-[#1F2C34] placeholder-[#8696A0]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setChatSearchQuery('');
                    setShowChatSearch(false);
                  }}
                  className="p-1 rounded-full hover:bg-[#F0F2F5] text-[#8696A0]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Message Stream Area with Tactile Wallpaper Canvas */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 chat-canvas-bg flex flex-col">
              {/* End-to-End Encryption Banner */}
              <div className="mx-auto my-3 max-w-md bg-[#FFF9C4]/80 backdrop-blur-xs border border-[#FFF59D] rounded-xl px-3 py-2 text-center text-[12px] text-[#5D4037] shadow-xs flex items-center justify-center gap-1.5 select-none">
                <Lock className="w-3.5 h-3.5 text-[#795548] shrink-0" />
                <span>
                  Messages and calls are end-to-end encrypted. No one outside of this chat can read or listen.
                </span>
              </div>

              {/* Date divider */}
              <div className="flex items-center justify-center my-3 select-none">
                <span className="text-[11px] font-semibold text-[#54656F] bg-white/90 backdrop-blur-xs px-3 py-1 rounded-lg shadow-xs uppercase tracking-wider">
                  Today
                </span>
              </div>

              {/* Message List */}
              <div className="flex-1 flex flex-col justify-end">
                {displayedMessages.map((msg) => (
                  <MessageItem
                    key={msg.id}
                    message={msg}
                    participant={activeConversation.participant}
                    onSuggestionClick={handleSendMessage}
                    onImageClick={(url, title) =>
                      setLightboxData({ isOpen: true, url, title })
                    }
                    onVotePoll={handleVotePoll}
                    onAddReaction={handleAddReaction}
                  />
                ))}

                {/* AI Generative Typing / Thinking Indicator */}
                {isGeneratingAI && (
                  <div className="flex items-center gap-2 mb-3 ml-2 self-start select-none animate-in fade-in duration-200">
                    <div className="bg-white rounded-[14px_14px_14px_3px] px-3.5 py-2.5 shadow-xs border border-[#E9EDEF] flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#128C7E] animate-spin" />
                      <span className="text-xs font-semibold text-[#075E54]">
                        {activeConversation.participant.name} is synthesizing response...
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-bounce" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Bottom Floating Composer */}
            <MessageComposer
              participant={activeConversation.participant}
              onSendMessage={handleSendMessage}
              onSendVoiceNote={handleSendVoiceNote}
              onSendImage={handleSendImage}
              onSendPoll={handleSendPoll}
              isGeneratingAI={isGeneratingAI}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#667781] select-none">
            <div className="w-20 h-20 rounded-full bg-[#128C7E]/10 flex items-center justify-center mb-4 text-[#128C7E]">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#1F2C34]">Slate & Emerald Messaging</h3>
            <p className="text-sm text-[#54656F] max-w-sm mt-1">
              Select a conversation to start messaging, or deploy an autonomous AI agent for architecture and code synthesis.
            </p>
          </div>
        )}
      </div>

      {/* 4. Collapsible Context & Profile Drawer (Right Pane) */}
      {activeConversation && (
        <ProfileDrawer
          participant={activeConversation.participant}
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          isMuted={activeConversation.isMuted}
          onToggleMute={handleToggleMute}
          isFavorite={activeConversation.isFavorite}
          onToggleFavorite={handleToggleFavorite}
          onStartVoiceCall={startVoiceCall}
          onStartVideoCall={startVideoCall}
          onClearChat={handleClearChat}
          onImageClick={(url, title) =>
            setLightboxData({ isOpen: true, url, title })
          }
        />
      )}

      {/* Voice & Video Call Modal */}
      <CallModal
        callState={callState}
        onEndCall={() =>
          setCallState((prev) => ({
            ...prev,
            isActive: false,
            status: 'ended',
          }))
        }
      />

      {/* New Conversation & AI Bot Deployment Modal */}
      <NewChatModal
        isOpen={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
        availableBots={AI_BOT_DIRECTORY}
        onStartChatWithParticipant={handleStartChatWithParticipant}
        onCreateCustomBot={handleCreateCustomBot}
      />

      {/* Media Lightbox */}
      <MediaLightbox
        isOpen={lightboxData.isOpen}
        imageUrl={lightboxData.url}
        title={lightboxData.title}
        onClose={() => setLightboxData({ isOpen: false, url: '' })}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUser={CURRENT_USER}
      />
    </div>
  );
}
