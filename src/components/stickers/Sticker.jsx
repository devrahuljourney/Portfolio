import { STICKERS } from "./art";

/**
 * Renders one of the vector stickers. Purely decorative (aria-hidden); the
 * die-cut edge comes from the shared #stk filter in <StickerDefs/>.
 */
export default function Sticker({ name, className = "", style, ...rest }) {
  const s = STICKERS[name];
  return (
    <div aria-hidden="true" className={className} style={style} {...rest}>
      <svg viewBox={s.vb} className="sticker-svg block h-auto w-full">
        {s.loose && <g dangerouslySetInnerHTML={{ __html: s.loose }} />}
        <g filter="url(#stk)" dangerouslySetInnerHTML={{ __html: s.art }} />
      </svg>
    </div>
  );
}
