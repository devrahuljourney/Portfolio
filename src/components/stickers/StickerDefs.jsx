/** Shared SVG filter: cream die-cut border, thin red edge, soft shadow. */
export default function StickerDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
      <defs>
        <filter id="stk" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          <feMorphology in="SourceAlpha" operator="dilate" radius="5" result="d1" />
          <feFlood floodColor="#fbf7ee" />
          <feComposite in2="d1" operator="in" result="cream" />
          <feMorphology in="SourceAlpha" operator="dilate" radius="6.3" result="d2" />
          <feFlood floodColor="#e05a3f" />
          <feComposite in2="d2" operator="in" result="edge" />
          <feGaussianBlur in="d2" stdDeviation="3.5" />
          <feOffset dx="3" dy="5" result="b" />
          <feFlood floodColor="#0d0f0e" floodOpacity="0.28" />
          <feComposite in2="b" operator="in" result="shadow" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="edge" />
            <feMergeNode in="cream" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
