import "./App.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NavBar from "./components/NavBar";
import HeroSection from "./components/HeroSection";
import AboutMeSection from "./components/AboutMeSection";
import MySkillsSection from "./components/MySkillsSection";
import ProjectsSection from "./components/ProjectsSection";
import ContactMeSection from "./components/ContactMeSection";
import SpotlightFollower from "./components/SpotlightFollower";
import ScrollProgress from "./components/ScrollProgress";
import Preloader from "./components/Preloader";

gsap.registerPlugin(ScrollTrigger);

// Mobile browsers resize the viewport when the address/tool bar hides on scroll.
// Without this, ScrollTrigger treats that as a real resize, refreshes, and the
// pinned About/Projects sections jump around. ignoreMobileResize stops that.
ScrollTrigger.config({ ignoreMobileResize: true });

function App() {

  return (
    <>
      {/* Loading page — dismisses on full load, then triggers the hero intro */}
      <Preloader />

      {/* Fixed viewport border frame — desktop only (removed on mobile) */}
      <div
        className="hidden md:block fixed inset-0 pointer-events-none z-[999]"
        style={{ border: "15px solid #00253e" }}
      />

      {/* GitHub icon — top left (desktop only) */}
      <div className="site-rail fixed left-5 top-24 z-40 hidden lg:flex w-6 flex-col items-center gap-3">
        <a
          href="https://github.com/SeunAfa"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/30 hover:text-brightBlue transition-colors duration-200"
          aria-label="GitHub"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>
        <div style={{ width: "1px", height: "40px", background: "rgba(255,255,255,0.2)" }} />
      </div>

      {/* Copyright — bottom left (desktop only) */}
      <div className="site-rail fixed left-5 bottom-10 z-40 hidden lg:flex w-6 flex-col items-center gap-3 select-none pointer-events-none">
        <div className="js-rail-line" style={{ width: "1px", height: "40px", background: "rgba(255,255,255,0.2)" }} />
        <p
          className="text-white/30 font-mono whitespace-nowrap"
          style={{
            fontSize: "11px",
            letterSpacing: "0.15em",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          © 2026 Seun. All rights reserved.
        </p>
      </div>

      <SpotlightFollower />
      <ScrollProgress />
      <NavBar />
      <HeroSection />
      <AboutMeSection />
      <MySkillsSection />
      <ProjectsSection />
      <ContactMeSection />
    </>
  );
}

export default App;
