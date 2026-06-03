import { useEffect, useRef } from "react";
import * as THREE from "three";

// ── Vertex shader — organic blob wobble ───────────────────────────────────────
const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2  uMouse;   // -1..1 normalised

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vFresnel;

  void main() {
    vec3 pos = position;

    // Layered sine waves to produce soft organic displacement
    float wave =
        sin(pos.x * 2.8 + uTime * 0.9)  * 0.055
      + sin(pos.y * 3.2 + uTime * 1.2)  * 0.045
      + cos(pos.z * 2.4 + uTime * 0.7)  * 0.040
      + sin((pos.x + pos.z) * 2.0 + uTime * 1.5) * 0.030;

    pos += normal * wave;

    // Mouse tilt — rotate slightly toward cursor
    float rx = uMouse.y * 0.35;
    float ry = uMouse.x * 0.35;
    mat3 rotX = mat3(
      1.0,      0.0,       0.0,
      0.0,  cos(rx), -sin(rx),
      0.0,  sin(rx),  cos(rx)
    );
    mat3 rotY = mat3(
       cos(ry), 0.0, sin(ry),
           0.0, 1.0,     0.0,
      -sin(ry), 0.0, cos(ry)
    );
    pos = rotY * rotX * pos;

    vec4 mvPos  = modelViewMatrix * vec4(pos, 1.0);
    vViewPosition = -mvPos.xyz;

    vec3 tNorm   = rotY * rotX * normal;
    vNormal      = normalize(normalMatrix * tNorm);

    float f = 1.0 - max(dot(normalize(vNormal), normalize(vViewPosition)), 0.0);
    vFresnel = pow(f, 1.6);

    gl_Position = projectionMatrix * mvPos;
  }
`;

// ── Fragment shader — iridescent colour shift ─────────────────────────────────
const fragmentShader = /* glsl */ `
  uniform float uTime;

  varying vec3  vNormal;
  varying vec3  vViewPosition;
  varying float vFresnel;

  // HSL → RGB helper
  vec3 hsl2rgb(float h, float s, float l) {
    float c = (1.0 - abs(2.0 * l - 1.0)) * s;
    float x = c * (1.0 - abs(mod(h * 6.0, 2.0) - 1.0));
    float m = l - 0.5 * c;
    vec3 rgb;
    if      (h < 0.1667) rgb = vec3(c, x, 0.0);
    else if (h < 0.3333) rgb = vec3(x, c, 0.0);
    else if (h < 0.5000) rgb = vec3(0.0, c, x);
    else if (h < 0.6667) rgb = vec3(0.0, x, c);
    else if (h < 0.8333) rgb = vec3(x, 0.0, c);
    else                 rgb = vec3(c, 0.0, x);
    return rgb + m;
  }

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vViewPosition);

    // Hue: fresnel angle + slow time drift + normal contribution
    float hue = fract(
        vFresnel * 0.75
      + uTime * 0.055
      + n.y * 0.18
      + n.x * 0.10
    );

    float sat = 0.88;
    float lit = 0.42 + vFresnel * 0.30;

    vec3 iridescent = hsl2rgb(hue, sat, lit);

    // Dark base — just enough to show the metal core
    vec3 base  = vec3(0.04, 0.04, 0.06);
    vec3 color = mix(base, iridescent, vFresnel * 0.92 + 0.08);

    // Soft specular highlight (view-aligned)
    float spec = pow(max(dot(reflect(-v, n), vec3(0.0, 0.0, 1.0)), 0.0), 28.0);
    color += spec * 0.55;

    gl_FragColor = vec4(color, 1.0);
  }
`;

// ── Component ─────────────────────────────────────────────────────────────────
export default function IridescentOrb({ className = "" }) {
  const mountRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // ── Scene setup ──────────────────────────────────────────────────────────
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 3.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // ── Geometry & material ──────────────────────────────────────────────────
    const geometry = new THREE.SphereGeometry(1, 128, 128);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime:  { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // ── Resize handler ───────────────────────────────────────────────────────
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // ── Mouse tracking (global — works whether cursor is on orb or not) ──────
    const onMouseMove = (e) => {
      targetRef.current = {
        x:  (e.clientX / window.innerWidth)  * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // ── Render loop ──────────────────────────────────────────────────────────
    let rafId;
    const clock = new THREE.Clock();

    const tick = () => {
      rafId = requestAnimationFrame(tick);

      // Lerp mouse
      const m = mouseRef.current, t = targetRef.current;
      m.x += (t.x - m.x) * 0.06;
      m.y += (t.y - m.y) * 0.06;

      material.uniforms.uTime.value  = clock.getElapsedTime();
      material.uniforms.uMouse.value.set(m.x, m.y);

      renderer.render(scene, camera);
    };
    tick();

    // ── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={className} />;
}
