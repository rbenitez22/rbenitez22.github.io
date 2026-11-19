---
name: Pi Notes
tagline: The digits of pi, played as music — up to twenty million of them, in the browser.
stack: [JavaScript, Web Audio, Web Workers, WebAssembly, GMP, VexFlow]
order: 3
---
Pi Notes reads the digits of pi and plays them. A scheme decides how digits
become notes, and a key, a scale and up to four instruments decide how they
sound. The page plays the result and shows it three ways while it plays: the
digits behind each note, a piano roll, and sheet music. Try it at
[pi-notes.pages.dev](https://pi-notes.pages.dev/).

## What it does

- **Four ways to read digits.** `codes` turns groups of two to four digits
  into a note and a length, `degrees` makes each digit a scale step, `pairs`
  uses one digit for pitch and the next for length, and `steps` moves the
  melody up or down.
- **Pinned codes.** In the `codes` scheme, any code can be pinned to a chosen
  note or rest: `2635 = Bb3 1/4`.
- **Sound.** Eight scales in any key, one to four instruments (piano, organ,
  harp, bells, strings, bass and more), each in its own octave, from 40 to
  200 BPM.
- **Three lengths.** A set number of notes, a set time (the last note is cut
  to fit), or Infinite, which plays until you press Stop.
- **Anywhere in pi.** Start at the leading 3, at a typed position (`4M`,
  `250k`), or at a random digit, up to the twenty-millionth.
- **Three views.** Digit chips, a piano roll and a score. During long pieces
  they follow the playhead: the roll scrolls, and the score turns 8-bar pages.

## How it's built

- **One HTML file.** No build step and no server: the app is a single page
  that runs in any modern browser.
- **Pi computed on the page.** Up to 20,000 digits are computed instantly
  with `BigInt`. Beyond that, a Web Worker runs the Chudnovsky series with
  binary splitting on GMP compiled to WebAssembly: 1 million digits in about
  a second, 20 million in about half a minute on a laptop.
- **Generated a bar at a time.** Long pieces are never built whole. Bars are
  generated ahead of the playhead, notes that have finished playing are
  dropped, and memory stays flat however long it plays.
- **Synthesized sound.** Every instrument is built from Web Audio oscillators,
  custom waveforms and filters. There are no samples to download.
- **A tested core.** The music logic doesn't touch the page, and it's tested
  in Node, including against the first version's output for 11,520 setting
  combinations.

The post below shows it working.
