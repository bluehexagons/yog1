# Contributing

Thanks for improving You Only Get 1s. The shipped game has no runtime or build
dependencies; a current Node.js installation is enough for development.

## Before submitting a change

1. If runtime assets, metadata, icons, or translations changed, run `npm run build`.
2. Run `npm run check`.
3. Confirm `git diff --check` reports no whitespace errors.
4. Keep generated manifests and `sw.js` in the same commit as their source changes.

`npm run package` creates the exact publishable site in `dist/`. This directory is
generated and should not be committed.

## Project conventions

- Keep arithmetic and puzzle analysis in `assets/js/game-core.js`.
- Keep handcrafted puzzles in `assets/js/game-content.js`.
- Keep persistence changes in `assets/js/storage.js`.
- Keep locale metadata in `assets/js/locales.js`.
- Put translated catalogs in `assets/js/translations/`.
- Use catalog keys for player-facing text and preserve every `{placeholder}`.
- Add or update focused tests in `tests/` for behavior changes.

Please keep pull requests focused and explain player-visible behavior, compatibility
considerations, and the validation performed.
