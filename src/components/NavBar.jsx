import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "../assets/Logo.png";
import { smoothScrollTo } from "../utils/scroll";

const NAV_LINKS = [
  { label: "Home",     href: "#"         },
  { label: "About",    href: "#about"    },
  { label: "Skills",   href: "#skills"   },
  { label: "Projects", href: "#projects" },
  { label: "Contact",  href: "#contact"  },
];

export default function NavBar() {
  const [active, setActive]         = useState("Home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered]       = useState(null);

  useEffect(() => {
    const ids = ["about", "skills", "projects", "contact"];
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          const match = NAV_LINKS.find((l) => l.href === `#${e.target.id}`);
          if (match) setActive(match.label);
        }
      }),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });

    const onScroll = () => {
      if (window.scrollY < 100) setActive("Home");
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="px-5 lg:px-12" style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "79px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: "15px",
        paddingBottom: 0,
        zIndex: 50,
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        backgroundColor: "#00111c",
      }}>
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); smoothScrollTo("#"); setActive("Home"); }}
          style={{ display: "flex", alignItems: "center", alignSelf: "center", gap: "8px", textDecoration: "none" }}
          className="group"
        >
          <img src={Logo} alt="logo" style={{ width: "24px", height: "24px", objectFit: "contain", display: "block" }} />
          <span style={{ color: "white", fontWeight: "700", fontSize: "1.25rem", letterSpacing: "0.05em", lineHeight: 1, display: "block" }}
                className="group-hover:text-brightBlue transition-colors duration-200">
            Seun
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden lg:flex" style={{ alignItems: "center", alignSelf: "center", gap: "2rem" }}>
          {NAV_LINKS.map(({ label, href }) => {
            const isActive  = active === label;
            const isHovered = hovered === label;
            return (
              <a
                key={label}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollTo(href); setActive(label);
                }}
                onMouseEnter={() => setHovered(label)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  position: "relative",
                  paddingBottom: "4px",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: isActive ? "#4b73ff" : "rgba(255,255,255,0.8)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                  cursor: "pointer",
                }}
              >
                {label}
                <span style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "2px",
                  background: isActive ? "#4b73ff" : "rgba(255,255,255,0.8)",
                  borderRadius: "1px",
                  transform: (isActive || isHovered) ? "scaleX(1)" : "scaleX(0)",
                  transformOrigin: "left center",
                  transition: "transform 0.3s ease",
                }} />
              </a>
            );
          })}
        </div>

        {/* Mobile hamburger — inside the nav so flex aligns it with the logo */}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="lg:hidden"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "none", border: "none",
            color: "rgba(255,255,255,0.7)", cursor: "pointer", padding: 0,
          }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <XMarkIcon style={{ width: "26px", height: "26px" }} /> : <Bars3Icon style={{ width: "26px", height: "26px" }} />}
        </button>
      </nav>

      {/* ── Mobile backdrop ──────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 55, background: "rgba(0,17,28,0.8)", backdropFilter: "blur(4px)" }}
          className="lg:hidden"
        />
      )}

      {/* ── Mobile sidebar ───────────────────────────────────────────────── */}
      <div
        className="lg:hidden"
        style={{
          position: "fixed", top: 0, left: 0, bottom: 0,
          zIndex: 56,
          width: "72%", maxWidth: "320px",
          background: "#00111c",
          borderRight: "1px solid rgba(255,255,255,0.1)",
          padding: "24px",
          display: "flex", flexDirection: "column",
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "40px" }}>
          <img src={Logo} alt="Logo" style={{ width: "24px", height: "24px" }} />
          <span style={{ color: "white", fontWeight: "700", fontSize: "1.25rem" }}>Seun</span>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {[...NAV_LINKS, { label: "My GitHub", href: "https://github.com/SeunAfa", external: true }].map(({ label, href, external }) => (
            <a
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              onClick={(e) => {
                if (!external) { e.preventDefault(); smoothScrollTo(href); }
                setActive(label);
                setMobileOpen(false);
              }}
              style={{
                padding: "10px 12px",
                borderRadius: "4px",
                fontSize: "0.875rem",
                fontWeight: "500",
                textDecoration: "none",
                color: active === label ? "#4b73ff" : "rgba(255,255,255,0.7)",
                background: active === label ? "rgba(75,115,255,0.1)" : "transparent",
                transition: "all 0.2s",
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Copyright — pinned to bottom of sidebar */}
        <div style={{ marginTop: "auto", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "monospace", letterSpacing: "0.05em" }}>
            © 2026 Seun. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
