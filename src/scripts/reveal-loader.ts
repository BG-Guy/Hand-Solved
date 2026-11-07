// reveal-loader.ts: every browser with scroll timelines stops here, having spent one test. The rest (Firefox, Safari below 26) import the one-shot fallback.
// Under reduced motion nothing is hidden and nothing is loaded.
if (!CSS.supports('animation-timeline', 'view()') && matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  void import('./reveal-fallback');
}

// A module, so its top-level names stay out of the global scope.
export {};
