/** Singleton holder so scroll.js can reach the Lenis instance without context */
let _lenis = null;

export function setLenis(instance) {
  _lenis = instance;
}

export function getLenis() {
  return _lenis;
}
