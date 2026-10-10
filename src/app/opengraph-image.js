import { ImageResponse } from "next/og";

// Share card for link previews (WhatsApp, LinkedIn, X), drawn in the site's
// paper & ink style instead of using a photo.
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
      font("montserrat/files/montserrat-latin-800-normal.woff"),
      font("dm-mono/files/dm-mono-latin-400-normal.woff"),
    ]);
    fonts = [
      { name: "Montserrat", data: mont, weight: 800, style: "normal" },
      { name: "DM Mono", data: mono, weight: 400, style: "normal" },
    ];
  } catch {
    // Offline build: fall back to the default font rather than failing.
  }
  const grid = "linear-gradient(rgba(13,15,14,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(13,15,14,0.07) 1px, transparent 1px)";
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
          background: "#ece6d9",
          backgroundImage: grid,
          backgroundSize: "28px 28px",
          color: "#0d0f0e",
          fontFamily: "Montserrat",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 34, fontWeight: 800, lineHeight: 0.9, letterSpacing: -2 }}>
            <span>rahul</span>
            <span>verma</span>
          </div>
          <div style={{ display: "flex", fontFamily: "DM Mono", background: "#b94835", color: "#fbf7ee", fontSize: 22, padding: "10px 22px", borderRadius: 999, transform: "rotate(6deg)" }}>
            OPEN TO FREELANCE
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 168, fontWeight: 800, letterSpacing: -10, lineHeight: 0.9 }}>
            BUILD <span style={{ color: "#b94835", margin: "0 28px" }}>&</span> SHIP
          </div>
          <div style={{ display: "flex", fontSize: 62, fontWeight: 800, letterSpacing: -3, marginTop: 14 }}>
            CLEAN CODE, LATE NIGHTS<span style={{ color: "#b94835" }}>.</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "DM Mono", fontSize: 22, letterSpacing: 1, color: "#292b28" }}>
          <span>FULL-STACK SOFTWARE ENGINEER · MERN · REACT NATIVE · AI</span>
          <span>RAHULVERMA.SITE</span>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
