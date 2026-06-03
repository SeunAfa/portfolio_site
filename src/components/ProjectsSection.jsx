import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    isProject: false,
  },
  {
    id: 2,
    label: "01",
    title: "NexaHub — Maintenance CRM",
    description:
      "Front-end maintenance CRM with three surfaces (agent helpdesk, customer portal, public case tracker), a case-to-work-order lifecycle, AI-assisted intake, live phone-call simulation, and templated status emails. Designed for real helpdesk workflows — from first call through to engineer assignment, parts delays, and customer-facing status updates.",
    isProject: true,
    tags: ["React", "JavaScript", "Tailwind CSS", "Vite", "React Router", "Headless UI", "Recharts", "Context API", "Responsive Design"],
    link: "https://seunafa.github.io/maintenance_crm_app/",
  },
];

// Pixels of scroll dedicated to the hero fade-in before horizontal pan begins
const HERO_SCROLL_DISTANCE = 600;

export default function ProjectsSection() {
  const sectionRef = useRef(null);
  const wrapperRef = useRef(null);

  // Hero refs
  const heroTitleRef        = useRef(null);
  const heroDescRef         = useRef(null);
  const heroSvgsRef         = useRef(null);
  const heroOpenBracketRef  = useRef(null);
  const heroCloseBracketRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const wrapper = wrapperRef.current;
      const panels = wrapper.children;

      const navbar = document.querySelector("nav");
      const navHeight = navbar ? navbar.getBoundingClientRect().height : 64;
      const pinStart = `top ${navHeight}px`;

      // ── Initial states ─────────────────────────────────────────────────────

      // Hero: title, desc, SVGs and bracket icons all start invisible + shifted down
      gsap.set(
        [heroTitleRef.current, heroDescRef.current, heroSvgsRef.current,
         heroOpenBracketRef.current, heroCloseBracketRef.current],
        { opacity: 0, y: 24 }
      );

      // Project panels: image slides up from below, info slides down from above
      const projectImgs = wrapper.querySelectorAll(".js-project-img");
      const projectInfos = wrapper.querySelectorAll(".js-project-info");
      gsap.set(projectImgs, { opacity: 0, y: 50 });
      gsap.set(projectInfos, { opacity: 0, y: -50 });

      // ── Timeline weights ───────────────────────────────────────────────────

      const getScrollAmount = () =>
        -(panels[0].getBoundingClientRect().width * (panels.length - 1));

      const totalScrollLength = () =>
        HERO_SCROLL_DISTANCE + Math.abs(getScrollAmount());

      const heroWeight = HERO_SCROLL_DISTANCE / totalScrollLength();
      const panWeight = 1 - heroWeight;
      // Each project panel gets an equal slice of the pan portion
      const panelWeight = panWeight / (projects.length - 1);

      // ── Master timeline (scrub only — no entry animations here) ───────────

      const masterTl = gsap.timeline();

      // Phase 1 — hero fade
      // No stagger: fixed stagger values extend past heroWeight on wider screens,
      // leaving SVGs mid-animation when the snap point is reached.
      // All three elements animate together and finish at heroWeight * 0.85.
      masterTl.to(
        [heroTitleRef.current, heroDescRef.current, heroSvgsRef.current,
         heroOpenBracketRef.current, heroCloseBracketRef.current],
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          duration: heroWeight * 0.85,
          stagger: 0,
        },
        0
      );

      // Phase 2 — horizontal pan
      masterTl.to(
        wrapper,
        { x: getScrollAmount, ease: "none", duration: panWeight },
        heroWeight
      );

      // ── Snap points (dynamic — works for any number of project panels) ───────
      const numProjectPanels = projects.filter(p => p.isProject).length;
      const snapPoints = [
        0,
        heroWeight,
        ...Array.from({ length: numProjectPanels }, (_, i) =>
          heroWeight + (i + 1) * panelWeight
        ),
      ];

      // ── Entry / exit runners (free-running, not scrubbed) ─────────────────

      const runPanelEntry = (imgIndex) => {
        const img = projectImgs[imgIndex];
        const info = projectInfos[imgIndex];
        if (!img || !info) return;
        gsap.killTweensOf([img, info]);
        gsap.to(img, { opacity: 1, y: 0, ease: "power3.out", duration: 0.6 });
        gsap.to(info, { opacity: 1, y: 0, ease: "power3.out", duration: 0.6 });
      };

      const runPanelExit = (imgIndex) => {
        const img = projectImgs[imgIndex];
        const info = projectInfos[imgIndex];
        if (!img || !info) return;
        gsap.killTweensOf([img, info]);
        gsap.to(img, { opacity: 0, y: 50, ease: "power2.in", duration: 0.35 });
        gsap.to(info, {
          opacity: 0,
          y: -50,
          ease: "power2.in",
          duration: 0.35,
        });
      };

      // Track the last active panel so we don't spam tweens on every scroll tick
      let lastActiveImgIndex = -1;

      const resolveActivePanel = (progress) => {
        // Find closest snap index to current progress
        const snapIndex = snapPoints.reduce(
          (best, point, i) =>
            Math.abs(point - progress) < Math.abs(snapPoints[best] - progress)
              ? i
              : best,
          0
        );
        // snapIndex 2,3,4 = project panels 0,1,2
        const activeImgIndex = snapIndex - 2;

        if (activeImgIndex === lastActiveImgIndex) return; // nothing changed
        lastActiveImgIndex = activeImgIndex;

        projectImgs.forEach((_, i) => {
          if (i === activeImgIndex) {
            runPanelEntry(i);
          } else {
            runPanelExit(i);
          }
        });
      };

      // ── Single ScrollTrigger ───────────────────────────────────────────────
      ScrollTrigger.create({
        trigger: section,
        start: pinStart,
        end: () => `+=${totalScrollLength()}`,
        pin: true,
        // scrub:1 keeps the horizontal pan tracking close to the scroll position.
        // (Was 2 — the heavier lag meant that on reverse-scroll the pan trailed
        // far behind, so the onLeaveBack progress(0) reset showed as a visible
        // jerk when going back into / past Projects.)
        scrub: 1,
        anticipatePin: 1,
        // NOTE: fastScrollEnd was removed. It released the pin early whenever
        // scroll velocity was high (a normal mobile flick, or the fast smooth-
        // scroll from a nav click), which skipped the project panel entirely and
        // dumped the user into Contact. Without it the pin holds and the snap
        // lands on a panel instead.
        animation: masterTl,
        invalidateOnRefresh: true,
        // onLeave / onLeaveBack — force animation to its boundary so the scrub
        // lag never shows after the pin releases.
        onLeave: () => {
          masterTl.progress(1);
        },
        onLeaveBack: () => {
          masterTl.progress(0);
          lastActiveImgIndex = -1;
        },
        // onUpdate fires every scroll tick — catches panels skipped by fast scrolling
        onUpdate: (self) => {
          resolveActivePanel(self.animation.progress());
        },
        // While Projects is pinned the panels pan horizontally across the fixed
        // GitHub/copyright rail — fade the rail out so it never overlaps content.
        onToggle: (self) => {
          document.querySelectorAll(".site-rail").forEach((el) => {
            el.style.opacity = self.isActive ? "0" : "1";
            el.style.pointerEvents = self.isActive ? "none" : "";
          });
        },
        snap: {
          snapTo: (value) => {
            // While a nav-bar jump is in flight, don't snap — returning the
            // current value is a no-op, so the programmatic scroll lands on
            // the intro without the snap dragging it into the panel and back.
            if (window.__suppressProjectsSnap) return value;
            // At or past the last snap point the user is exiting — don't re-anchor
            if (value >= snapPoints[snapPoints.length - 1]) return value;
            // Before the first snap point the user is leaving back — don't re-anchor
            if (value <= snapPoints[0]) return value;
            let closest = snapPoints[0];
            let minDist = Math.abs(value - closest);
            for (const point of snapPoints) {
              const dist = Math.abs(value - point);
              if (dist < minDist) {
                minDist = dist;
                closest = point;
              }
            }
            return closest;
          },
          duration: { min: 0.8, max: 1.4 },
          delay: 0.15,
          ease: "power1.out",
          // onComplete re-resolves after snap settles to guarantee final state
          onComplete: () => {
            const st = ScrollTrigger.getById("projects-unified");
            if (!st) return;
            // Reset lastActiveImgIndex so onComplete always re-fires entry
            lastActiveImgIndex = -1;
            resolveActivePanel(st.animation.progress());
          },
        },
        id: "projects-unified",
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative z-[20] w-full h-[calc(100svh-79px)] overflow-hidden bg-inkBlack"
    >
      <div
        ref={wrapperRef}
        className="flex flex-row will-change-transform"
        style={{ width: `${projects.length * 100}vw` }}
      >
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex-shrink-0 w-screen h-[calc(100svh-79px)] flex items-center justify-center relative bg-inkBlack"
            // style={{ backgroundColor: project.bg }}
          >
            {project.isProject && (
              <span className="absolute top-4 right-12 font-display text-[10px] sm:text-xs tracking-[0.3em] text-muted-foreground/60 bg-inkLightBlack backdrop-blur-sm px-3 py-1.5 rounded-sm z-20">
                {project.label}
              </span>
            )}
            {project.isProject ? (
              <div
                className="projectContent-container w-full h-full flex flex-col justify-center lg:justify-start lg:flex-row"
                // style={{ border: "2px solid red" }}
              >

                {/* IMAGE HALF — overflow-hidden clips the slide-up */}
                <div className="project-imgPlaceholder flex-none lg:flex-1 lg:min-h-0 flex justify-center items-center overflow-hidden bg-inkLightBlack px-8 py-4 lg:py-6 lg:pr-5 lg:pl-[68px]">
                  {/* Screen mockup — js-project-img kept for GSAP targeting */}
                  <div className="js-project-img project-imgContent relative flex items-center justify-center w-full h-full">
                    <div
                      className="relative select-none max-w-[78%] sm:max-w-[60%] lg:max-w-full mx-auto"
                      style={{
                        // Fill the column width, but never let the 16/9 frame grow
                        // taller than the section's available height (which would be
                        // clipped on short viewports). Cap width by height * 16/9.
                        // (On mobile the max-w above also keeps the video compact so
                        // the info below it has room within the fixed-height panel.)
                        width: "min(100%, calc((100svh - 150px) * 16 / 9))",
                        filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.75))",
                      }}
                    >
                      {/* Bezel */}
                      <div style={{
                        background: "#18181b",
                        border: "2px solid #3f3f46",
                        borderRadius: 10,
                        padding: "8px",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                        position: "relative",
                      }}>
                        {/* Screen */}
                        <div style={{
                          borderRadius: 6,
                          overflow: "hidden",
                          aspectRatio: "16/9",
                          background: "#000",
                        }}>
                          <iframe
                            src="https://www.youtube.com/embed/vAUKPq1KS8E?autoplay=1&mute=1&loop=1&playlist=vAUKPq1KS8E&controls=0&modestbranding=1&rel=0&playsinline=1"
                            title={project.title}
                            style={{ width: "100%", height: "100%", border: 0, display: "block" }}
                            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                            allowFullScreen
                          />
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* INFO HALF — overflow-hidden clips the slide-down -- bg-inkDarkLightBlack */}
                <div className="project-info flex-none lg:flex-1 lg:min-h-0 flex flex-col justify-center px-6 sm:px-8 md:px-10 py-2 md:py-8 overflow-hidden">
                  <div className="js-project-info">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-left">
                      {project.title}
                    </h1>

                    <p className="text-sm sm:text-base md:text-lg text-left mt-2 md:mt-4 leading-relaxed max-w-prose">
                      {project.description}
                    </p>

                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4 md:mt-6">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-full bg-brightBlue px-2 py-1 text-xs font-medium text-white"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 mt-6">
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-md bg-brightBlue text-white text-xs font-semibold opacity-40 hover:opacity-100 transition-opacity duration-75"
                        >
                          Visit Site
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* ── Hero panel ── */
              <div className="projectHero relative w-full h-full flex flex-col justify-center items-center overflow-hidden z-10 bg-inkBlack">

                {/* Permanent background grid */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
                  <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: "linear-gradient(rgba(75,115,255,0.07) 1px, transparent 1px),linear-gradient(90deg, rgba(75,115,255,0.07) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                    maskImage: "radial-gradient(ellipse 80% 75% at 50% 50%, black 10%, transparent 70%)",
                    WebkitMaskImage: "radial-gradient(ellipse 80% 75% at 50% 50%, black 10%, transparent 70%)",
                    animation: "grid-drift 15s linear infinite",
                  }} />
                </div>

                <div className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl px-6 sm:px-8 relative" style={{ zIndex: 10 }}>
                  {/* <> tag top-left of content box */}
                  <svg ref={heroOpenBracketRef} className="absolute -top-5 left-4 sm:left-6 lg:left-8 select-none" width="44" height="16" viewBox="0 0 44 16" fill="none">
                    <text x="0" y="13" fontFamily="monospace" fontSize="13" fill="rgba(75,115,255,0.4)">&lt;&gt;</text>
                  </svg>
                  {/* </> tag bottom-right of content box */}
                  <svg ref={heroCloseBracketRef} className="absolute -bottom-5 right-4 sm:right-6 lg:right-8 select-none" width="56" height="16" viewBox="0 0 56 16" fill="none">
                    <text x="0" y="13" fontFamily="monospace" fontSize="13" fill="rgba(75,115,255,0.4)">&lt;/&gt;</text>
                  </svg>

                  {/* GSAP sets opacity:0 y:24 on mount — do NOT add opacity CSS here */}
                  <h1
                    ref={heroTitleRef}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-left"
                  >
                    My
                    <span className="text-brightBlue font-extrabold italic">
                      {" "}
                      Projects
                    </span>
                  </h1>

                  <p
                    ref={heroDescRef}
                    className="text-base sm:text-lg md:text-xl mt-4 text-left"
                    style={{ lineHeight: "2", letterSpacing: "0.01em" }}
                  >
                    A range of frontend projects focused on responsive design,
                    dynamic interactions, and intuitive user experiences. Each
                    project reflects my approach to combining clean,
                    maintainable code with thoughtful design decisions.
                  </p>
                </div>

                {/* Animated decorations — GSAP sets opacity:0 y:24 on mount */}
                <div
                  ref={heroSvgsRef}
                  className="pointer-events-none absolute inset-0 overflow-hidden"
                  style={{ zIndex: 1 }}
                >
                  {/* Corner brackets */}
                  <div className="absolute top-[5vh] left-[5vw] w-8 h-8"
                       style={{ borderTop: "1.5px solid rgba(75,115,255,0.45)", borderLeft: "1.5px solid rgba(75,115,255,0.45)" }} />
                  <div className="absolute top-[5vh] right-[5vw] w-8 h-8"
                       style={{ borderTop: "1.5px solid rgba(75,115,255,0.45)", borderRight: "1.5px solid rgba(75,115,255,0.45)" }} />
                  <div className="absolute bottom-[5vh] left-[5vw] w-8 h-8"
                       style={{ borderBottom: "1.5px solid rgba(75,115,255,0.45)", borderLeft: "1.5px solid rgba(75,115,255,0.45)" }} />
                  <div className="absolute bottom-[5vh] right-[5vw] w-8 h-8"
                       style={{ borderBottom: "1.5px solid rgba(75,115,255,0.45)", borderRight: "1.5px solid rgba(75,115,255,0.45)" }} />

                  {/* Dot cluster — bottom-right area */}
                  <div className="absolute bottom-[12vh] right-[8vw] w-20 h-20" style={{
                    background: "radial-gradient(circle, rgba(75,115,255,0.25) 1.5px, transparent 1.5px)",
                    backgroundSize: "8px 8px",
                    maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
                    WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
                  }} />

                  {/* Dot cluster — top-right mid */}
                  <div className="absolute top-[18vh] right-[18vw] w-16 h-16" style={{
                    background: "radial-gradient(circle, rgba(75,115,255,0.2) 1.5px, transparent 1.5px)",
                    backgroundSize: "8px 8px",
                    maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
                    WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
                  }} />

                  {/* Plus sign — top-right */}
                  <svg className="absolute top-[22vh] right-[6vw]" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <line x1="7" y1="0" x2="7" y2="14" stroke="rgba(75,115,255,0.5)" strokeWidth="1.5"/>
                    <line x1="0" y1="7" x2="14" y2="7" stroke="rgba(75,115,255,0.5)" strokeWidth="1.5"/>
                  </svg>

                  {/* Plus sign — bottom-left */}
                  <svg className="absolute bottom-[20vh] left-[12vw]" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <line x1="7" y1="0" x2="7" y2="14" stroke="rgba(75,115,255,0.4)" strokeWidth="1.5"/>
                    <line x1="0" y1="7" x2="14" y2="7" stroke="rgba(75,115,255,0.4)" strokeWidth="1.5"/>
                  </svg>

                  {/* Ring — mid-right */}
                  <svg className="absolute top-[42vh] right-[12vw]" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="rgba(75,115,255,0.35)" strokeWidth="1.5"/>
                  </svg>

                  {/* Diagonal slash — bottom-left area */}
                  <svg className="absolute bottom-[8vh] left-[22vw]" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <line x1="0" y1="18" x2="18" y2="0" stroke="rgba(75,115,255,0.35)" strokeWidth="1.5"/>
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
