// Hand-built vector objects for the drafting-sheet theme. Each
// entry is { vb, art, loose? }: `art` gets the die-cut sticker filter, `loose`
// (steam, motion trails) is drawn without it. Coordinates are centered on 0,0.

const C = {
  ink: "#12151c", ink2: "#2a2f3a", muted: "#616977", cream: "#fbfaf6",
  red: "#e5470d", blue: "#0e7c7b", yellow: "#f4dc4b", pink: "#8fd3b6",
};

// Laptop with a git graph: a feature branch merging back into main.
function laptopArt() {
  const commit = (x, y, c) => `<circle cx="${x}" cy="${y}" r="4.2" fill="${c}" stroke="#12151c" stroke-width="1.4"/>`;
  return `<path d="M-104,52 h208 l-10,12 h-188 z" fill="#c9ccd2"/>
    <rect x="-22" y="52" width="44" height="4" rx="2" fill="#9aa0ab"/>
    <rect x="-90" y="-62" width="180" height="114" rx="8" fill="#2a2f3a"/>
    <rect x="-82" y="-54" width="164" height="98" rx="3" fill="#12151c"/>
    <circle cx="-74" cy="-47" r="2" fill="${C.red}"/><circle cx="-67" cy="-47" r="2" fill="${C.yellow}"/><circle cx="-60" cy="-47" r="2" fill="#3fc1bd"/>
    <text x="74" y="-45" text-anchor="end" class="m" font-size="5.5" fill="#616977">git log --graph</text>
    <path d="M-66,-20 H66" stroke="#9aa0ab" stroke-width="2.4"/>
    <path d="M-34,-20 C-24,-20 -24,6 -12,6 H20 C32,6 32,-20 42,-20" fill="none" stroke="#3fc1bd" stroke-width="2.4"/>
    ${commit(-66, -20, "#9aa0ab")}${commit(-48, -20, "#9aa0ab")}${commit(-34, -20, "#9aa0ab")}
    ${commit(-6, 6, "#3fc1bd")}${commit(10, 6, "#3fc1bd")}${commit(66, -20, C.red)}
    <circle cx="42" cy="-20" r="5.5" fill="${C.yellow}" stroke="#12151c" stroke-width="1.4"/>
    <text x="-66" y="-30" class="m" font-size="5.5" fill="#9aa0ab">main</text>
    <text x="-8" y="18" class="m" font-size="5.5" fill="#3fc1bd">feat/ship</text>
    <rect x="-66" y="26" width="64" height="12" rx="6" fill="#3fc1bd"/>
    <text x="-34" y="34.2" text-anchor="middle" class="m" font-size="6" fill="#12151c">✓ PR MERGED</text>
    <text x="66" y="34.2" text-anchor="end" class="m" font-size="6" fill="#9aa0ab">CI · 42 passing</text>`;
}

function phoneArt() {
  const bars = [14, 22, 9, 28, 18, 32, 12];
  const barSvg = bars.map((h, i) =>
    `<rect x="${-24 + i * 7}" y="${40 - h}" width="4.6" height="${h}" rx="1.5" fill="${i === 5 ? C.red : C.ink}" fill-opacity="${i === 5 ? 1 : 0.75}"/>`).join("");
  return `<rect x="-36" y="-70" width="72" height="140" rx="13" fill="${C.ink}"/>
    <rect x="-32" y="-66" width="64" height="132" rx="10" fill="#f7f2e7"/>
    <rect x="-10" y="-62" width="20" height="5" rx="2.5" fill="${C.ink}"/>
    <text x="-24" y="-40" class="m" font-size="5.5" fill="${C.muted}" letter-spacing="0.5">SCREEN TIME</text>
    <text x="-25" y="-24" class="d" font-size="15" fill="${C.ink}" letter-spacing="-0.5">2h 14m</text>
    <text x="-24" y="-14" class="m" font-size="5" fill="${C.red}">↓ 38% vs last week</text>
    ${barSvg}
    <line x1="-25" y1="40.5" x2="25" y2="40.5" stroke="${C.ink}" stroke-opacity="0.3" stroke-width="0.6"/>
    <rect x="-24" y="48" width="48" height="10" rx="5" fill="${C.blue}"/>
    <text x="0" y="55" text-anchor="middle" class="m" font-size="5" fill="${C.cream}">LIMIT SET ✓</text>`;
}

const mugSteam = [-14, 0, 14].map((x, i) =>
  `<path d="M${x},-48 c-6,-8 6,-14 0,-22 c-6,-8 6,-14 0,-20" fill="none" stroke="${C.muted}" stroke-width="2.4" stroke-linecap="round" opacity="0">
    <animate attributeName="opacity" values="0;0.6;0" dur="3s" begin="${i * 0.8}s" repeatCount="indefinite"/>
    <animateTransform attributeName="transform" type="translate" values="0,6;0,-4" dur="3s" begin="${i * 0.8}s" repeatCount="indefinite"/></path>`).join("");

const mugArt = `<path d="M30,-22 a20,20 0 1,1 0,40" fill="none" stroke="${C.red}" stroke-width="9"/>
  <path d="M-36,-38 h72 v62 a14,14 0 0 1 -14,14 h-44 a14,14 0 0 1 -14,-14 z" fill="${C.red}"/>
  <ellipse cx="0" cy="-38" rx="36" ry="7" fill="#b8400c"/>
  <ellipse cx="0" cy="-37" rx="31" ry="5" fill="#3b2418"/>
  <rect x="-24" y="-16" width="48" height="26" rx="4" fill="${C.cream}"/>
  <text x="0" y="2" text-anchor="middle" class="m" font-size="13" fill="${C.ink}">&lt;/&gt;</text>`;

const duckArt = `<path d="M-46,8 c0,-26 24,-34 48,-26 c14,4 26,2 38,-6 c4,18 -2,48 -40,52 h-22 c-16,0 -24,-8 -24,-20 z" fill="#f6c844"/>
  <path d="M-14,4 c10,-10 30,-8 36,4 c-10,8 -26,8 -36,-4 z" fill="#e2ad2b"/>
  <circle cx="-22" cy="-30" r="24" fill="#f6c844"/>
  <path d="M-46,-30 c-10,-2 -18,2 -20,8 c8,4 18,2 22,-2 z" fill="#ef7f2d"/>
  <circle cx="-30" cy="-36" r="4.2" fill="${C.ink}"/><circle cx="-31.4" cy="-37.4" r="1.4" fill="#fff"/>`;

function stickyArt() {
  const items = [["build", true], ["ship", true], ["sleep", false]];
  return `<path d="M-48,-46 h96 v78 l-16,16 h-80 z" fill="${C.yellow}"/>
    <path d="M48,32 l-16,16 v-16 z" fill="#d9b25e"/>
    <rect x="-14" y="-52" width="28" height="12" fill="${C.cream}" fill-opacity="0.75" transform="rotate(-4)"/>
    <text x="-38" y="-24" class="m" font-size="11" fill="${C.ink}" letter-spacing="0.5">TODO:</text>
    ${items.map(([t, done], i) => {
      const y = -6 + i * 17;
      return `<rect x="-38" y="${y - 8}" width="9" height="9" rx="1.5" fill="none" stroke="${C.ink}" stroke-width="1.3"/>
        ${done ? `<path d="M-36.5,${y - 4} l2.5,3 l5,-7" fill="none" stroke="${C.red}" stroke-width="2" stroke-linecap="round"/>` : ""}
        <text x="-24" y="${y}" class="m" font-size="10.5" fill="${C.ink}"${done ? ` text-decoration="line-through"` : ""}>${t}</text>`;
    }).join("")}`;
}

function swapArt() {
  const card = (x, y, r, fill, fg, label, glyph) =>
    `<g transform="translate(${x},${y}) rotate(${r})"><rect x="-24" y="-32" width="48" height="64" rx="6" fill="${fill}"/>
      <text y="4" text-anchor="middle" class="d" font-size="20" fill="${fg}">${glyph}</text>
      <text y="22" text-anchor="middle" class="m" font-size="6.5" fill="${fg}" letter-spacing="0.6">${label}</text></g>`;
  return card(-18, 0, -10, C.blue, C.cream, "TEACH", "JS") + card(18, 4, 9, C.yellow, C.ink, "LEARN", "UI");
}

const gradCapArt = `<path d="M-30,-2 v18 c0,10 60,10 60,0 v-18 z" fill="${C.ink2}"/>
  <polygon points="0,-28 52,-8 0,12 -52,-8" fill="${C.ink}"/>
  <circle cx="0" cy="-8" r="3.5" fill="${C.yellow}"/>
  <path d="M0,-8 L38,4 v22" fill="none" stroke="${C.yellow}" stroke-width="2.6"/>
  <path d="M33,26 h10 l2,14 h-14 z" fill="${C.yellow}"/>`;

function chatArt() {
  const dots = [0, 1, 2].map((i) =>
    `<circle cx="${12 + i * 10}" cy="14" r="3" fill="${C.cream}"><animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" begin="${i * 0.2}s" repeatCount="indefinite"/></circle>`).join("");
  return `<path d="M-46,-40 h56 a10,10 0 0 1 10,10 v18 a10,10 0 0 1 -10,10 h-40 l-12,10 v-10 h-4 a10,10 0 0 1 -10,-10 v-18 a10,10 0 0 1 10,-10 z" fill="${C.pink}"/>
    <text x="-38" y="-17" class="s" font-size="11" fill="${C.ink}">you up?</text>
    <path d="M-4,0 h50 a10,10 0 0 1 10,10 v10 a10,10 0 0 1 -10,10 h-4 v10 l-12,-10 h-34 a10,10 0 0 1 -10,-10 v-10 a10,10 0 0 1 10,-10 z" fill="${C.blue}"/>
    ${dots}`;
}

const editorArt = `<rect x="-50" y="-38" width="100" height="70" rx="6" fill="#1e1f1d"/>
  <circle cx="-41" cy="-30" r="2.4" fill="${C.red}"/><circle cx="-33" cy="-30" r="2.4" fill="${C.yellow}"/><circle cx="-25" cy="-30" r="2.4" fill="#7fb069"/>
  ${[[-40, 46, C.blue], [-34, 30, C.pink], [-34, 52, "#e5dfd2"], [-40, 22, C.yellow], [-34, 40, "#e5dfd2"]].map(([x, w, c], i) =>
    `<rect x="${x}" y="${-18 + i * 9}" width="${w}" height="4" rx="2" fill="${c}" fill-opacity="0.85"/>`).join("")}
  <g transform="translate(30,26) rotate(-8)">
    <rect x="-24" y="-17" width="48" height="34" rx="6" fill="#c9ccd2"/>
    <rect x="-20" y="-15" width="40" height="26" rx="4" fill="#eef0f2"/>
    <text y="3" text-anchor="middle" class="m" font-size="10" fill="${C.ink}">Alt+S</text>
  </g>`;

const planeArt = `<polygon points="-20,-4 48,-34 10,26" fill="${C.cream}"/>
  <polygon points="-20,-4 48,-34 4,6" fill="#e4e7ea"/>
  <polygon points="4,6 48,-34 10,26 6,10" fill="#cfd4da"/>
  <path d="M-20,-4 L48,-34 L10,26 Z M4,6 L48,-34" fill="none" stroke="${C.ink}" stroke-width="1.6" stroke-linejoin="round"/>`;

// "NDA" rubber stamp for confidential client work.
const stampArt = `<rect x="-62" y="-30" width="124" height="60" rx="8" fill="${C.cream}"/>
  <rect x="-56" y="-24" width="112" height="48" rx="5" fill="none" stroke="${C.red}" stroke-width="3"/>
  <text y="6" text-anchor="middle" class="d" font-size="24" fill="${C.red}" letter-spacing="2">NDA</text>
  <text y="18" text-anchor="middle" class="m" font-size="6.5" fill="${C.red}" letter-spacing="1.4">CLIENT WORK</text>`;

export const STICKERS = {
  laptop: { vb: "-112 -72 228 146", art: laptopArt() },
  phone: { vb: "-48 -82 96 164", art: phoneArt() },
  mug: { vb: "-48 -98 116 148", art: mugArt, loose: mugSteam },
  duck: { vb: "-78 -66 130 130", art: duckArt },
  sticky: { vb: "-60 -64 120 124", art: stickyArt() },
  swap: { vb: "-58 -52 116 104", art: swapArt() },
  gradCap: { vb: "-64 -40 128 92", art: gradCapArt },
  chat: { vb: "-58 -52 126 104", art: chatArt() },
  editor: { vb: "-62 -50 130 110", art: editorArt },
  plane: { vb: "-32 -46 92 84", art: planeArt },
  stamp: { vb: "-72 -40 144 80", art: stampArt },
};
