"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SvgAboutMe from "./SvgAboutMe";
import SvgDotsGrid from "./SvgDotsGrid";
import SvgGridSquareBtmR from "./SvgGridSquareBtmR";
import SvgGridSquareTpL from "./SvgGridSquareTpL";
import SvgCheckerdGridTpBtm from "./SvgCheckerdGridTpBtm";
import SvgOutlineSquare from "./SvgOutlineSquare";

gsap.registerPlugin(ScrollTrigger);

// ─── Split a word into individually-animatable letter spans ───────────────────
function SplitWord({ word, className, style, refCallback }) {
  return (
    <h1
      className={`${className} whitespace-nowrap`}
      style={style}
      aria-label={word}
    >
      {word.split("").map((char, i) => (
        <span
          key={i}
          ref={(el) => refCallback && refCallback(el, i)}
          style={{ display: "inline-block", willChange: "transform, opacity" }}
        >
          {char}
        </span>
      ))}
    </h1>
  );
}

export default function AboutMeSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  // Letter refs
  const aboutLetters = useRef([]);
  const meLetters = useRef([]);

  // Wrapper div refs — no need for SVG components to forward refs
  const svgGridTpL = useRef(null);
  const svgCheckerd = useRef(null);
  const svgOutlineL = useRef(null);
  const svgOutlineR = useRef(null);
  const svgDots = useRef(null);
  const svgGridBtmR = useRef(null);

  useGSAP(
    () => {
      const navbar = document.querySelector("nav");
      const navHeight = navbar ? navbar.getBoundingClientRect().height : 64;

      const about = aboutLetters.current.filter(Boolean);
      const me = meLetters.current.filter(Boolean);
      const allLetters = [...about, ...me];

      const svgDecos = [
        svgGridTpL.current,
        svgCheckerd.current,
        svgOutlineL.current,
        svgOutlineR.current,
        svgDots.current,
        svgGridBtmR.current,
      ].filter(Boolean);

      // ── Initial states ─────────────────────────────────────────────────
      gsap.set(about, { x: "-120vw", opacity: 0 });
      gsap.set(me, { x: "120vw", opacity: 0 });
      gsap.set(contentRef.current, { autoAlpha: 0, y: 60 });

      // SVGs start offset from their resting position, slide in from their edge:
      // top    → slide down  (y: -40 → 0)
      // bottom → slide up    (y: +40 → 0)
      // right  → slide left  (x: +40 → 0)
      gsap.set(svgGridTpL.current, { autoAlpha: 0, y: -40 }); // top-left     → down
      gsap.set(svgCheckerd.current, { autoAlpha: 0, y: 40 }); // bottom-left  → up
      gsap.set(svgOutlineL.current, { autoAlpha: 0, y: 40 }); // bottom-centre→ up
      gsap.set(svgOutlineR.current, { autoAlpha: 0, x: 40 }); // top-right    → left
      gsap.set(svgDots.current, { autoAlpha: 0, x: 40 }); // right-mid    → left
      gsap.set(svgGridBtmR.current, { autoAlpha: 0, y: 40 }); // bottom-right → up

      // ── Letter exit vectors ─────────────────────────────────────────────
      const letterExits = [
        { x: -280, y: -160, rotation: -35 },
        { x: 180, y: -220, rotation: 28 },
        { x: -120, y: 200, rotation: -20 },
        { x: 300, y: 120, rotation: 42 },
        { x: -200, y: -80, rotation: -55 },
        { x: 220, y: 180, rotation: 18 },
        { x: -340, y: 60, rotation: -30 },
        { x: 160, y: -260, rotation: 60 },
        { x: -80, y: 280, rotation: -45 },
      ];

      // ── MASTER TIMELINE ─────────────────────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: `top ${navHeight}px`,
          end: "+=300%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          // NOTE: fastScrollEnd removed. On a fast scroll-down it released the
          // pin early (before the true end), so the scroll snapped to catch up
          // and About slid away abruptly while Skills slid up over the still-
          // clearing content ("unclamping"). Holding the pin to the real
          // boundary lets onLeave complete the animation for a clean hand-off.
          // (Same fix already applied to ProjectsSection.)
          invalidateOnRefresh: true,
          // Force the timeline to its boundary the instant the pin releases.
          // Without this, the scrub lag leaves letters mid-scatter / Section 2
          // half-revealed as the section scrolls away, so it visually overlaps
          // the next section before "catching up". Snapping to the boundary on
          // leave makes the hand-off to the next section clean.
          onLeave: () => tl.progress(1),
          onLeaveBack: () => tl.progress(0),
        },
      });

      // PHASE 1 — "About" slides in from left ──────────────────────────────
      tl.to(
        about,
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "expo.out",
        },
        0.2
      );

      // PHASE 2 — "Me" slides in from right ────────────────────────────────
      tl.to(
        me,
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "expo.out",
        },
        "-=0.35"
      );

      // PHASE 3 — SVG decorations fade in alongside "Me" finishing ───────────
      // SVGs slide into their resting positions at the same time as the text
      // Each animates back to x:0/y:0 (their natural CSS position) while fading in
      tl.to(
        svgGridTpL.current,
        { autoAlpha: 1, y: 0, duration: 0.6, ease: "expo.out" },
        0.2
      );
      tl.to(
        svgOutlineR.current,
        { autoAlpha: 1, x: 0, duration: 0.6, ease: "expo.out" },
        0.27
      );
      tl.to(
        svgDots.current,
        { autoAlpha: 1, x: 0, duration: 0.6, ease: "expo.out" },
        0.34
      );
      tl.to(
        svgCheckerd.current,
        { autoAlpha: 1, y: 0, duration: 0.6, ease: "expo.out" },
        0.41
      );
      tl.to(
        svgOutlineL.current,
        { autoAlpha: 1, y: 0, duration: 0.6, ease: "expo.out" },
        0.48
      );
      tl.to(
        svgGridBtmR.current,
        { autoAlpha: 1, y: 0, duration: 0.6, ease: "expo.out" },
        0.55
      );

      // PHASE 4 — Hold so the user can read ────────────────────────────────
      tl.to({}, { duration: 0.7 });

      // PHASE 5 — Everything scatters simultaneously ────────────────────────
      tl.addLabel("scatter");

      // Letters scatter with trailing ghost duplicates
      allLetters.forEach((letter, i) => {
        const dir = letterExits[i % letterExits.length];

        // Three cascading ghost clones trail behind each letter
        for (let d = 1; d <= 3; d++) {
          const ghost = letter.cloneNode(true);
          const sB = sectionRef.current.getBoundingClientRect();
          const lB = letter.getBoundingClientRect();
          ghost.style.cssText = `
            position: absolute;
            left: ${lB.left - sB.left}px;
            top:  ${lB.top - sB.top}px;
            pointer-events: none;
            opacity: 0;
            z-index: 5;
            color: ${
              d % 2 === 0
                ? "var(--color-brightBlue, #60a5fa)"
                : "rgba(255,255,255,0.2)"
            };
          `;
          sectionRef.current.appendChild(ghost);

          tl.to(
            ghost,
            {
              opacity: 0.5 / d,
              x: dir.x * d * 0.3,
              y: dir.y * d * 0.35,
              scale: 1 - d * 0.15,
              duration: 0.4,
              ease: "power2.out",
              onComplete: () => ghost.remove(),
            },
            `scatter+=${i * 0.04 + d * 0.07}`
          );

          tl.to(
            ghost,
            {
              opacity: 0,
              duration: 0.3,
              ease: "power2.in",
            },
            `scatter+=${i * 0.04 + d * 0.07 + 0.35}`
          );
        }

        // Main letter exits
        tl.to(
          letter,
          {
            x: dir.x,
            y: dir.y,
            rotation: dir.rotation,
            opacity: 0,
            scale: 0.6,
            duration: 0.6,
            ease: "power3.in",
          },
          `scatter+=${i * 0.04}`
        );
      });

      // SVGs slide back out in the same direction they came from
      tl.to(
        svgGridTpL.current,
        { autoAlpha: 0, y: -40, duration: 0.4, ease: "power2.in" },
        "scatter"
      );
      tl.to(
        svgOutlineR.current,
        { autoAlpha: 0, x: 40, duration: 0.4, ease: "power2.in" },
        "scatter+=0.04"
      );
      tl.to(
        svgDots.current,
        { autoAlpha: 0, x: 40, duration: 0.4, ease: "power2.in" },
        "scatter+=0.08"
      );
      tl.to(
        svgCheckerd.current,
        { autoAlpha: 0, y: 40, duration: 0.4, ease: "power2.in" },
        "scatter+=0.12"
      );
      tl.to(
        svgOutlineL.current,
        { autoAlpha: 0, y: 40, duration: 0.4, ease: "power2.in" },
        "scatter+=0.16"
      );
      tl.to(
        svgGridBtmR.current,
        { autoAlpha: 0, y: 40, duration: 0.4, ease: "power2.in" },
        "scatter+=0.20"
      );

      // PHASE 6 — Reveal section 2 ─────────────────────────────────────────
      tl.to(
        contentRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "expo.out",
        },
        "scatter+=0.85"
      );
    },
    { scope: sectionRef }
  );
  return (
    <section
      id="about"
      ref={sectionRef}
      className="min-h-[calc(100svh-79px)] flex items-center justify-center px-4 sm:px-6 relative z-10 overflow-hidden bg-inkBlack"
    >
      {/* SECTION 1 — Title page */}
      <div
        ref={titleRef}
        className="aboutMe-titlePg w-full max-w-6xl absolute inset-0 flex flex-col justify-center mx-auto max-w-7xl px-8 sm:px-10 lg:pl-16 lg:pr-8 xl:pl-24 2xl:pl-32"
      >
        <SplitWord
          word="About"
          className="text-8xl sm:text-9xl md:text-[12rem] lg:text-[14rem] xl:text-[16rem] 2xl:text-[18rem] font-extrabold leading-none text-left "
          refCallback={(el, i) => {
            aboutLetters.current[i] = el;
          }}
        />
        <SplitWord
          word="Me"
          className="text-8xl sm:text-9xl md:text-[12rem] lg:text-[14rem] xl:text-[16rem] 2xl:text-[18rem] font-extrabold leading-none text-left text-brightBlue italic"
          style={{ marginLeft: "-0.002em" }}
          refCallback={(el, i) => {
            meLetters.current[i] = el;
          }}
        />
      </div>

      {/* SECTION 2 — Full content */}
      <div
        ref={contentRef}
        className="aboutMe-content w-full h-full flex items-center justify-center mx-auto max-w-7xl px-4 sm:px-6 lg:pl-16 lg:pr-8 xl:pl-24 2xl:pl-32"
        style={{ visibility: "hidden" }}
      >
        <div className="w-full flex flex-col sm:flex-col lg:flex-row items-center justify-center gap-8 md:gap-10 lg:gap-10">
          {/* ILLUSTRATION */}
          <div
            className="aboutMe-illustration flex justify-center items-center relative
                w-full h-[28vh] sm:h-[30vh] md:h-[32vh]
                max-w-[260px] sm:max-w-xs md:max-w-sm
                lg:w-[44%] lg:h-auto lg:max-w-xl
                mx-auto mt-2 mb-8 md:mb-10 lg:mt-0 lg:mb-0 lg:flex-shrink-0"
          >
            <SvgAboutMe className="w-full h-auto object-contain relative z-10" />
          </div>

          {/* TEXT — glass card */}
          <div className="flex-1 w-full lg:max-w-lg xl:max-w-xl">
            <div
              className="relative rounded-2xl overflow-hidden p-4 sm:p-5 md:p-4"
              style={{
                background: "linear-gradient(135deg, rgba(0,37,62,0.65) 0%, rgba(0,17,28,0.75) 100%)",
                border: "1px solid rgba(75,115,255,0.18)",
                backdropFilter: "blur(18px)",
              }}
            >
              {/* Top gradient accent line */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "1px",
                background: "linear-gradient(90deg, transparent 0%, rgba(75,115,255,0.9) 50%, transparent 100%)",
              }} />

              {/* Corner glow */}
              <div style={{
                position: "absolute", top: 0, right: 0,
                width: "140px", height: "140px",
                background: "radial-gradient(circle at 100% 0%, rgba(75,115,255,0.18) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />

              {/* Left accent bar */}
              <div style={{
                position: "absolute", top: "20%", left: 0, bottom: "20%", width: "2px",
                background: "linear-gradient(180deg, transparent 0%, rgba(75,115,255,0.7) 50%, transparent 100%)",
                borderRadius: "1px",
              }} />

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-left">
                About
                <span className="text-brightBlue font-extrabold italic"> Me</span>
              </h1>
              <p className="text-sm sm:text-base md:text-base pt-3 pb-2 text-left text-white/80 leading-relaxed">
                I'm Seun. I studied Creative Tech and am now pursuing a career in
                Frontend Development. My background in design and interactive
                technologies gives me a creative edge in coding, allowing me to
                build engaging, user-focused web applications using JavaScript,
                React, React Native, and C#. I'm passionate about combining design
                and technical skills to create seamless digital experiences.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Background treatment + Decorative SVGs ── */}
      <div className="pointer-events-none absolute inset-0 -z-1 overflow-hidden">

        {/* Drifting grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage:
            "linear-gradient(rgba(75,115,255,0.07) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(75,115,255,0.07) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:       "radial-gradient(ellipse 90% 80% at 35% 50%, black 10%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 35% 50%, black 10%, transparent 72%)",
          animation: "grid-drift 15s linear infinite",
        }} />

        {/* Left */}
        <div
          ref={svgGridTpL}
          className="absolute w-16 h-16 top-[12vh] sm:top-[22vh] md:top-[18vh] lg:top-[4vh] xl:top-[12vh] left-[4vw] sm:left-[1vw] lg:left-[7vw] xl:left-[12vw] 2xl:left-[14vw]"
        >
          <SvgGridSquareTpL className="w-full h-full" />
        </div>
        <div
          ref={svgCheckerd}
          className="absolute w-16 h-16 transform scale-x-[-1] bottom-[8vh] left-[6vw] lg:left-[9vw] xl:left-[11vw] 2xl:left-[13vw]"
        >
          <SvgCheckerdGridTpBtm className="w-full h-full" />
        </div>
        <div
          ref={svgOutlineL}
          className="absolute w-12 h-12 bottom-[18vh] left-[48vw]"
        >
          <SvgOutlineSquare className="w-full h-full" />
        </div>

        {/* Right */}
        <div
          ref={svgOutlineR}
          className="absolute w-16 h-16 top-[1vh] -right-[4vw] md:-right-[2vw] 2xl:-right-[4vw]"
        >
          <SvgOutlineSquare className="w-full h-full" />
        </div>
        <div
          ref={svgDots}
          className="absolute w-16 h-16 bottom-[32vh] -right-[4vw] sm:right-[12vw]"
        >
          <SvgDotsGrid className="w-full h-full" />
        </div>
        <div
          ref={svgGridBtmR}
          className="absolute w-16 h-16 bottom-[2vh] sm:bottom-[6vh] md:bottom-[4vh] lg:bottom-[8vh] right-[2vw]"
        >
          <SvgGridSquareBtmR className="w-full h-full" />
        </div>
      </div>
    </section>
  );
}
