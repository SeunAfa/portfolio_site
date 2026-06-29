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
      // Land exactly on the hero-intro snap point (HERO_SCROLL_DISTANCE = 1100px
      // into the pin) so the section opens on its intro — never a project panel.
      const target = (st ? st.start : pinStart) + 1100;
      // Keep the section's snap suppressed for the WHOLE scroll. The old fixed
      // 1200ms timer was racey on mobile: native smooth-scroll there often runs
      // longer than the timeout, so the snap re-engaged mid-flight and yanked the
      // view onto the first/last project. Driving the scroll with a GSAP tween and
      // lifting suppression in onComplete makes the suppression window cover
      // exactly the scroll, regardless of distance or device.
      window.__suppressProjectsSnap = true;
      clearTimeout(window.__projectsSnapTimer);
      gsap.to(window, {
        scrollTo: { y: target, autoKill: false },
        duration: 1.2,
        ease: "power2.out",
        onComplete: () => {
          window.__projectsSnapTimer = setTimeout(() => {
            window.__suppressProjectsSnap = false;
          }, 100);
        },
      });
    }
  } else {
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 79, behavior: "smooth" });
  }
}
