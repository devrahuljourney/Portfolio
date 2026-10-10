/** Boxed "RV" monogram + name in mono, used by the nav, loader and footer. */
export default function Wordmark({ className = "", inverted = false }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className={`display flex h-8 w-8 items-center justify-center text-[17px] leading-none ${
          inverted ? "bg-[#f1efe9] text-[#12151c]" : "bg-[color:var(--color-fg)] text-[color:var(--color-bg)]"
        }`}
      >
        RV
      </span>
      <span className="font-mono text-[12px] uppercase leading-tight tracking-[0.14em]">
        Rahul Verma
        <span className="block text-[10px] tracking-[0.18em] opacity-60">Full-stack eng.</span>
      </span>
    </span>
  );
}
