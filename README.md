# You Only Get 1s

[Play the game](https://bluehexagons.github.io/yog1/yog1.htm).

Originally a 48-hour Ludum Dare 28 game by bluehexagons. Solve each equation by
changing exactly one number into a `1`.

The current version includes five difficulty settings, integer arithmetic from
addition through roots, recurring warm-up and challenge rounds, and a custom game
builder. Problem history and per-difficulty stats are stored locally in the
browser and can be cleared from the page.

Additional modes include Adaptive difficulty, a shared Daily puzzle, a 60-second
Timed sprint, a three-life Endless run, and five handcrafted Challenges. Adaptive
mode responds to correct and incorrect answers, applies rating penalties for
hints and skipped questions, and shows less-comfortable operators less often.
Every generated puzzle has a reproducible share link. Incorrect answers can be
retried, hints reveal the relevant side and then the intended number, and
completed puzzles explain both side totals.

The game also tracks achievements and session summaries. Accessibility options
provide larger text, higher contrast, and reduced clutter. Simple synthesized
waveform sound effects are available but disabled by default.

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
node test-i18n.js
node test-ui.js
```
