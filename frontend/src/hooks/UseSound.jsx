import { useRef, useCallback } from "react";

// Map seller IDs to their sound file names
// Place MP3 files in /public/sounds/
const SELLER_SOUNDS = {
  merchant: {
    welcome: "/sounds/merchant-welcome.mp3",
    deal: "/sounds/merchant-deal.mp3",
    reject: "/sounds/merchant-reject.mp3",
  },
  modi: {
    welcome: "/sounds/modi-welcome.mp3",
    deal: "/sounds/modi-deal.mp3",
    reject: "/sounds/modi-reject.mp3",
  },
  jethalal: {
    welcome: "/sounds/jethalal-welcome.mp3",
    deal: "/sounds/jethalal-deal.mp3",
    reject: "/sounds/jethalal-reject.mp3",
  },
};

// Fallback beep using Web Audio API if MP3 not found
const playBeep = (freq = 440, type = "sine", duration = 0.3, vol = 0.15) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {}
};

export const useSound = () => {
  const audioRef = useRef(null);
  const enabledRef = useRef(true);

  const play = useCallback((sellerId, type = "welcome") => {
    if (!enabledRef.current) return;

    const sounds = SELLER_SOUNDS[sellerId];
    if (!sounds) return;

    const src = sounds[type];
    if (!src) return;

    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const audio = new Audio(src);
      audio.volume = 0.6;
      audioRef.current = audio;

      audio.play().catch(() => {
        // File not found — play fallback beep
        const beepMap = {
          welcome: () => playBeep(523, "sine", 0.4),
          deal: () => {
            playBeep(659, "triangle", 0.2);
            setTimeout(() => playBeep(880, "triangle", 0.3), 200);
          },
          reject: () => playBeep(200, "sawtooth", 0.4),
          message: () => playBeep(800, "sine", 0.08, 0.05),
        };
        beepMap[type]?.();
      });
    } catch {}
  }, []);

  const playMessage = useCallback(() => {
    if (!enabledRef.current) return;
    playBeep(750, "sine", 0.06, 0.04);
  }, []);

  const toggle = useCallback(() => {
    enabledRef.current = !enabledRef.current;
    return enabledRef.current;
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  return { play, playMessage, toggle, stop };
};
