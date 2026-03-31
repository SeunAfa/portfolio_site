import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SvgDotsGrid from "./SvgDotsGrid";
import SvgGridSquareBtmR from "./SvgGridSquareBtmR";
import SvgCheckerdGridTpBtm from "./SvgCheckerdGridTpBtm";
import SvgGridSquareTpL from "./SvgGridSquareTpL";
import SvgOutlineSquare from "./SvgOutlineSquare";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    bg: "#00111c",
    accent: "#4B73FF",
    label: "00",
    title: "Project Zero",
    isProject: false,
  },
  {
    id: 2,
    bg: "#002137",
    accent: "#4B73FF",
    label: "01",
    title: "Real Estate Landing Page",
    description:
      "A responsive landing page designed for a real estate business, showcasing property listings with intuitive navigation and interactive elements. Built with a focus on clean design, accessibility, and smooth user experience.",
    isProject: true,
    tags: ["React", "CSS3", "Responsive Design", "UX/UI"],
  },
  {
    id: 3,
    bg: "#00406c",
    accent: "#4B73FF",
    label: "02",
    title: "CRM / Facility Management Platform",
    description:
      "A micro CRM platform built to manage facility workflows, featuring dashboards, CRUD functionality, and reusable components. Focused on clear UX and scalable frontend structure using React and state management.",
    isProject: true,
    tags: ["React", "JavaScript", "UX Design", "State Management"],
  },
  {
    id: 4,
    bg: "#001a2c",
    accent: "#4B73FF",
    label: "03",
    title: "Metadata Dashboard",
    description:
      "An interactive metadata dashboard for visualizing and filtering data sets, prioritizing usability and data clarity. Built with React and charting libraries to demonstrate responsive design and dynamic interactions.",
    isProject: true,
    tags: ["React", "JavaScript", "Data Visualization", "Responsive Design"],
  },
];

// Pixels of scroll dedicated to the hero fade-in before horizontal pan begins
const HERO_SCROLL_DISTANCE = 600;

export default function ProjectsSection() {
  const sectionRef = useRef(null);
  const wrapperRef = useRef(null);

  // Hero refs
  const heroTitleRef = useRef(null);
  const heroDescRef = useRef(null);
  const heroSvgsRef = useRef(null);

  // Decorative SVG refs
  const SvgGridSqTpL = useRef(null);
  const SvgOutlineSq2 = useRef(null);
  const SvgCheckerd = useRef(null);
  const SvgGridSqBtmR = useRef(null);
  const SvgDots = useRef(null);
  const SvgOutlineSq = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const wrapper = wrapperRef.current;
      const panels = wrapper.children;

      const navbar = document.querySelector("nav");
      const navHeight = navbar ? navbar.getBoundingClientRect().height : 64;
      const pinStart = `top ${navHeight}px`;

      // ── Initial states ─────────────────────────────────────────────────────

      // Hero: title, desc, and SVGs all start invisible + shifted down
      gsap.set(
        [heroTitleRef.current, heroDescRef.current, heroSvgsRef.current],
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
      masterTl.to(
        [heroTitleRef.current, heroDescRef.current, heroSvgsRef.current],
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          duration: heroWeight * 0.8,
          stagger: 0.04,
        },
        0
      );

      // Phase 2 — horizontal pan
      masterTl.to(
        wrapper,
        { x: getScrollAmount, ease: "none", duration: panWeight },
        heroWeight
      );

      // ── Snap points ────────────────────────────────────────────────────────
      // Index 0 = scroll start (pre-fade)
      // Index 1 = hero fully faded in
      // Index 2,3,4 = project panels 1,2,3
      const snapPoints = [
        0,
        heroWeight,
        heroWeight + 1 * panelWeight,
        heroWeight + 2 * panelWeight,
        heroWeight + 3 * panelWeight, // = 1.0, end
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
        scrub: 2,
        anticipatePin: 1,
        animation: masterTl,
        invalidateOnRefresh: true,
        // onUpdate fires every scroll tick — catches panels skipped by fast scrolling
        onUpdate: (self) => {
          resolveActivePanel(self.animation.progress());
        },
        snap: {
          snapTo: (value) => {
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
      ref={sectionRef}
      className="w-full h-[calc(100dvh-4rem)] overflow-hidden "
    >
      <div
        ref={wrapperRef}
        className="flex flex-row will-change-transform"
        style={{ width: `${projects.length * 100}vw` }}
      >
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex-shrink-0 w-screen h-[calc(100dvh-4rem)] flex items-center justify-center relative"
            // style={{ backgroundColor: project.bg }}
          >
            {project.isProject ? (
              <div
                className="projectContent-container w-full h-full flex flex-col sm:flex-col md:flex-col lg:flex-row"
                // style={{ border: "2px solid red" }}
              >
                <span className="absolute top-4 left-4 font-display text-[10px] sm:text-xs tracking-[0.3em] text-muted-foreground/60 bg-inkDarkLightBlack backdrop-blur-sm px-3 py-1.5 rounded-sm z-20">
                  {project.label}
                </span>

                {/* IMAGE HALF — overflow-hidden clips the slide-up -- bg-inkLightBlack */}
                <div className="project-imgPlaceholder flex-1 min-h-0 flex justify-center items-center p-4 overflow-hidden bg-inkLightBlack">
                  <div className="js-project-img project-imgContent bg-white aspect-square h-full max-h-[85%]" />
                </div>

                {/* INFO HALF — overflow-hidden clips the slide-down -- bg-inkDarkLightBlack */}
                <div className="project-info flex-1 min-h-0 lg:flex justify-center items-center px-6 sm:px-8 md:px-10 py-6 md:py-8 overflow-hidden">
                  <div className="js-project-info mb-auto mt-auto">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-left">
                      {project.title}
                    </h1>

                    <p className="text-sm sm:text-base md:text-lg text-left mt-2 md:mt-4 leading-relaxed">
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

                    <div className="flex items-center gap-6 mt-6">
                      {/* links unchanged */}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* ── Hero panel ──               bg-deepSpaceBlue
               */
              <div
                className="projectHero relative w-full h-full flex flex-col justify-center overflow-hidden z-10 bg-gradient-to-b from-[inkBlack] via-deepSpaceBlue to-[inkBlack]
              "
              >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  {/* GSAP sets opacity:0 y:24 on mount — do NOT add opacity CSS here */}
                  <h1
                    ref={heroTitleRef}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold max-w-xl text-left"
                  >
                    My
                    <span className="text-brightBlue font-extrabold italic">
                      {" "}
                      Projects
                    </span>
                  </h1>

                  <p
                    ref={heroDescRef}
                    className="text-base sm:text-lg md:text-xl mt-3 max-w-xl leading-relaxed text-left"
                  >
                    A range of frontend projects focused on responsive design,
                    dynamic interactions, and intuitive user experiences. Each
                    project reflects my approach to combining clean,
                    maintainable code with thoughtful design decisions.
                  </p>
                </div>

                {/* SVG decorations — GSAP sets opacity:0 y:24 on mount */}
                <div
                  ref={heroSvgsRef}
                  className="pointer-events-none absolute inset-0 -z-1 overflow-hidden"
                >
                  <div
                    ref={SvgGridSqTpL}
                    className="absolute w-16 h-16 top-[10vh] sm:top-[10vh] md:top-[14vh] lg:top-[14vh] xl:top-[12vh] left-[4vw] sm:left-[1vw] lg:left-[4vw] xl:left-[12vw]"
                  >
                    <SvgGridSquareTpL className="w-full h-full" />
                  </div>
                  <div
                    ref={SvgOutlineSq2}
                    className="absolute w-12 h-12 top-[20vh] sm:top-[23vh] md:top-[26vh] lg:top-[25vh] left-[30vw] md:left-[20vw]"
                  >
                    <SvgOutlineSquare className="w-full h-full" />
                  </div>
                  <div
                    ref={SvgCheckerd}
                    className="absolute w-16 h-16 transform scale-x-[-1] bottom-[2vh] left-[2vw]"
                  >
                    <SvgCheckerdGridTpBtm className="w-full h-full" />
                  </div>
                  <div
                    ref={SvgGridSqBtmR}
                    className="absolute w-16 h-16 top-[2vh] md:top-[5vh] lg:top-[2vh] right-[2vw]"
                  >
                    <SvgGridSquareBtmR className="w-full h-full" />
                  </div>
                  <div
                    ref={SvgDots}
                    className="absolute w-16 h-16 bottom-[14vh] sm:bottom-[26vh] md:bottom-[28vh] lg:bottom-[32vh] -right-[4vw] sm:-right-[6vw] md:right-[2vw]"
                  >
                    <SvgDotsGrid className="w-full h-full" />
                  </div>
                  <div
                    ref={SvgOutlineSq}
                    className="absolute w-12 h-12 bottom-[18vh] left-[48vw]"
                  >
                    <SvgOutlineSquare className="w-full h-full" />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
