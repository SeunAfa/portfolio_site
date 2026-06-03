import { useState, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const inputClass =
  "block w-full rounded-md bg-inkDarkLightBlack px-2.5 py-1.5 sm:px-3 sm:py-2 text-white " +
  "border border-white/20 " +
  "placeholder:text-white/25 " +
  "focus:outline-none focus:border-brightBlue " +
  "text-xs sm:text-sm transition-colors";

export default function ContactMeSection() {
  const sectionRef  = useRef(null);
  const headingRef  = useRef(null);
  const subtitleRef = useRef(null);
  const formRef     = useRef(null);
  const [fields, setFields] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });

      tl.from(headingRef.current, {
          y: 40, autoAlpha: 0, duration: 0.75, ease: "expo.out",
        }, 0)
        .from(subtitleRef.current, {
          y: 24, autoAlpha: 0, duration: 0.65, ease: "power2.out",
        }, 0.08)
        .from(formRef.current, {
          y: 40, autoAlpha: 0, duration: 0.75, ease: "power2.out",
        }, 0.18);

      let hasEntered = false;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        onEnter: () => {
          if (hasEntered) return;
          hasEntered = true;
          tl.play(0);
        },
        onLeaveBack: () => {
          hasEntered = false;
          tl.progress(0).pause();
          gsap.set(headingRef.current,  { autoAlpha: 0, y: 40 });
          gsap.set(subtitleRef.current, { autoAlpha: 0, y: 24 });
          gsap.set(formRef.current,     { autoAlpha: 0, y: 40 });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e) =>
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      await emailjs.send(
        SERVICE_ID, TEMPLATE_ID,
        { from_name: fields.name, from_email: fields.email, message: fields.message, to_email: "seunafa55@gmail.com" },
        PUBLIC_KEY
      );
      setStatus("success");
      setFields({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="w-full min-h-[calc(100dvh-79px)] flex items-center justify-center overflow-hidden relative z-10 bg-inkBlack px-4 sm:px-8 py-12 sm:py-16"
    >
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(75,115,255,0.07) 1px, transparent 1px),linear-gradient(90deg, rgba(75,115,255,0.07) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 80% 75% at 50% 50%, black 10%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 75% at 50% 50%, black 10%, transparent 70%)",
          animation: "grid-drift 15s linear infinite",
        }} />
      </div>

      {/* Decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[5vh] left-[5vw] w-8 h-8"
             style={{ borderTop: "1.5px solid rgba(75,115,255,0.45)", borderLeft: "1.5px solid rgba(75,115,255,0.45)" }} />
        <div className="absolute top-[5vh] right-[5vw] w-8 h-8"
             style={{ borderTop: "1.5px solid rgba(75,115,255,0.45)", borderRight: "1.5px solid rgba(75,115,255,0.45)" }} />
        <div className="absolute bottom-[5vh] left-[5vw] w-8 h-8"
             style={{ borderBottom: "1.5px solid rgba(75,115,255,0.45)", borderLeft: "1.5px solid rgba(75,115,255,0.45)" }} />
        <div className="absolute bottom-[5vh] right-[5vw] w-8 h-8"
             style={{ borderBottom: "1.5px solid rgba(75,115,255,0.45)", borderRight: "1.5px solid rgba(75,115,255,0.45)" }} />
        <div className="absolute top-[14vh] right-[8vw] w-20 h-20" style={{
          background: "radial-gradient(circle, rgba(75,115,255,0.25) 1.5px, transparent 1.5px)",
          backgroundSize: "8px 8px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        }} />
        <div className="absolute bottom-[14vh] left-[8vw] w-20 h-20" style={{
          background: "radial-gradient(circle, rgba(75,115,255,0.2) 1.5px, transparent 1.5px)",
          backgroundSize: "8px 8px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        }} />
        <svg className="absolute top-[22vh] left-[10vw]" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <line x1="7" y1="0" x2="7" y2="14" stroke="rgba(75,115,255,0.5)" strokeWidth="1.5"/>
          <line x1="0" y1="7" x2="14" y2="7" stroke="rgba(75,115,255,0.5)" strokeWidth="1.5"/>
        </svg>
        <svg className="absolute bottom-[22vh] right-[10vw]" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <line x1="7" y1="0" x2="7" y2="14" stroke="rgba(75,115,255,0.4)" strokeWidth="1.5"/>
          <line x1="0" y1="7" x2="14" y2="7" stroke="rgba(75,115,255,0.4)" strokeWidth="1.5"/>
        </svg>
        <svg className="absolute top-[40vh] right-[6vw]" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="8" stroke="rgba(75,115,255,0.35)" strokeWidth="1.5"/>
        </svg>
        <svg className="absolute top-[30vh] left-[6vw]" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <line x1="0" y1="18" x2="18" y2="0" stroke="rgba(75,115,255,0.35)" strokeWidth="1.5"/>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg sm:max-w-xl md:max-w-2xl px-6 sm:px-8 md:px-0">

        <h1 ref={headingRef} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-left">
          Contact
          <span className="text-brightBlue font-extrabold italic"> Me</span>
        </h1>

        <p ref={subtitleRef} className="text-sm sm:text-base mt-2 sm:mt-3 text-left text-white/60 leading-relaxed">
          I'm always happy to connect! Discuss opportunities, or just say hello.
        </p>

        <form ref={formRef} onSubmit={handleSubmit} className="mt-4 sm:mt-6 flex flex-col gap-4">

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="name" className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-widest">
                Name
              </label>
              <input
                id="name" name="name" type="text" required
                placeholder="Your name"
                value={fields.name} onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="email" className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-widest">
                Email
              </label>
              <input
                id="email" name="email" type="email" required
                placeholder="you@example.com"
                value={fields.email} onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-widest">
              Message
            </label>
            <textarea
              id="message" name="message" rows={3} required
              placeholder="Your message…"
              value={fields.message} onChange={handleChange}
              className={inputClass + " resize-none"}
            />
          </div>

          {status === "success" && (
            <p className="text-sm text-brightBlue">✓ Message sent! I'll get back to you soon.</p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-400">Something went wrong. Please try again.</p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={status === "sending"}
              className="px-4 py-1.5 sm:px-5 sm:py-2 rounded-md bg-brightBlue text-white text-xs font-semibold hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {status === "sending" ? "Sending…" : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
