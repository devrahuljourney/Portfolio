// Tiny sound effects for UI feedback. Everything is synthesized on the fly
// with the Web Audio API, except the keyboard, which plays real Cherry MX
// recordings from the MIT-licensed Mechvibes project:
// https://github.com/hainguyents13/mechvibes

let ctx;
function getCtx() {
  if (typeof window === "undefined") return null;
  ctx ??= new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  loadSwitch(ctx, currentSwitch);
  return ctx;
}

// Each public/sounds/switches/<name>.mp3 is a sprite: 13 keypresses, each in
// its own 400ms slot — ten alpha keys, then space, enter and backspace.
// `gain` evens out how loud the source recordings were.
export const SWITCHES = {
  red: { label: "Red", feel: "linear", gain: 1 },
  blue: { label: "Blue", feel: "clicky", gain: 0.8 },
  brown: { label: "Brown", feel: "tactile", gain: 1.45 },
};
const SLOT = 0.4;
const KEY_SLOTS = { alpha: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], space: [10], enter: [11], backspace: [12] };
const sprites = {}; // name -> Promise<AudioBuffer>
const loaded = {}; // name -> AudioBuffer
let currentSwitch = "red";

function loadSwitch(c, name) {
  sprites[name] ??= fetch(`/sounds/switches/${name}.mp3`)
    .then((r) => r.arrayBuffer())
    .then((data) => c.decodeAudioData(data))
    .then((buf) => (loaded[name] = buf))
    .catch((err) => {
      delete sprites[name];
      throw err;
    });
  return sprites[name];
}

// Switches the keyboard sound. Resolves once the new sprite is ready (right
// away if the audio context hasn't started yet — it loads on first sound).
export function setSwitch(name) {
  if (!SWITCHES[name]) return Promise.resolve();
  currentSwitch = name;
  return ctx ? loadSwitch(ctx, name).catch(() => {}) : Promise.resolve();
}

let lastSlot = -1;
function keyPress(c, buf, variant = "alpha") {
  const slots = KEY_SLOTS[variant] || KEY_SLOTS.alpha;
  let slot = slots[Math.floor(Math.random() * slots.length)];
  // Never repeat the same alpha sample twice in a row — that's what makes
  // canned key sounds feel robotic.
  if (slots.length > 1 && slot === lastSlot) slot = slots[(slots.indexOf(slot) + 1) % slots.length];
  lastSlot = slot;

  const src = c.createBufferSource();
  src.buffer = buf;
  src.playbackRate.value = 0.96 + Math.random() * 0.08;
  const g = c.createGain();
  g.gain.value = (0.55 + Math.random() * 0.15) * SWITCHES[currentSwitch].gain;
  src.connect(g).connect(c.destination);
  src.start(c.currentTime, slot * SLOT, SLOT);
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
  // A real Cherry MX keypress in the current switch. `variant` is "alpha",
  // "space", "enter" or "backspace"; falls back to a synthesized tick until
  // the sample loads.
  key(c, variant) {
    if (loaded[currentSwitch]) return keyPress(c, loaded[currentSwitch], variant);
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
  // For controls that play their own sound instead.
  silent() {},
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

export function play(name, variant) {
  const c = getCtx();
  if (!c) return;
  (sounds[name] || sounds.click)(c, variant);
}
