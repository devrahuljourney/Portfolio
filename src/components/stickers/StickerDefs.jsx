/** Shared SVG filter: thin ink outline plus a hard, unblurred offset shadow. */
export default function StickerDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
      <defs>
        <filter id="stk" x="-20%" y="-20%" width="150%" height="150%" colorInterpolationFilters="sRGB">
          <feMorphology in="SourceAlpha" operator="dilate" radius="1.6" result="d" />
          <feFlood floodColor="#12151c" />
          <feComposite in2="d" operator="in" result="outline" />
          <feOffset in="d" dx="5" dy="6" result="o" />
          <feFlood floodColor="#12151c" floodOpacity="0.9" />
          <feComposite in2="o" operator="in" result="shadow" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="outline" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
