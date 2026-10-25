# material-you-css

Vendored Material Design 3 CSS implementation used by this VitePress theme.

- Upstream: <https://github.com/hiratazx/material-you-css>
- Commit: `9fd26c2ccdd82e8933e5b298f11e402a56e21255` (2026-02-23)
- License: MIT — see [LICENSE](./LICENSE)
- Vendored file: [material-you.css](./material-you.css)

## Local modifications

- The dark-mode token block was changed from
  `@media (prefers-color-scheme: dark) { :root { ... } }` to `.dark { ... }`,
  so VitePress' appearance toggle controls the MD3 color tokens.
- No other CSS declarations were changed.

When updating this dependency, replace the CSS file, keep the LICENSE file and
this README together, and re-apply the `.dark` selector change if upstream still
uses a media query.
