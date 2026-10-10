"use client";

import { useRef, useState } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import { contactEmail } from "@/constant/data";
import { createPlane } from "./origami";

// The contact form is the top sheet of a tear-off notepad. On send the sheet
// is folded, origami-style, into a paper plane (see origami.js) while the
// message sends. The plane takes off at once, circles if the server is slow,
// then slides into the postbox slot. The next page keeps your name and email.
// If sending fails it flies home and unfolds back into the sheet.

const blank = { name: "", email: "", message: "" };
const PAPER = "#fbfaf6";

function Blank({ className = "", ...props }) {
  return (
    <input
      {...props}
      required
      className={`mx-1 inline-block min-w-0 border-b-2 border-dashed border-[#12151c]/40 bg-transparent px-1 font-mono text-[0.95em] text-[#0e7c7b] outline-none transition-colors placeholder:text-[#9aa0ab] focus:border-[#e5470d] ${className}`}
    />
  );
}

// Slot height from the box top. The box is layered so a plane can really go
// in: the upper body sits BEHIND the plane (z 15) and the lower front panel
// sits IN FRONT of it (z 40). A plane diving at the slot shows over the top
// of the box and disappears exactly at the slot line.
const SLOT_Y = 52;

function Postbox({ boxRef, flagRef }) {
  return (
    <div ref={boxRef} className="relative h-[150px] w-[118px] shrink-0" aria-hidden="true">
      {/* Flag (raises when a letter arrives) */}
      <div ref={flagRef} className="absolute -right-4 top-14 z-[41] h-16 w-2 origin-bottom bg-[#12151c]" style={{ transform: "rotate(180deg)" }}>
        <span className="absolute -right-0 top-0 h-5 w-6 translate-x-full bg-[#e5470d]" />
      </div>
      {/* Body: domed top, behind the plane */}
      <div data-shake className="absolute inset-0 z-[15] flex justify-center rounded-t-[44px] border-2 border-[#12151c] bg-[#e5470d] pt-4">
        <span className="font-mono text-[11px] font-bold tracking-[0.3em] text-[#fbfaf6]">POST</span>
      </div>
      {/* The slot */}
      <div data-shake className="absolute left-1/2 z-[16] h-[10px] w-[74%] -translate-x-1/2 rounded-sm bg-[#12151c]" style={{ top: SLOT_Y - 10 }} />
      {/* Lower front panel: in front of the plane, hides what goes in */}
      <div
        data-shake
        className="absolute inset-x-0 bottom-0 z-[40] flex flex-col items-center border-2 border-t-[3px] border-[#12151c] bg-[#e5470d] pt-4 shadow-[6px_7px_0_var(--shadow)]"
        style={{ top: SLOT_Y }}
      >
        <span className="font-mono text-[9px] uppercase tracking-wider text-[#fbfaf6]/85">to: rahul</span>
        <span className="mt-1 h-px w-12 bg-[#fbfaf6]/50" />
        <span className="mt-auto h-3 w-full border-t-2 border-[#12151c] bg-[#a8340a]" />
      </div>
    </div>
  );
}

export default function Notepad() {
  const stage = useRef(null);
  const sheet = useRef(null);
  const box = useRef(null);
  const flag = useRef(null);
  const [form, setForm] = useState(blank);
  const [status, setStatus] = useState(null); // null | loading | sent | error
  const [page, setPage] = useState(1);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const wait = (t) => new Promise((r) => setTimeout(r, t * 1000));
  const play = (tl) => new Promise((r) => tl.eventCallback("onComplete", r).play());

  // Flight plan, all in stage coordinates. root.style.left/top is the
  // plane's resting spot; GSAP's x/y are offsets from it.
  const flightPlan = (root) => {
    const st = stage.current.getBoundingClientRect();
    const b = box.current.getBoundingClientRect();
    const ox = parseFloat(root.style.left), oy = parseFloat(root.style.top);
    const at = () => ({ x: ox + gsap.getProperty(root, "x"), y: oy + gsap.getProperty(root, "y") });
    const slot = { x: b.left - st.left + b.width / 2, y: b.top - st.top + SLOT_Y - 5 };
    // Keep the whole route inside the viewport.
    const L = -st.left + 70, R = window.innerWidth - st.left - 70;
    const cx = (x) => Math.min(R, Math.max(L, x));
    const rel = (pts) => pts.map((p) => ({ x: p.x - ox, y: p.y - oy }));
    return { ox, oy, at, slot, L, R, cx, rel };
  };

  const joyride = (root, f) => {
    const s0 = f.at(), span = f.R - f.L;
    const route = [
      { x: f.cx(s0.x + span * 0.1), y: s0.y - 130 },
      { x: f.cx(s0.x - span * 0.25), y: s0.y - 200 },
      { x: f.cx(f.L + span * 0.1), y: s0.y - 10 },
      { x: f.cx(f.L + span * 0.3), y: s0.y + 170 },
      { x: f.cx(s0.x - span * 0.05), y: s0.y + 70 },
      { x: f.cx(f.slot.x - 90), y: f.slot.y - 210 },
    ];
    return play(gsap.timeline({ paused: true }).to(root, { motionPath: { path: f.rel(route), curviness: 1.3, autoRotate: 90 }, duration: 3, ease: "power1.inOut" }));
  };

  // One lap of a holding pattern above the postbox, while the server works.
  const holdingLap = (root, f) => {
    const c = { x: f.cx(f.slot.x - 70), y: f.slot.y - 200 }, r = 62;
    const pts = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((k) => {
      const a = Math.PI + (k / 8) * Math.PI * 2;
      return { x: c.x + Math.cos(a) * r * 1.4, y: c.y + Math.sin(a) * r };
    });
    return play(gsap.timeline({ paused: true }).to(root, { motionPath: { path: f.rel(pts), curviness: 1.4, autoRotate: 90 }, duration: 1.6, ease: "none" }));
  };

  const landInBox = (root, f) => {
    const tl = gsap.timeline({ paused: true });
    tl.to(root, {
      motionPath: { path: f.rel([{ x: f.slot.x + 40, y: f.slot.y - 120 }, { x: f.slot.x, y: f.slot.y - 55 }]), curviness: 1.2, autoRotate: 90 },
      scale: gsap.getProperty(root, "scale") * 0.55,
      duration: 0.75,
      ease: "power1.inOut",
    })
      // From here the plane is between the box body (z 15) and its front (z 40).
      .set(root, { zIndex: 20 })
      // Shallow enough that the nose never pokes out under the box, then gone.
      .to(root, { x: f.slot.x - f.ox, y: f.slot.y + 52 - f.oy, rotation: 180, duration: 0.5, ease: "power2.in" })
      .set(root, { autoAlpha: 0 })
      .to(flag.current, { rotation: 0, duration: 0.5, ease: "back.out(3)" }, "-=0.1")
      .to(box.current.querySelectorAll("[data-shake]"), { y: 3, duration: 0.08, yoyo: true, repeat: 1 }, "<");
    return play(tl);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    let result = null; // null while pending, then true / false
    const send = fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((r) => r.ok)
      .catch(() => false)
      .then((ok) => (result = ok));

    // Next page keeps who you are; only the message is fresh.
    const nextPage = () => {
      setForm((f) => ({ ...blank, name: f.name, email: f.email }));
      setPage((p) => p + 1);
      setStatus("sent");
    };

    if (reducedMotion()) {
      if (await send) nextPage();
      else setStatus("error");
      return;
    }

    // Let "Sending..." show on the sheet, then fold while the request runs.
    await wait(0.45);
    const plane = createPlane(sheet.current, stage.current);
    gsap.set(sheet.current, { autoAlpha: 0 }); // the next page shows underneath
    await play(plane.fold);
    await play(plane.open);

    // Take off straight away; circle above the box if the server is slow.
    const f = flightPlan(plane.root);
    const home = f.at();
    const bank = plane.bank();
    await joyride(plane.root, f);
    while (result === null) await holdingLap(plane.root, f);
    bank.kill();

    if (result) {
      await landInBox(plane.root, f);
      plane.root.remove();
      nextPage();
      gsap.set(sheet.current, { autoAlpha: 1 });
      gsap.from(sheet.current, { y: 6, duration: 0.4, ease: "power2.out" });
    } else {
      // Fly home, then unfold back into the sheet with the text intact.
      await play(
        gsap.timeline({ paused: true }).to(plane.root, {
          motionPath: { path: f.rel([{ x: home.x + 80, y: home.y - 120 }, home]), curviness: 1.2, autoRotate: 90 },
          duration: 1.1,
          ease: "power2.inOut",
        })
      );
      gsap.to(plane.root, { rotation: 0, duration: 0.3 });
      await new Promise((r) => plane.open.eventCallback("onReverseComplete", r).reverse());
      await new Promise((r) => plane.fold.eventCallback("onReverseComplete", r).timeScale(1.6).reverse());
      plane.root.remove();
      gsap.set(sheet.current, { autoAlpha: 1 });
      setStatus("error");
    }
  };

  return (
    <div ref={stage} className="relative flex flex-col items-stretch gap-8">
      <div className="relative">
        {/* Pad: binding strip, then the stack of sheets */}
        <div className="relative z-[3] flex h-9 items-center justify-center gap-[18px] rounded-t-md border-2 border-b-0 border-[#12151c] bg-[#12151c]">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-bg)]" />
          ))}
        </div>
        {/* Sheets underneath, peeking at the bottom */}
        <div aria-hidden="true" className="absolute inset-x-[6px] -bottom-[12px] top-9 rounded-b-md bg-[#e4e2db] shadow-[0_20px_40px_-20px_rgba(18,21,28,0.5)]" />
        <div aria-hidden="true" className="absolute inset-x-[3px] -bottom-[6px] top-9 rounded-b-md bg-[#efede6]" />
        {/* Blank next page, visible while the top sheet is away */}
        <div aria-hidden="true" className="ruled absolute inset-x-0 bottom-0 top-9 rounded-b-md" style={{ backgroundColor: PAPER }} />

        <form
          ref={sheet}
          onSubmit={onSubmit}
          className="ruled relative rounded-b-md border-t-[3px] border-dotted border-[#12151c]/30 py-7 pl-[46px] pr-5 text-[17px] leading-[32px] text-[#12151c] md:pr-10 md:text-lg"
          style={{ backgroundColor: PAPER }}
        >
          <p className="flex justify-between font-semibold">
            <span>Dear Rahul,</span>
            <span className="font-mono text-xs font-normal uppercase tracking-wider text-[#9aa0ab]">page {String(page).padStart(2, "0")}</span>
          </p>
          <p className="mt-[32px]">
            My name is
            <Blank name="name" value={form.name} onChange={onChange} placeholder="your name" aria-label="Your name" className="w-[11ch]" />
            and you can reach me at
            <Blank type="email" name="email" value={form.email} onChange={onChange} placeholder="you@email.com" aria-label="Your email" className="w-[17ch] max-w-full" />.
          </p>
          <p className="mt-[32px]">Here&apos;s what I have in mind:</p>
          <textarea
            name="message"
            value={form.message}
            onChange={onChange}
            required
            rows={4}
            aria-label="Your message"
            placeholder="an app, a site, an AI feature, a wild idea..."
            className="block w-full resize-none bg-transparent font-mono text-[0.95em] leading-[32px] text-[#0e7c7b] outline-none placeholder:text-[#9aa0ab]"
          />
          <div className="mt-[32px] flex flex-wrap items-center justify-between gap-4">
            <span className="font-semibold">Talk soon,</span>
            <button
              type="submit"
              disabled={status === "loading"}
              data-cursor-label="Send"
              className="border-2 border-[#12151c] bg-[#e5470d] px-5 py-2.5 font-mono text-sm uppercase tracking-wider text-[#fbfaf6] shadow-[4px_5px_0_#12151c] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {status === "loading" ? "Sending..." : "Tear & post ✉"}
            </button>
          </div>
          {status === "error" && (
            <p role="alert" className="mt-4 font-mono text-sm text-[#e5470d]">
              That didn&apos;t send. Try again, or email {contactEmail}.
            </p>
          )}
        </form>
      </div>

      {/* Postbox + delivery note */}
      <div className="flex items-end justify-end gap-5 pr-3">
        <p aria-live="polite" className="pb-2 text-right font-mono text-xs uppercase tracking-wider text-[color:var(--color-muted)]">
          {status === "sent" ? (
            <>
              <span className="text-[color:var(--color-accent)]">✓ Posted.</span>
              <br />
              I&apos;ll reply within a day.
            </>
          ) : (
            "Letters go here ↘"
          )}
        </p>
        <Postbox boxRef={box} flagRef={flag} />
      </div>
    </div>
  );
}
