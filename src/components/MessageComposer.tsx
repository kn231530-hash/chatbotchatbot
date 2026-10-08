import React, { useState, useRef, useEffect } from 'react';
import {
  Smile,
  Paperclip,
  Camera,
  Mic,
  Send,
  Image as ImageIcon,
  FileText,
  Vote,
  Sparkles,
  MapPin,
  X,
  Trash2,
  Check,
} from 'lucide-react';
import { Participant } from '../types/chat';

interface MessageComposerProps {
  participant: Participant;
  onSendMessage: (text: string) => void;
  onSendVoiceNote: (audioBlobUrl?: string, spokenText?: string) => void;
  onSendImage: () => void;
  onSendPoll: (question: string, options: string[]) => void;
  isGeneratingAI: boolean;
}

const COMMON_EMOJIS = ['😊', '👍', '🔥', '🚀', '💡', '✨', '⚡', '🎉', '❤️', '🙌', '🤝', '✅'];

export const MessageComposer: React.FC<MessageComposerProps> = ({
  participant,
  onSendMessage,
  onSendVoiceNote,
  onSendImage,
  onSendPoll,
  isGeneratingAI,
}) => {
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Auto-resize textarea up to 120px
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        120,
        Math.max(24, textareaRef.current.scrollHeight)
      )}px`;
    }
  }, [inputText]);

  // Clean up recording on unmount
  useEffect(() => {
    return () => {
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startVoiceRecording = async () => {
    setIsRecording(true);
    setRecordSecs(0);
    audioChunksRef.current = [];

    recordTimerRef.current = setInterval(() => {
      setRecordSecs((s) => s + 1);
    }, 1000);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.start(100);
      }
    } catch (err) {
      console.warn('Microphone permission not granted, will use synthesized voice fallback:', err);
    }
  };

  const stopAndSendRecording = () => {
    if (recordTimerRef.current) clearInterval(recordTimerRef.current);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        onSendVoiceNote(audioUrl, 'Voice message recorded from microphone.');
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
        }
      };
      mediaRecorderRef.current.stop();
    } else {
      // Fallback with audible message
      onSendVoiceNote(
        undefined,
        `Hey, this is Alex Rivera. Just following up on the ${participant.name} project telemetry. All looks good.`
      );
    }

    setIsRecording(false);
    setRecordSecs(0);
  };

  const cancelRecording = () => {
    if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    setIsRecording(false);
    setRecordSecs(0);
  };

  const handleSend = () => {
    if (!inputText.trim() || isGeneratingAI) return;
    onSendMessage(inputText.trim());
    setInputText('');
    setShowEmojiPicker(false);
    setShowAttachMenu(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const formatRecTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelectEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
    textareaRef.current?.focus();
  };

  const handleCreatePollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOptions = pollOptions.map((o) => o.trim()).filter(Boolean);
    if (!pollQuestion.trim() || cleanOptions.length < 2) return;
    onSendPoll(pollQuestion.trim(), cleanOptions);
    setShowPollCreator(false);
    setPollQuestion('');
    setPollOptions(['', '']);
  };

  return (
    <div className="relative p-2.5 sm:p-3 bg-[#F0F2F5] select-none border-t border-[#E9EDEF]">
      {/* Quick AI Prompt Starters pill row if bot conversation and user hasn't typed */}
      {participant.isAI && participant.promptStarters && !inputText && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
          <span className="text-[11px] font-semibold text-[#075E54] flex items-center gap-1 shrink-0 pl-1">
            <Sparkles className="w-3 h-3 text-[#128C7E]" />
            Prompts:
          </span>
          {participant.promptStarters.map((starter, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInputText(starter);
                textareaRef.current?.focus();
              }}
              className="text-[12px] px-2.5 py-1 rounded-full bg-white hover:bg-[#E9EDEF] border border-[#E9EDEF] text-[#1F2C34] whitespace-nowrap shadow-xs transition-colors shrink-0"
            >
              {starter}
            </button>
          ))}
        </div>
      )}

      {/* Attachment Popover Menu */}
      {showAttachMenu && (
        <div className="absolute bottom-16 left-6 bg-white rounded-2xl shadow-xl border border-[#E9EDEF] p-2 flex flex-col gap-1 z-30 min-w-[200px] animate-in fade-in slide-in-from-bottom-2 duration-150">
          <button
            type="button"
            onClick={() => {
              onSendImage();
              setShowAttachMenu(false);
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#F0F2F5] text-left text-sm text-[#1F2C34] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium text-xs">Photos & Media</p>
              <p className="text-[10px] text-[#667781]">High-res mock imagery</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowPollCreator(true);
              setShowAttachMenu(false);
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#F0F2F5] text-left text-sm text-[#1F2C34] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#075E54] flex items-center justify-center">
              <Vote className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium text-xs">Create Interactive Poll</p>
              <p className="text-[10px] text-[#667781]">Voting ballot</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              onSendVoiceNote();
              setShowAttachMenu(false);
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#F0F2F5] text-left text-sm text-[#1F2C34] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium text-xs">Voice Memo</p>
              <p className="text-[10px] text-[#667781]">Audio waveform message</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setInputText('Could you perform a complete architectural analysis of this system?');
              setShowAttachMenu(false);
              textareaRef.current?.focus();
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#F0F2F5] text-left text-sm text-[#1F2C34] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-teal-100 text-[#128C7E] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium text-xs">AI System Review</p>
              <p className="text-[10px] text-[#667781]">Template inquiry</p>
            </div>
          </button>
        </div>
      )}

      {/* Emoji Quick Drawer */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-3 bg-white rounded-2xl shadow-xl border border-[#E9EDEF] p-2.5 z-30 max-w-[280px]">
          <div className="flex items-center justify-between mb-2 pb-1 border-b border-[#F0F2F5]">
            <span className="text-xs font-semibold text-[#54656F]">Quick Emojis</span>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(false)}
              className="text-[#8696A0] hover:text-[#1F2C34]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-6 gap-1">
            {COMMON_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleSelectEmoji(emoji)}
                className="w-9 h-9 rounded-lg hover:bg-[#F0F2F5] flex items-center justify-center text-lg transition-transform hover:scale-110 active:scale-95"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Composer Row */}
      <div className="flex items-end gap-2 max-w-5xl mx-auto">
        {isRecording ? (
          <div className="flex-1 flex items-center justify-between bg-red-50 border border-red-200 rounded-3xl px-4 py-2 shadow-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
              <span className="text-xs font-bold text-red-700">Recording voice...</span>
              <span className="font-mono text-xs font-semibold text-red-900 bg-white px-2 py-0.5 rounded-full border border-red-200">
                {formatRecTime(recordSecs)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={cancelRecording}
                className="p-1.5 rounded-full hover:bg-red-100 text-red-600 transition-colors"
                title="Cancel voice recording"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={stopAndSendRecording}
                className="px-3 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                title="Send recorded voice"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </div>
        ) : (
          /* Floating Input Pill Container */
          <div className="flex-1 flex items-end gap-1 sm:gap-2 bg-white rounded-3xl border border-[#E9EDEF] px-2.5 sm:px-3 py-1.5 shadow-xs">
            {/* Emoji Toggle */}
            <button
              type="button"
              onClick={() => {
                setShowEmojiPicker((prev) => !prev);
                setShowAttachMenu(false);
              }}
              className="p-2 text-[#54656F] hover:text-[#128C7E] rounded-full transition-colors shrink-0"
              title="Emoji drawer"
            >
              <Smile className="w-5 h-5" />
            </button>

            {/* Attachment Paperclip */}
            <button
              type="button"
              onClick={() => {
                setShowAttachMenu((prev) => !prev);
                setShowEmojiPicker(false);
              }}
              className="p-2 text-[#54656F] hover:text-[#128C7E] rounded-full transition-colors shrink-0"
              title="Attach media, poll, or voice note"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Text Area */}
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                participant.isAI
                  ? `Message ${participant.name} (${participant.category || 'AI Agent'})...`
                  : `Type a message to ${participant.name}...`
              }
              className="flex-1 py-1 px-1 bg-transparent text-[15px] leading-[21px] text-[#1F2C34] placeholder-[#8696A0] resize-none focus:outline-none min-h-[24px] max-h-[120px]"
            />

            {/* Quick Camera Trigger */}
            <button
              type="button"
              onClick={onSendImage}
              className="p-2 text-[#54656F] hover:text-[#128C7E] rounded-full transition-colors shrink-0 hidden sm:block"
              title="Send photo"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Dynamic Circular Send / Mic Button */}
        {!isRecording && (
          <button
            type="button"
            onClick={inputText.trim() ? handleSend : startVoiceRecording}
            disabled={isGeneratingAI}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-md ${
              inputText.trim()
                ? 'bg-[#128C7E] hover:bg-[#075E54] text-white'
                : 'bg-[#128C7E] hover:bg-[#075E54] text-white'
            } ${isGeneratingAI ? 'opacity-70 cursor-not-allowed' : ''}`}
            title={inputText.trim() ? 'Send message' : 'Record voice memo with microphone'}
          >
            {isGeneratingAI ? (
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : inputText.trim() ? (
              <Send className="w-5 h-5 ml-0.5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Poll Creation Modal */}
      {showPollCreator && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-[#E9EDEF]">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F0F2F5]">
              <div className="flex items-center gap-2 text-[#075E54]">
                <Vote className="w-5 h-5" />
                <h3 className="text-base font-bold text-[#1F2C34]">Create Ballot Poll</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPollCreator(false)}
                className="p-1 rounded-full hover:bg-[#F0F2F5] text-[#8696A0]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePollSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-[#54656F] block mb-1">
                  Question / Decision
                </label>
                <input
                  type="text"
                  required
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="e.g. Which distributed lock mechanism should we adopt?"
                  className="w-full h-10 px-3 bg-[#F0F2F5] rounded-xl text-sm border border-transparent focus:border-[#128C7E] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#54656F] block mb-1">
                  Options
                </label>
                <div className="flex flex-col gap-2">
                  {pollOptions.map((opt, i) => (
                    <input
                      key={i}
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...pollOptions];
                        newOpts[i] = e.target.value;
                        setPollOptions(newOpts);
                      }}
                      placeholder={`Option ${i + 1}`}
                      className="w-full h-9 px-3 bg-[#F0F2F5] rounded-lg text-sm border border-transparent focus:border-[#128C7E] focus:outline-none"
                    />
                  ))}
                </div>
                {pollOptions.length < 5 && (
                  <button
                    type="button"
                    onClick={() => setPollOptions((prev) => [...prev, ''])}
                    className="text-xs font-semibold text-[#128C7E] hover:underline mt-2 inline-block"
                  >
                    + Add option
                  </button>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-[#F0F2F5]">
                <button
                  type="button"
                  onClick={() => setShowPollCreator(false)}
                  className="px-4 py-2 text-xs font-medium rounded-xl hover:bg-[#F0F2F5] text-[#54656F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white shadow-xs"
                >
                  Post Poll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
