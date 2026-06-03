import { useEffect, useState } from "react";

/**
 * Horizontal progress line below the navbar + thin vertical scrollbar
 * on the right side (positioned inside the decorative frame border).
 */
export default function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      setPct((scrollTop / (scrollHeight - clientHeight)) * 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Horizontal bar below navbar */}
      <div
        className="fixed top-[79px] left-0 h-[2px] z-[51] pointer-events-none"
        style={{
          width: `${pct}%`,
          background: "#4b73ff",
          boxShadow: "0 0 8px rgba(75,115,255,0.5)",
        }}
      />

      {/* Vertical scrollbar track — inside the right frame border */}
      <div
        className="fixed right-[6px] z-[998] pointer-events-none"
        style={{
          top: "24px",
          bottom: "24px",
          width: "2px",
          background: "rgba(255,255,255,0.06)",
          borderRadius: "999px",
        }}
      >
        <div
          style={{
            height: `${pct}%`,
            background: "rgba(75,115,255,0.55)",
            borderRadius: "999px",
            transition: "height 80ms linear",
          }}
        />
      </div>
    </>
  );
}
