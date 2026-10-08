import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { VoiceNote } from '../types/chat';
import { speakText, stopSpeaking } from '../utils/audioSystem';

interface AudioPlayerProps {
  voiceNote: VoiceNote;
  isOutgoing: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ voiceNote, isOutgoing }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0); // 0 to 1
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const duration = voiceNote.durationSec;
  const currentSeconds = Math.floor(currentProgress * duration);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopSpeaking();
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
    } else {
      setIsPlaying(true);
      if (voiceNote.audioBlobUrl) {
        if (!audioElementRef.current) {
          audioElementRef.current = new Audio(voiceNote.audioBlobUrl);
          audioElementRef.current.onended = () => setIsPlaying(false);
        }
        audioElementRef.current.playbackRate = playbackSpeed;
        audioElementRef.current.play().catch(() => {});
      } else {
        const textToSpeak =
          voiceNote.spokenText ||
          (isOutgoing
            ? 'Hey, this is Alex Rivera sending a quick audio note on the architecture update.'
            : 'Hey Alex! The migration script passed all dry runs with zero replica lag. Database telemetry is completely nominal.');

        speakText(textToSpeak, {
          voiceRate: playbackSpeed,
          onEnd: () => {
            setIsPlaying(false);
            setCurrentProgress(0);
          },
        });
      }
    }
  };

  const handleSpeedToggle = () => {
    const nextSpeed = playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : 1;
    setPlaybackSpeed(nextSpeed);
    if (audioElementRef.current) {
      audioElementRef.current.playbackRate = nextSpeed;
    }
  };

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = 100 / playbackSpeed;
      timerRef.current = setInterval(() => {
        setCurrentProgress((prev) => {
          const step = 0.1 / duration;
          if (prev + step >= 1) {
            setIsPlaying(false);
            stopSpeaking();
            return 0;
          }
          return prev + step;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopSpeaking();
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
    };
  }, [isPlaying, duration, playbackSpeed]);

  const handleWaveformClick = (index: number) => {
    const fraction = index / voiceNote.waveform.length;
    setCurrentProgress(fraction);
  };

  return (
    <div className="flex items-center gap-3 py-1 min-w-[220px] max-w-[280px]">
      {/* Play/Pause Button */}
      <button
        type="button"
        onClick={togglePlay}
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-xs ${
          isOutgoing
            ? 'bg-[#128C7E] text-white hover:bg-[#075E54]'
            : 'bg-[#128C7E] text-white hover:bg-[#075E54]'
        }`}
        aria-label={isPlaying ? 'Pause voice message' : 'Play voice message'}
      >
        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
      </button>

      {/* Waveform & Progress */}
      <div className="flex-1 flex flex-col justify-center gap-1">
        <div className="flex items-center gap-[2.5px] h-7 cursor-pointer" title="Click to seek">
          {voiceNote.waveform.map((barHeight, idx) => {
            const barFraction = idx / voiceNote.waveform.length;
            const isPlayed = barFraction <= currentProgress;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleWaveformClick(idx)}
                className="group flex items-center h-full px-[0.5px] focus:outline-none"
              >
                <span
                  style={{ height: `${Math.max(15, (barHeight / 100) * 26)}px` }}
                  className={`w-[3px] rounded-full transition-colors ${
                    isPlayed
                      ? isOutgoing
                        ? 'bg-[#128C7E]'
                        : 'bg-[#128C7E]'
                      : isOutgoing
                      ? 'bg-[#98b89e]'
                      : 'bg-[#cbd5e1]'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Timers & Speed pill */}
        <div className="flex items-center justify-between text-[11px] text-[#667781] select-none font-mono">
          <span>{isPlaying ? formatTime(currentSeconds) : formatTime(duration)}</span>
          <button
            type="button"
            onClick={handleSpeedToggle}
            className="text-[10px] font-semibold text-[#128C7E] bg-[#128C7E]/10 hover:bg-[#128C7E]/20 px-1.5 py-0.5 rounded-full transition-colors"
          >
            {playbackSpeed}x
          </button>
        </div>
      </div>
    </div>
  );
};
