// Tiny synthesized sound effects for UI feedback. No audio files — everything
// is generated on the fly with the Web Audio API, same approach the keyboard
// demo already used for its mechanical "thock".

let ctx;
function getCtx() {
  if (typeof window === "undefined") return null;
  ctx ??= new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(ctx, { freq, duration, type = "sine", gain = 0.2, glideTo }) {
  const t0 = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + duration);
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

function noiseBurst(ctx, { duration, freq, q = 1, gain = 0.5 }) {
  const t0 = ctx.currentTime;
  const len = Math.floor(ctx.sampleRate * duration);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = freq;
  filter.Q.value = q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, t0);
  src.connect(filter).connect(g).connect(ctx.destination);
  src.start(t0);
}

const sounds = {
  // Generic, subtle hover tick — used for any link/button by default.
  hover(c) {
    tone(c, { freq: 1500, duration: 0.04, type: "sine", gain: 0.035 });
  },
  // Generic click — used for any link/button by default.
  click(c) {
    noiseBurst(c, { duration: 0.02, freq: 2400, q: 1.2, gain: 0.3 });
  },
  // A switch-flip blip, for toggles.
  toggle(c) {
    tone(c, { freq: 480, duration: 0.09, type: "triangle", gain: 0.12, glideTo: 880 });
  },
  // A single mechanical keycap "thock" — pitch varies per call.
  key(c) {
    noiseBurst(c, { duration: 0.03, freq: 1800 + Math.random() * 600, q: 1, gain: 0.5 });
  },
  // Picking an SVG object up off the sheet: a quick upward chirp.
  pickup(c) {
    tone(c, { freq: 600, duration: 0.07, type: "triangle", gain: 0.1, glideTo: 950 });
  },
  // Setting it back down: a soft low thud.
  drop(c) {
    tone(c, { freq: 160, duration: 0.14, type: "sine", gain: 0.22, glideTo: 60 });
  },
  // Short rising chime, for success states (e.g. a form submission).
  success(c) {
    [660, 880].forEach((f, i) =>
      setTimeout(() => {
        if (!ctx) return;
        tone(ctx, { freq: f, duration: 0.16, type: "sine", gain: 0.12 });
      }, i * 90)
    );
  },
};

export function play(name) {
  const c = getCtx();
  if (!c) return;
  (sounds[name] || sounds.click)(c);
}
