let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC({ latencyHint: "interactive" });
    master = ctx.createGain();
    master.gain.value = 0.22;
    master.connect(ctx.destination);
  }
  return ctx;
}

export function unlockAudio() {
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") void c.resume();
}

export function setMuted(next: boolean) {
  muted = next;
  if (master && ctx) {
    master.gain.setTargetAtTime(next ? 0 : 0.22, ctx.currentTime, 0.02);
  }
}

export function isMuted() {
  return muted;
}

function beep(freq: number, dur: number, type: OscillatorType, gain = 0.12) {
  const c = getCtx();
  if (!c || !master || muted) return;
  if (c.state === "suspended") return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, c.currentTime);
  g.gain.exponentialRampToValueAtTime(gain, c.currentTime + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  osc.connect(g);
  g.connect(master);
  osc.start();
  osc.stop(c.currentTime + dur + 0.02);
  osc.onended = () => {
    osc.disconnect();
    g.disconnect();
  };
}

export function sfxClick() {
  beep(420, 0.06, "square", 0.05);
}

export function sfxAssign() {
  beep(520, 0.08, "triangle", 0.08);
  setTimeout(() => beep(780, 0.1, "triangle", 0.06), 70);
}

export function sfxError() {
  beep(180, 0.16, "sawtooth", 0.07);
  setTimeout(() => beep(140, 0.18, "sawtooth", 0.06), 90);
}

export function sfxSuccess() {
  beep(523, 0.12, "triangle", 0.08);
  setTimeout(() => beep(659, 0.12, "triangle", 0.07), 110);
  setTimeout(() => beep(784, 0.18, "triangle", 0.07), 220);
}

export function sfxWhoosh() {
  beep(240, 0.09, "sine", 0.04);
}
