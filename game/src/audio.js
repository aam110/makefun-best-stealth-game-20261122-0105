// WebAudio sound effects for Shadow Vault: all oscillators, no audio files.

let ctx = null;
let muted = false;

export function ensureAudio() {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; }
  }
  if (ctx && ctx.state === 'suspended') ctx.resume();
}

export function toggleMute() {
  muted = !muted;
  return muted;
}

function tone(freq, dur, type, vol, slideTo) {
  if (!ctx || muted) return;
  const t0 = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  gain.gain.setValueAtTime(vol, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur);
}

export function playGem() { tone(880, 0.12, 'sine', 0.12, 1320); }
export function playStep() { tone(140 + Math.random() * 40, 0.05, 'triangle', 0.05); }
export function playNoise() { tone(220, 0.15, 'sawtooth', 0.05, 110); }
export function playSuspicious() { tone(330, 0.25, 'square', 0.07, 440); }
export function playSpotted() { tone(180, 0.5, 'sawtooth', 0.14, 520); }
export function playCaught() { tone(320, 0.7, 'sawtooth', 0.14, 60); }
export function playWin() {
  tone(523, 0.15, 'sine', 0.12);
  setTimeout(() => tone(659, 0.15, 'sine', 0.12), 140);
  setTimeout(() => tone(784, 0.3, 'sine', 0.12), 280);
}
export function playClick() { tone(600, 0.06, 'sine', 0.08); }
