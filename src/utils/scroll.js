import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

// Returns the gsap-pin-spacer wrapper if present, otherwise the element itself.
export function getPinSpacer(el) {
  const parent = el.parentElement;
  if (parent?.classList?.contains("gsap-pin-spacer") || parent?.classList?.contains("pin-spacer")) {
    return parent;
  }
  return el;
}

export function smoothScrollTo(href) {
  if (href === "#") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
  const el = document.querySelector(href);
  if (!el) return;

  if (href === "#about" || href === "#projects") {
    const spacer   = getPinSpacer(el);
    const pinStart = spacer.getBoundingClientRect().top + window.scrollY - 79;
    const pinRange = spacer.offsetHeight - el.offsetHeight;
    const pinEnd   = pinStart + pinRange;

    if (href === "#about") {
      const pastAbout = window.scrollY > pinEnd;
      if (pastAbout) {
        window.scrollTo({ top: pinStart + pinRange * 0.67, behavior: "smooth" });
      } else {
        // Jump instantly to pin start so the pin engages, then auto-advance
        // scroll all the way through the intro/scatter to reveal the content.
        // Use GSAP tween with 3.5s duration to let the intro play longer.
        window.scrollTo({ top: pinStart });
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            gsap.to(window, {
              scrollTo: { y: pinStart + pinRange * 0.85 },
              duration: 3.5,
              ease: "none"
            });
          });
        });
      }
    } else {
      const st = ScrollTrigger.getById("projects-unified");
      if (st) {
        // Suppress the section's snap for the duration of this jump so it
        // can't fire a competing tween that pulls the view into the panel
        // and back. Land exactly on the hero-intro snap point (600px into
        // the pin) and let the scrub fade the hero in naturally.
        window.__suppressProjectsSnap = true;
        window.scrollTo({ top: st.start + 1100, behavior: "smooth" });
        clearTimeout(window.__projectsSnapTimer);
        window.__projectsSnapTimer = setTimeout(() => {
          window.__suppressProjectsSnap = false;
        }, 1200);
      } else {
        window.scrollTo({ top: pinStart + 1100, behavior: "smooth" });
      }
    }
  } else {
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 79, behavior: "smooth" });
  }
}
