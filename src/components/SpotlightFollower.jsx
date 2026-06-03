import { useEffect, useRef } from "react";

/**
 * Page-wide mouse spotlight — a large, soft radial gradient that
 * follows the cursor across every section (Brittany Chiang style).
 * pointer-events: none so it never blocks interactions.
 */
export default function SpotlightFollower() {
  const spotRef = useRef(null);
  const target  = useRef({ x: -800, y: -800 });
  const current = useRef({ x: -800, y: -800 });
  const rafRef  = useRef(null);

  useEffect(() => {
    const spot = spotRef.current;

    const onMove = ({ clientX: x, clientY: y }) => {
      target.current = { x, y };
    };

    const tick = () => {
      const t = target.current, c = current.current;
      c.x += (t.x - c.x) * 0.18;
      c.y += (t.y - c.y) * 0.18;
      spot.style.left = `${c.x}px`;
      spot.style.top  = `${c.y}px`;
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={spotRef}
      className="pointer-events-none fixed z-[35] rounded-full"
      style={{
        width: "900px",
        height: "900px",
        transform: "translate(-50%, -50%)",
        background:
          "radial-gradient(circle, rgba(75,115,255,0.07) 0%, rgba(0,64,108,0.16) 30%, transparent 65%)",
        willChange: "left, top",
      }}
    />
  );
}
