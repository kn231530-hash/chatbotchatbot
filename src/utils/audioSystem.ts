// Web Audio API & Speech Synthesis system for real audible sounds

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// DTMF Frequencies for classic phone dial pad
const DTMF_FREQS: Record<string, [number, number]> = {
  '1': [697, 1209],
  '2': [697, 1336],
  '3': [697, 1477],
  '4': [770, 1209],
  '5': [770, 1336],
  '6': [770, 1477],
  '7': [852, 1209],
  '8': [852, 1336],
  '9': [852, 1477],
  '*': [941, 1209],
  '0': [941, 1336],
  '#': [941, 1477],
};

/** Play authentic DTMF telephone key beep */
export function playDTMF(digit: string, durationMs = 120) {
  try {
    const ctx = getAudioContext();
    const freqs = DTMF_FREQS[digit] || [800, 1200];

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.frequency.value = freqs[0];
    osc2.frequency.value = freqs[1];

    osc1.type = 'sine';
    osc2.type = 'sine';

    gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start();
    osc2.start();

    osc1.stop(ctx.currentTime + durationMs / 1000);
    osc2.stop(ctx.currentTime + durationMs / 1000);
  } catch (e) {
    console.warn('AudioContext beep failed:', e);
  }
}

/** Play realistic phone ringing sound (ring-ring... ring-ring...) */
export function startRingtone(): { stop: () => void } {
  let isRunning = true;
  let activeNodes: { osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode }[] = [];

  const triggerRing = () => {
    if (!isRunning) return;
    try {
      const ctx = getAudioContext();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.value = 440;
      osc2.frequency.value = 480;
      osc1.type = 'sine';
      osc2.type = 'sine';

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 1.6);
      osc2.stop(ctx.currentTime + 1.6);

      activeNodes.push({ osc1, osc2, gain });
    } catch (e) {
      // ignore
    }
  };

  triggerRing();
  const interval = setInterval(() => {
    if (isRunning) triggerRing();
  }, 3000);

  return {
    stop: () => {
      isRunning = false;
      clearInterval(interval);
      activeNodes.forEach(({ osc1, osc2 }) => {
        try {
          osc1.stop();
          osc2.stop();
        } catch (e) {}
      });
      activeNodes = [];
    },
  };
}

/** Play call connected tone */
export function playConnectedTone() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {}
}

/** Play call hang-up tone */
export function playHangupTone() {
  try {
    const ctx = getAudioContext();
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + i * 0.18;

      osc.frequency.value = 425;
      gain.gain.setValueAtTime(0.1, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.12);
    }
  } catch (e) {}
}

/** Real Voice Synthesis - Speaks text aloud using Web Speech API */
export function speakText(
  text: string,
  options?: {
    voicePitch?: number;
    voiceRate?: number;
    onEnd?: () => void;
  }
) {
  if (!('speechSynthesis' in window)) {
    options?.onEnd?.();
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech

    const cleanText = text.replace(/```[\s\S]*?```/g, '').replace(/[#*_`]/g, '').trim();
    if (!cleanText) {
      options?.onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.pitch = options?.voicePitch ?? 1.0;
    utterance.rate = options?.voiceRate ?? 1.0;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find((v) => v.lang.startsWith('en') && !v.name.includes('Google')) || voices[0];
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onend = () => {
      options?.onEnd?.();
    };

    utterance.onerror = () => {
      options?.onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    options?.onEnd?.();
  }
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
