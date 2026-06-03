import { useEffect, useRef } from "react";

/**
 * Custom cursor — a sharp dot that snaps to the mouse instantly,
 * and a larger ring that lerps behind it with a slight delay.
 * Both expand + brighten when hovering interactive elements.
 */
export default function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const rafRef  = useRef(null);
  const mouse   = useRef({ x: -200, y: -200 });
  const ring    = useRef({ x: -200, y: -200 });

  useEffect(() => {
    const dot     = dotRef.current;
    const ringEl  = ringRef.current;

    /* ── Instant dot tracking ── */
    const onMove = ({ clientX: x, clientY: y }) => {
      mouse.current = { x, y };
      dot.style.transform = `translate(${x}px, ${y}px)`;
    };

    /* ── Ring lerp loop ── */
    const tick = () => {
      const r = ring.current, m = mouse.current;
      r.x += (m.x - r.x) * 0.12;
      r.y += (m.y - r.y) * 0.12;
      ringEl.style.transform = `translate(${r.x}px, ${r.y}px)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    /* ── Hover state via delegation (no MutationObserver needed) ── */
    const isInteractive = (el) =>
      el.closest("a, button, [role='button'], label, input, textarea, select");

    const onOver = (e) => {
      if (!isInteractive(e.target)) return;
      dot.dataset.hover  = "1";
      ringEl.dataset.hover = "1";
    };
    const onOut = (e) => {
      if (!isInteractive(e.target)) return;
      delete dot.dataset.hover;
      delete ringEl.dataset.hover;
    };

    /* ── Hide when cursor leaves the window ── */
    const hide = () => { dot.style.opacity = "0"; ringEl.style.opacity = "0"; };
    const show = () => { dot.style.opacity = "1"; ringEl.style.opacity = "1"; };

    document.addEventListener("mousemove",  onMove);
    document.addEventListener("mouseover",  onOver,  true);
    document.addEventListener("mouseout",   onOut,   true);
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove",  onMove);
      document.removeEventListener("mouseover",  onOver,  true);
      document.removeEventListener("mouseout",   onOut,   true);
      document.removeEventListener("mouseleave", hide);
      document.removeEventListener("mouseenter", show);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
