import React, { useState } from 'react';
import {
  CheckCheck,
  Check,
  Copy,
  Check as CopyCheck,
  Sparkles,
  ExternalLink,
  Smile,
  Vote,
} from 'lucide-react';
import { Message, Participant, PollData } from '../types/chat';
import { AudioPlayer } from './AudioPlayer';
import { CompanyStatsCard } from './CompanyStatsCard';
import { ClientLeadCard } from './ClientLeadCard';

interface MessageItemProps {
  message: Message;
  participant: Participant;
  onSuggestionClick?: (prompt: string) => void;
  onImageClick?: (url: string, title: string) => void;
  onVotePoll?: (messageId: string, optionId: string) => void;
  onAddReaction?: (messageId: string, emoji: string) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  participant,
  onSuggestionClick,
  onImageClick,
  onVotePoll,
  onAddReaction,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const isOutgoing = message.isOutgoing;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const QUICK_REACTIONS = ['👍', '❤️', '🔥', '⚡', '💡'];

  return (
    <div
      className={`group relative flex flex-col mb-2.5 ${
        isOutgoing ? 'items-end' : 'items-start'
      }`}
    >
      {/* Sender name for group chats or bot announcement if needed */}
      {!isOutgoing && message.senderName && (
        <span className="text-[12px] font-semibold text-[#075E54] ml-3 mb-1 select-none flex items-center gap-1.5">
          {message.senderName}
          {message.isAI && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#075E54] bg-[#128C7E]/10 border border-[#128C7E]/20 px-1.5 py-0.2 rounded-full">
              <Sparkles className="w-2.5 h-2.5" />
              AI Verified
            </span>
          )}
        </span>
      )}

      {/* Bubble Container */}
      <div
        className={`relative max-w-[85%] sm:max-w-[75%] md:max-w-[68%] transition-all ${
          isOutgoing
            ? 'bg-[#E7FCE3] text-[#1F2C34] rounded-[14px_14px_3px_14px] bubble-shadow-outgoing'
            : 'bg-[#FFFFFF] text-[#1F2C34] rounded-[14px_14px_14px_3px] bubble-shadow-incoming'
        } p-2.5 sm:p-3`}
      >
        {/* AI Category Header Badge if bot response */}
        {message.isAI && message.aiBadge && (
          <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-[#128C7E]/15 select-none">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#128C7E]/10 border border-[#128C7E]/20 text-[11px] font-semibold text-[#075E54]">
              <Sparkles className="w-3 h-3 text-[#128C7E]" />
              {message.aiBadge} Assistant
            </span>
            <span className="text-[10px] text-[#667781] font-mono">
              {participant.model || 'Gemini 2.5'}
            </span>
          </div>
        )}

        {/* Image Attachment */}
        {message.attachment && message.attachment.type === 'image' && (
          <div className="mb-2 rounded-lg overflow-hidden border border-black/5 bg-slate-100">
            <img
              src={message.attachment.url}
              alt={message.attachment.title}
              referrerPolicy="no-referrer"
              onClick={() =>
                onImageClick?.(message.attachment!.url, message.attachment!.title)
              }
              className="w-full max-h-[340px] object-cover cursor-pointer hover:opacity-95 transition-opacity"
            />
            {message.attachment.title && (
              <div className="p-2 bg-white/70 backdrop-blur-xs flex items-center justify-between text-xs text-[#54656F]">
                <span className="font-medium truncate pr-2">{message.attachment.title}</span>
                {message.attachment.fileSize && (
                  <span className="shrink-0 text-[10px] text-[#667781] font-mono">
                    {message.attachment.fileSize}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Voice Note Player */}
        {message.voiceNote && (
          <div className="my-1">
            <AudioPlayer voiceNote={message.voiceNote} isOutgoing={isOutgoing} />
          </div>
        )}

        {/* Main Text Content */}
        {message.text && (
          <div className="text-[15px] leading-[21px] whitespace-pre-wrap break-words font-normal">
            {message.text}
          </div>
        )}

        {/* Company Stats and Counter Card */}
        {message.companyStats && (
          <CompanyStatsCard data={message.companyStats} />
        )}

        {/* Client Lead Inquiry Card */}
        {message.clientLeadCard && (
          <ClientLeadCard lead={message.clientLeadCard} />
        )}

        {/* Syntax-Highlighted Code Block */}
        {message.codeBlock && (
          <div className="mt-2.5 rounded-lg overflow-hidden bg-[#121B22] text-[#E9EDEF] border border-[#2A3942] text-[13px] font-mono">
            {/* Code Header */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#1F2C34] text-[11px] text-[#8696A0] select-none border-b border-[#2A3942]">
              <span className="font-semibold text-[#25D366]">
                {message.codeBlock.filename || message.codeBlock.language}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(message.codeBlock!.code)}
                className="flex items-center gap-1 hover:text-white transition-colors"
                title="Copy code to clipboard"
              >
                {copiedCode ? (
                  <>
                    <CopyCheck className="w-3.5 h-3.5 text-[#25D366]" />
                    <span className="text-[#25D366]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            {/* Code Body */}
            <pre className="p-3 overflow-x-auto text-[12px] leading-[18px] text-[#8ff4e3] selection:bg-[#00685d]">
              <code>{message.codeBlock.code}</code>
            </pre>
          </div>
        )}

        {/* Interactive Poll */}
        {message.poll && (
          <div className="mt-2.5 p-3 rounded-xl bg-white border border-[#E9EDEF] shadow-xs">
            <div className="flex items-center gap-2 mb-2 text-[#075E54]">
              <Vote className="w-4 h-4" />
              <h4 className="text-sm font-semibold">{message.poll.question}</h4>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              {message.poll.options.map((option) => {
                const total = message.poll!.totalVotes || 1;
                const percentage = Math.round((option.votes / total) * 100);

                return (
                  <div
                    key={option.id}
                    onClick={() => onVotePoll?.(message.id, option.id)}
                    className={`relative p-2.5 rounded-lg border cursor-pointer transition-all ${
                      option.votedByMe
                        ? 'border-[#128C7E] bg-[#128C7E]/5 font-medium'
                        : 'border-[#E9EDEF] hover:border-[#CBD5E1] bg-white'
                    }`}
                  >
                    {/* Background fill percentage bar */}
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-[#25D366]/15 rounded-lg pointer-events-none transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />

                    <div className="relative flex items-center justify-between text-xs text-[#1F2C34]">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                            option.votedByMe
                              ? 'border-[#128C7E] bg-[#128C7E]'
                              : 'border-[#8696A0]'
                          }`}
                        >
                          {option.votedByMe && (
                            <span className="w-1.5 h-1.5 bg-white rounded-full" />
                          )}
                        </span>
                        <span className="truncate">{option.text}</span>
                      </div>
                      <span className="font-mono text-[#667781] shrink-0 font-medium">
                        {percentage}% ({option.votes})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#F0F2F5] text-[11px] text-[#667781]">
              <span>{message.poll.totalVotes} total votes</span>
              <span className="text-[#128C7E] font-medium">Anonymous ballot</span>
            </div>
          </div>
        )}

        {/* Bottom Metadata: Timestamp & Read Receipts */}
        <div className="flex items-center justify-end gap-1 mt-1 select-none">
          <span className="text-[11px] text-[#667781] font-sans">
            {message.timestamp}
          </span>
          {isOutgoing && (
            <span>
              {message.status === 'read' ? (
                <CheckCheck className="w-4 h-4 text-[#25D366]" />
              ) : message.status === 'delivered' ? (
                <CheckCheck className="w-4 h-4 text-[#8696A0]" />
              ) : (
                <Check className="w-4 h-4 text-[#8696A0]" />
              )}
            </span>
          )}
        </div>

        {/* Existing Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="absolute -bottom-3 left-3 flex items-center gap-1 z-10">
            {message.reactions.map((r, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onAddReaction?.(message.id, r.emoji)}
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs shadow-xs border transition-transform active:scale-90 ${
                  r.reactedByMe
                    ? 'bg-[#E7FCE3] border-[#128C7E]/40 text-[#075E54] font-semibold'
                    : 'bg-white border-[#E9EDEF] text-[#1F2C34]'
                }`}
              >
                <span>{r.emoji}</span>
                {r.count > 1 && <span className="text-[10px]">{r.count}</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Suggestion Chips (for AI Assistant prompts) */}
      {message.suggestions && message.suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2 ml-1 max-w-[85%] select-none">
          {message.suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSuggestionClick?.(suggestion)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#F0F2F5] active:bg-[#E9EDEF] text-[12px] font-medium text-[#075E54] border border-[#128C7E]/30 shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-3 h-3 text-[#128C7E]" />
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      )}

      {/* Quick reaction hover toolbar */}
      <div
        className={`absolute top-0 ${
          isOutgoing ? 'left-0 -translate-x-full pr-2' : 'right-0 translate-x-full pl-2'
        } opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center gap-1 z-10`}
      >
        <div className="bg-white rounded-full shadow-md border border-[#E9EDEF] px-1 py-0.5 flex items-center gap-1">
          {QUICK_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onAddReaction?.(message.id, emoji)}
              className="w-7 h-7 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center text-sm transition-transform hover:scale-125"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
