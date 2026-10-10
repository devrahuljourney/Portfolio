import { ImageResponse } from "next/og";

// Share card for link previews (WhatsApp, LinkedIn, X), drawn in the site's
// drafting-sheet style instead of using a photo.
export const alt = "Rahul Kumar Verma · Full-Stack Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Fonts are fetched once at build time (the image is statically generated).
const font = (file) =>
  fetch(`https://cdn.jsdelivr.net/npm/@fontsource/${file}`).then((r) => {
    if (!r.ok) throw new Error(`font ${file}: ${r.status}`);
    return r.arrayBuffer();
  });

export default async function OpengraphImage() {
  let fonts = [];
  try {
    const [mont, mono] = await Promise.all([
      font("archivo/files/archivo-latin-900-normal.woff"),
      font("jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff"),
    ]);
    fonts = [
      { name: "Archivo", data: mont, weight: 900, style: "normal" },
      { name: "JetBrains Mono", data: mono, weight: 400, style: "normal" },
    ];
  } catch {
    // Offline build: fall back to the default font rather than failing.
  }
  const grid = "linear-gradient(rgba(18,21,28,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(18,21,28,0.07) 1px, transparent 1px)";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          background: "#f1efe9",
          backgroundImage: grid,
          backgroundSize: "28px 28px",
          color: "#12151c",
          fontFamily: "Archivo",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", width: 60, height: 60, alignItems: "center", justifyContent: "center", background: "#12151c", color: "#f1efe9", fontSize: 30, fontWeight: 900 }}>RV</div>
            <div style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 24, letterSpacing: 3 }}>RAHUL VERMA</div>
          </div>
          <div style={{ display: "flex", fontFamily: "JetBrains Mono", background: "#e5470d", color: "#fbfaf6", fontSize: 22, padding: "10px 22px", borderRadius: 999, transform: "rotate(6deg)" }}>
            OPEN TO FREELANCE
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 104, fontWeight: 900, letterSpacing: -3, lineHeight: 0.92, whiteSpace: "nowrap" }}>SOFTWARE THAT</div>
          <div style={{ display: "flex", fontSize: 104, fontWeight: 900, letterSpacing: -3, lineHeight: 0.92, whiteSpace: "nowrap" }}>
            ACTUALLY SHIPS<span style={{ color: "#e5470d" }}>.</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "JetBrains Mono", fontSize: 22, letterSpacing: 1, color: "#2a2f3a" }}>
          <span>FULL-STACK SOFTWARE ENGINEER · MERN · REACT NATIVE · AI</span>
          <span>RAHULVERMA.SITE</span>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
