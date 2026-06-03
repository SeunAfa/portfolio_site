import { useState, useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { gsap } from "gsap";
import SvgHeroSection from "./SvgHeroSection";
import { smoothScrollTo } from "../utils/scroll";

// ── Scroll indicator (robbowen style) ────────────────────────────────────
function ScrollIndicator() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative overflow-hidden"
        style={{ width: "1px", height: "56px", background: "rgba(255,255,255,0.12)" }}
      >
        <span
          className="absolute left-0 w-full"
          style={{
            height: "50%",
            background: "#4b73ff",
            animation: "scroll-line 1.6s ease-in-out infinite",
          }}
        />
      </div>
      <span
        className="font-mono uppercase text-white/30 tracking-[0.3em]"
        style={{ fontSize: "9px" }}
      >
        scroll
      </span>
    </div>
  );
}

// ── Typewriter cycling role ───────────────────────────────────────────
const ROLES = [
  "Frontend Developer",
  "React Developer",
  "UI Engineer",
  "Web Developer",
];

function TypewriterRole() {
  const [index, setIndex]     = useState(0);
  const [text, setText]       = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = ROLES[index];
    let timeout;

    if (!deleting && text.length < current.length) {
      timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), 80);
    } else if (!deleting && text.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(text.slice(0, -1)), 45);
    } else {
      setDeleting(false);
      setIndex((i) => (i + 1) % ROLES.length);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, index]);

  return (
    <span>
      {text}
      <span className="cursor-blink ml-0.5 text-brightBlue">|</span>
    </span>
  );
}

export default function HeroSection() {
  const isLarge = useMediaQuery({ query: "(min-width: 900px)" });
  const sectionRef = useRef(null);

  // ── One-time mount animation — fires once on page load ────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray("[data-ha]", sectionRef.current);
      if (!elements.length) return;
      gsap.from(elements, {
        y: 28,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.15,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const MobileHero = (
    <>
      <div className="z-10 w-full text-left">
        {/* Intro label */}
        <p data-ha className="font-mono text-white text-base sm:text-lg tracking-widest mb-3">
          Hi, I'm
        </p>

        {/* Name */}
        <h1 data-ha className="text-5xl sm:text-6xl font-extrabold leading-none">
          <span className="text-brightBlue italic">Seun</span>
        </h1>

        {/* Role */}
        <h2 data-ha className="text-xl sm:text-2xl font-bold text-white mt-3 min-h-[1.5em] text-left">
          <TypewriterRole />
        </h2>

        {/* Description */}
        <p data-ha className="text-base sm:text-lg text-white mt-4 max-w-sm leading-relaxed text-left">
          Building responsive, accessible, and user-focused web applications.
        </p>

        {/* CTAs */}
        <div data-ha className="flex gap-2 mt-6 justify-start">
          <a
            href="#projects"
            onClick={(e) => { e.preventDefault(); smoothScrollTo("#projects"); }}
            className="px-4 py-1.5 sm:px-5 sm:py-2 bg-brightBlue text-white font-semibold rounded-md text-xs hover:opacity-85 transition-opacity duration-200"
          >
            View My Work
          </a>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); smoothScrollTo("#contact"); }}
            className="px-4 py-1.5 sm:px-5 sm:py-2 border border-brightBlue text-brightBlue font-semibold rounded-md text-xs hover:bg-brightBlue hover:text-white transition-all duration-200"
          >
            Contact Me
          </a>
        </div>
      </div>

      {/* Illustration */}
      <div data-ha className="w-full flex justify-center items-center z-10 mt-4 sm:mt-5 mx-auto" style={{ maxWidth: "360px" }}>
        <SvgHeroSection className="w-full h-auto" />
      </div>
    </>
  );

  const DesktopHero = (
    <>
      {/* Hero Message */}
      <div className="flex-1 z-10 pr-2 lg:pr-4 xl:pr-8 text-left">
        {/* Intro label */}
        <p data-ha className="font-mono text-white tracking-widest mb-5"
           style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)" }}>
          Hi, I'm
        </p>

        {/* Name */}
        <h1 data-ha className="font-extrabold leading-none text-left"
            style={{ fontSize: "clamp(4rem, 8vw, 7rem)" }}>
          <span className="text-brightBlue italic">Seun</span>
        </h1>

        {/* Role */}
        <h2 data-ha className="font-bold text-white mt-4 min-h-[1.4em] text-left"
            style={{ fontSize: "clamp(1.6rem, 3vw, 3rem)" }}>
          <TypewriterRole />
        </h2>

        {/* Description */}
        <p data-ha className="text-white mt-6 max-w-md leading-relaxed text-left"
           style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)" }}>
          Building responsive, accessible, and user-focused web applications.
        </p>

        {/* CTAs */}
        <div data-ha className="flex gap-3 mt-6 justify-start">
          <a
            href="#projects"
            onClick={(e) => { e.preventDefault(); smoothScrollTo("#projects"); }}
            className="px-4 py-1.5 sm:px-5 sm:py-2 bg-brightBlue text-white font-semibold rounded-md text-xs hover:opacity-85 transition-opacity duration-200"
          >
            View My Work
          </a>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); smoothScrollTo("#contact"); }}
            className="px-4 py-1.5 sm:px-5 sm:py-2 border border-brightBlue text-brightBlue font-semibold rounded-md text-xs hover:bg-brightBlue hover:text-white transition-all duration-200"
          >
            Contact Me
          </a>
        </div>
      </div>

      {/* Illustration */}
      <div data-ha className="hero-illustration w-[46%] flex justify-center items-center z-10">
        <SvgHeroSection className="w-full h-auto max-w-xl xl:max-w-3xl" />
      </div>
    </>
  );

  return (
    <section ref={sectionRef} className="mt-[79px] min-h-[calc(100svh-79px)] w-full flex flex-col min-[900px]:flex-row justify-center items-start min-[900px]:items-center relative z-10 overflow-hidden bg-inkBlack">

      {isLarge ? (
        <div className="w-full flex min-[900px]:flex-row min-[900px]:gap-2 justify-center items-center mx-auto max-w-7xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl px-8 min-[900px]:px-10 lg:px-16">
          {DesktopHero}
        </div>
      ) : (
        <div className="w-full flex flex-col mx-auto max-w-lg px-6 sm:px-10 py-4 sm:py-8">
          {MobileHero}
        </div>
      )}

      {/* Scroll indicator — desktop */}
      {isLarge && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <ScrollIndicator />
        </div>
      )}


      {/* Background — grid fades toward edges, complete in centre */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(75,115,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(75,115,255,0.07) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage:
              "radial-gradient(ellipse 75% 75% at 50% 50%, black 20%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 75% 75% at 50% 50%, black 20%, transparent 75%)",
            animation: "grid-drift 15s linear infinite",
          }}
        />
      </div>

    </section>
  );
}
