# You Only Get 1s

[![CI](https://github.com/bluehexagons/yog1/actions/workflows/ci.yml/badge.svg)](https://github.com/bluehexagons/yog1/actions/workflows/ci.yml)

[Play the game](https://bluehexagons.github.io/yog1/).

Originally a 48-hour Ludum Dare 28 game by bluehexagons. Solve each equation by
changing exactly one number into a `1`.

The current version includes five difficulty settings, integer arithmetic from
addition through roots, recurring warm-up and challenge rounds, and a custom game
builder. Problem history and per-mode stats are stored locally in the
browser and can be cleared from the page. The active puzzle, selected move,
hint and session progress, result message, current screen, history page,
sidebar state, and Custom builder choices are also remembered locally so
refreshing can return to where you left off.

Additional modes include Adaptive difficulty, a shared Daily puzzle, a 60-second
Timed sprint, a three-life Endless run, ten handcrafted Challenges, and Guided
Practice for focused learning. Guided Practice tracks confidence-aware progress
across balancing, multiplication, division, remainders, powers, and roots. It
suggests concepts to revisit while allowing learners to choose a focus.
Adaptive mode responds to correct and incorrect answers and offers a Flow style
that follows the learner’s pace or a Coach style that builds fluency with
less-familiar operations.
Daily results include a seven-day grid plus current and best streaks.

Generated puzzles are sampled for a unique, safe solution and selected near the
round's displayed complexity target. Every generated puzzle has a reproducible
share link, and saved history entries can be replayed. Incorrect answers can be
retried, and completed puzzles include collapsible step-by-step arithmetic.
Valid alternate solutions are recognized explicitly in handcrafted content. A
four-step hint ladder first compares both sides, then
describes the needed numerical change, and only afterward reveals the relevant
side and number. Feedback explains how the chosen replacement changed the value
of its side and connects the puzzle to a reusable symbolic relationship. Reviewed
puzzles can also be copied as structured JSON with their concept, totals,
solution effect, and evaluation trace for lesson authoring or LLM experiments.

The game also tracks achievements and session summaries. The **Options → Save
data** section can download or restore local progress as a versioned JSON backup.
Accessibility options provide larger text, higher contrast, reduced clutter,
natural-language equation labels, and logical left-to-right math inside
right-to-left layouts. Simple synthesized waveform sound effects are available
but disabled by default. The saved color-scheme setting defaults to the browser
preference and also offers Light, Dark, OLED-black Midnight, low-blue Sunset,
and colorful Pastel themes.

Keyboard controls:

- Left/Right: move between numbers
- Space: change or restore the focused number
- Enter: check the equation
- Ctrl/Command+Enter: check from elsewhere in the game
- H: request a hint

It remains a dependency-free static site. Open `index.html` in a browser to play.
When served over HTTPS or localhost, its web app manifest and service worker make
it installable and available offline.
The legacy `yog1.htm` URL redirects to the root entry point while preserving
query parameters and fragments from existing shared links.

## Localization

`assets/js/i18n.js` contains the English catalog, while
`assets/js/translations/` contains the lazy-loaded translated catalogs for Spanish,
German, French, Simplified and Traditional Chinese, Arabic, Bengali, Japanese,
Korean, Hindi, Brazilian Portuguese, Polish, Russian, Vietnamese, Turkish, and
Urdu. The Options screen remembers the chosen language, preserves it in shared
links and installed-app metadata, and lets players choose the sidebar side.
Centralized locale metadata supplies each language autonym, direction, and full
BCP 47 document tag. Arabic and Urdu enable the RTL layout while equations remain
left-to-right. Use `data-i18n` for static markup and `Yog1I18n.t(key, values)` for
generated text.

Run the complete test, syntax, and site audit with:

```sh
npm run check
```

## Development

The shipped game remains a dependency-free static site. Runtime code lives in
`assets/js/`: `game-core.js` owns arithmetic generation and analysis,
`game-content.js` owns handcrafted content, `storage.js` owns versioned
persistence and backup data, `theme.js` applies the saved color scheme before
the page renders, `locales.js` owns locale metadata, and `game.js`
coordinates session state and rendering. Install manifests and icons live in
`assets/manifests/` and `assets/icons/`; the stylesheet lives in `assets/css/`,
and tests live in `tests/`.
Pre-release builds intentionally support only the current saved-data, backup,
and shared-link formats.

After changing runtime files, locale metadata, descriptions, icons, or install
metadata, regenerate localized manifests and the content-hashed offline cache:

```sh
npm run build
```

`npm run package` creates the exact Pages artifact in `dist/`. Pull requests run
the same checks in CI. Pushes to `main` are validated, packaged, and deployed
through the pinned GitHub Pages workflow; only runtime files are published.
GitHub Actions updates are grouped into weekly Dependabot pull requests.

See [CONTRIBUTING.md](CONTRIBUTING.md) for repository conventions and the
pre-submission checklist.

## Versioning and releases

The About screen reads its version and commit date from `assets/js/version.js`.
The release tool can set an exact semantic version or bump the patch, minor, or
major part:

```sh
node scripts/release.js patch
node scripts/release.js 1.0.0
```

Those commands only update the metadata and offline cache, leaving the changes
for review. Add explicit flags to commit, create an annotated tag, and atomically
push both the current branch and tag:

```sh
node scripts/release.js minor --commit --tag
node scripts/release.js 1.0.0 --commit --tag --push
```

Automated release commits require a clean worktree. Tags use the form `vX.Y.Z`,
and the recorded date defaults to the local date of the release commit.
