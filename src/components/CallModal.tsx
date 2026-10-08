import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Volume2,
  VolumeX,
  Sparkles,
} from 'lucide-react';
import { Participant, CallState } from '../types/chat';

interface CallModalProps {
  callState: CallState;
  onEndCall: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({ callState, onEndCall }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(callState.type === 'video');
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callState.status === 'connected') {
      timer = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState.status]);

  if (!callState.isActive || !callState.participant) return null;

  const participant = callState.participant;

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 bg-[#121B22]/95 backdrop-blur-md flex flex-col items-center justify-between p-6 z-50 select-none animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between max-w-md pt-4 text-white/80">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
          <span className="text-xs uppercase tracking-wider font-semibold">
            {callState.type === 'video' ? 'Encrypted Video Call' : 'Encrypted Audio Call'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsSpeakerOn((p) => !p)}
          className={`p-2 rounded-full transition-colors ${
            isSpeakerOn ? 'bg-white/20 text-white' : 'text-white/50'
          }`}
          title="Speaker Toggle"
        >
          {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      {/* Center Participant Stage */}
      <div className="flex flex-col items-center justify-center gap-4 my-auto">
        <div className="relative">
          {isVideoOn ? (
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden shadow-2xl border-2 border-[#128C7E]/40 bg-black flex items-center justify-center">
              <img
                src={participant.avatar}
                alt={participant.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-90 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                <span className="text-white text-xs font-medium">
                  HD Live Stream (Simulated)
                </span>
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Pulsing rings */}
              <div className="absolute inset-0 rounded-full bg-[#128C7E]/20 animate-ping" />
              <img
                src={participant.avatar}
                alt={participant.name}
                referrerPolicy="no-referrer"
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover ring-4 ring-[#25D366] shadow-2xl relative z-10"
              />
              {participant.isAI && (
                <div className="absolute bottom-2 right-2 z-20 w-8 h-8 rounded-full bg-[#075E54] text-white flex items-center justify-center ring-2 ring-white">
                  <Sparkles className="w-4 h-4 fill-current" />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-center mt-3">
          <h2 className="text-2xl font-bold text-white tracking-tight">{participant.name}</h2>
          <p className="text-sm text-[#8ff4e3] mt-1 font-medium">
            {callState.status === 'connecting'
              ? 'Ringing secure line...'
              : `Connected • ${formatDuration(duration)}`}
          </p>
          {participant.isAI && (
            <p className="text-xs text-[#8696A0] mt-1">
              Neural Voice Synthesis Engine • 48kHz
            </p>
          )}
        </div>
      </div>

      {/* Bottom Controls Dock */}
      <div className="w-full max-w-sm flex items-center justify-center gap-5 pb-6">
        {/* Mute Mic */}
        <button
          type="button"
          onClick={() => setIsMuted((p) => !p)}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-90 ${
            isMuted ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
          }`}
          title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        {/* Video Toggle */}
        <button
          type="button"
          onClick={() => setIsVideoOn((p) => !p)}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-90 ${
            !isVideoOn ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
          }`}
          title={isVideoOn ? 'Turn camera off' : 'Turn camera on'}
        >
          {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
        </button>

        {/* End Call */}
        <button
          type="button"
          onClick={onEndCall}
          className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/40 transition-transform active:scale-90"
          title="End Call"
        >
          <PhoneOff className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};
