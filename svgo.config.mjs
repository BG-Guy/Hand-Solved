// svgo.config.mjs: shared SVGO settings for src/assets/svg (run `npm run svg`). Output must stay valid under the page CSP.
export default {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // Keep authored ids. Minified ids ("a", "b") collide when several SVG files are inlined in one page.
          cleanupIds: { minify: false },
        },
      },
    },
    // Inline SVG may not carry style="" under the CSP, so turn it into presentation attributes.
    'convertStyleToAttrs',
    'removeScripts',
  ],
};
