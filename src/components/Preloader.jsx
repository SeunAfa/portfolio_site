import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/**
 * Full-screen loading page.
 *
 * Intro choreography:
 *   1. logo fades in LARGE, centered
 *   2. logo scales down to its real size
 *   3. the name slides in from the left to sit beside it (same height)
 *
 * It stays up until the page has loaded (window "load"), but never less than
 * the intro animation's length (so it always plays in full) and never longer
 * than a hard cap (so a slow resource — e.g. the video — can't make it hang).
 * On finish it fades out and signals the app via `preloader:done` /
 * window.__preloaderDone so the hero intro only runs after the page is loaded.
 */
export default function Preloader() {
  const rootRef     = useRef(null);
  const logoRef     = useRef(null);
  const nameWrapRef = useRef(null);
  const nameRef     = useRef(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const MIN_MS = 1600; // intro + at least one loop beat before it can finish
    const MAX_MS = 6000; // hard cap so it never hangs (loop runs until loaded)
    const start = performance.now();
    let finished = false;
    let loopTween = null;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    // ── Intro + loading loop ──────────────────────────────────────────────
    const ctx = gsap.context(() => {
      gsap.set(logoRef.current, { scale: 2.4, autoAlpha: 0, transformOrigin: "center center" });
      gsap.set(nameWrapRef.current, { width: 0 });
      gsap.set(nameRef.current, { xPercent: -100, autoAlpha: 0 });

      gsap.timeline({
        defaults: { ease: "power3.out" },
        // Once the logo has appeared + shrunk, pulse it on a loop while loading.
        onComplete: () => {
          loopTween = gsap.to(logoRef.current, {
            scale: 1.07,
            duration: 0.75,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        },
      })
        .to(logoRef.current, { autoAlpha: 1, duration: 0.5 })             // appear large
        .to(logoRef.current, { scale: 1, duration: 0.7, ease: "power3.inOut" }, "+=0.2"); // shrink
    }, rootRef);

    // ── Final animation (once fully loaded) ───────────────────────────────
    const finish = () => {
      if (finished) return;
      finished = true;
      if (loopTween) loopTween.kill();

      const nameWidth = nameRef.current.scrollWidth + 14; // + gap

      gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          document.body.style.overflow = prevOverflow;
          window.__preloaderDone = true;
          window.dispatchEvent(new Event("preloader:done"));
          setHidden(true);
        },
      })
        // settle the pulsing logo back to rest
        .to(logoRef.current, { scale: 1, duration: 0.3, ease: "power2.inOut" })
        // name slides in from the left beside the logo
        .to(nameWrapRef.current, { width: nameWidth, duration: 0.55, ease: "power3.inOut" }, "<")
        .to(nameRef.current, { xPercent: 0, autoAlpha: 1, duration: 0.55 }, "<")
        // brief hold, then reveal the site
        .to(rootRef.current, { autoAlpha: 0, duration: 0.5, ease: "power2.out" }, "+=0.45");
    };

    const onLoad = () =>
      setTimeout(finish, Math.max(0, MIN_MS - (performance.now() - start)));

    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    const maxTimer = setTimeout(finish, MAX_MS);

    return () => {
      window.removeEventListener("load", onLoad);
      clearTimeout(maxTimer);
      if (loopTween) loopTween.kill();
      ctx.revert();
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-inkBlack overflow-hidden"
    >
      {/* Subtle grid backdrop to match the site */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(75,115,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(75,115,255,0.06) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse 70% 70% at 50% 50%, black 10%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 70% at 50% 50%, black 10%, transparent 75%)",
        }}
      />

      {/* Brand — logo + name, vertically centered together.
          Initial opacity/width:0 inline so nothing flashes before GSAP inits. */}
      <div className="relative z-10 flex items-center">
        {/* Filled vector logo (matches the favicon) — crisp at any scale */}
        <div ref={logoRef} style={{ opacity: 0, display: "block" }}>
          <svg viewBox="0 0 114 114" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M56.2178 53.2171H30.1084V79.3265H56.2178V105.435H4V27.1087H56.2178V53.2171Z" fill="white" />
            <path d="M108.435 79.3262H56.2175V53.2178H82.3259V27.1084H56.2175V1H108.435V79.3262Z" fill="white" />
          </svg>
        </div>
        {/* width animates 0 → auto; overflow-hidden clips the name as it slides in */}
        <div ref={nameWrapRef} style={{ width: 0, overflow: "hidden", whiteSpace: "nowrap" }}>
          <span
            ref={nameRef}
            className="text-white font-bold"
            style={{ fontSize: "2.25rem", letterSpacing: "0.05em", lineHeight: 1, paddingLeft: "14px", display: "inline-block", opacity: 0 }}
          >
            Seun<span className="text-brightBlue">.</span>
          </span>
        </div>
      </div>
    </div>
  );
}
