# You Only Get 1s

[Play the game](https://bluehexagons.github.io/yog1/yog1.htm).

Originally a 48-hour Ludum Dare 28 game by bluehexagons. Solve each equation by
changing exactly one number into a `1`.

The current version includes five difficulty settings, integer arithmetic from
addition through roots, recurring warm-up and challenge rounds, and a custom game
builder. Problem history and per-difficulty stats are stored locally in the
browser and can be cleared from the page.

Additional modes include Adaptive difficulty, a shared Daily puzzle, a 60-second
Timed sprint, a three-life Endless run, ten handcrafted Challenges, and a Math
Lab for focused learning. Math Lab tracks confidence-aware mastery across
balancing, multiplication, division, remainders, powers, and roots. It recommends
concepts that need more practice while allowing learners to choose a focus.
Adaptive mode responds to correct and incorrect answers and offers a Flow style
that reinforces strengths or a Coach style that practices weaker operators.
Daily results include a seven-day grid plus current and best streaks.

Generated puzzles are sampled for a unique, safe solution and selected near the
round's displayed complexity target. Every generated puzzle has a reproducible
share link, and saved history entries can be replayed. Incorrect answers can be
retried, and completed puzzles include collapsible step-by-step arithmetic.
Valid alternate solutions are recognized explicitly if one appears in legacy
or handcrafted content. A four-step hint ladder first compares both sides, then
describes the needed numerical change, and only afterward reveals the relevant
side and number. Feedback explains how the chosen replacement changed the value
of its side and connects the puzzle to a reusable symbolic relationship. Reviewed
puzzles can also be copied as structured JSON with their concept, totals,
solution effect, and evaluation trace for lesson authoring or LLM experiments.

The game also tracks achievements and session summaries. Local progress can be
exported to or restored from a versioned JSON backup. Accessibility options
provide larger text, higher contrast, reduced clutter, natural-language equation
labels, and logical left-to-right math inside right-to-left layouts. Simple
synthesized waveform sound effects are available but disabled by default.

Keyboard controls:

- Left/Right: move between numbers
- Space: flip the focused number
- Enter: check the equation
- Ctrl/Command+Enter: check from elsewhere in the game
- H: request a hint

It remains a dependency-free static site. Open `yog1.htm` in a browser to play.
When served over HTTPS or localhost, its web app manifest and service worker make
it installable and available offline.

## Localization

`i18n.js` contains complete catalogs for English, Spanish, Simplified Chinese,
Arabic, Bengali, Japanese, Hindi, Brazilian Portuguese, Russian, Vietnamese,
Turkish, and Urdu. The Options screen remembers the chosen language, preserves
it in shared links and installed-app metadata, and lets players choose the
sidebar side. Centralized locale metadata supplies each language autonym,
direction, and full BCP 47 document tag. Arabic and Urdu enable the RTL layout
while equations remain left-to-right. Use `data-i18n` for static markup and
`Yog1I18n.t(key, values)` for generated text.

Run the generator, localization, and dependency-free UI audit tests with:

```sh
node test-core.js
node test-content.js
node test-storage.js
node test-i18n.js
node test-ui.js
node test-version.js
```

## Development

The shipped game remains a dependency-free static site. `game-core.js` owns
arithmetic generation and analysis, `game-content.js` owns handcrafted content,
`storage.js` owns versioned persistence and backup data, `locales.js` owns locale
metadata, and `game.js` coordinates session state and rendering.

After changing runtime files, locale metadata, descriptions, icons, or install
metadata, regenerate localized manifests and the content-hashed offline cache:

```sh
node scripts/update-assets.js
```

## Versioning and releases

The About screen reads its version and commit date from `version.js`. The release
tool can set an exact semantic version or bump the patch, minor, or major part:

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
