# Contributing

Thanks for improving You Only Get 1s. The shipped game has no runtime
dependencies. Use Node.js 24 from `.nvmrc` for development, then install tools
with `npm ci`. Supported runtimes are Node.js 24.22.1+ within 24.x (LTS) or 26.12.1+ within 26.x (Current); CI checks both Node.js 24 and 26. With nvm installed, `nvm install` and `nvm use` select the pin.

## Development environment

Basaltwater on Debian is the reference development environment. Native Node.js
and npm commands also work without Basaltwater; no managed service is required.
On a managed machine, `basaltw node exec -- npm run check` uses the project pin
without changing the account's default Node.js version. Use the installed
project-development and web-gateway skills for shared environment support; the
[Basaltwater project standards](https://github.com/bluehexagons/basaltwater/blob/main/docs/agents/project-standards.md)
describe the shared conventions. Project commands and file layout remain local.

## Before submitting a change

1. If TypeScript, runtime assets, metadata, icons, or translations changed, run `npm run build`.
2. Run `npm run check`.
3. Confirm `git diff --check` reports no whitespace errors.
4. Keep generated JavaScript, manifests, and `sw.js` in the same commit as their source changes.

After building, `npm run package` creates the exact publishable site in `dist/`.
Packaging does not run the build. This directory is generated and should not be
committed. Preserve source artwork, tracked generated runtime assets, and player
save backups when reviewing cleanup candidates.

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
