# Contributing

Thanks for improving You Only Get 1s. The shipped game has no runtime
dependencies. Install development tools with `npm ci` using Node.js 20 or later.

## Before submitting a change

1. If TypeScript, runtime assets, metadata, icons, or translations changed, run `npm run build`.
2. Run `npm run check`.
3. Confirm `git diff --check` reports no whitespace errors.
4. Keep generated JavaScript, manifests, and `sw.js` in the same commit as their source changes.

`npm run package` creates the exact publishable site in `dist/`. This directory is
generated and should not be committed.

## Project conventions

- Keep arithmetic and puzzle analysis in `assets/js/game-core.js`.
- Keep handcrafted puzzles in `assets/js/game-content.js`.
- Keep persistence changes in `assets/js/storage.js`.
- Keep gamepad handling and locale metadata in `src/gamepad.ts` and `src/locales.ts`.
- Format TypeScript and tooling configuration with `npm run format`; oxlint checks
  all JavaScript and TypeScript during `npm run check`.
- Put translated catalogs in `assets/js/translations/`.
- Use catalog keys for player-facing text and preserve every `{placeholder}`.
- Add or update focused tests in `tests/` for behavior changes.

Please keep pull requests focused and explain player-visible behavior, compatibility
considerations, and the validation performed.
