---
title: Pi, played
summary: Pi Notes turns the digits of pi into music, from the leading 3 to the twenty-millionth digit, and the score and piano roll follow along as it plays.
pubDate: 2026-11-18
draft: false
clips:
  - name: pi-notes-tour
    caption: Three instruments playing pi in Dorian from a random start, through the digit chips, the piano roll and the sheet music. Unmute for the music.
---

Pi never repeats, so it never runs out of music. Pi Notes reads the digits
of pi, turns them into notes, and plays them for as long as you like,
starting anywhere in the first twenty million digits. It runs in the
browser: [pi-notes.pages.dev](https://pi-notes.pages.dev/).

## What you're seeing

- **The scheme.** How digits become notes. Here it's `codes`: each group of
  four digits picks a pitch from the scale and a length, and some codes are
  rests. Any code can be pinned to a note of your choice, such as
  `3141 = C4 1/2`.
- **The sound.** C Dorian and three instruments (piano, bass and bells), each
  in its own octave. Instrument 1 reads first, instrument 2 reads the digits
  that follow, and so on, so each voice plays a different stretch of pi.
- **The length.** Infinite: it plays until Stop. A piece can also be a set
  number of notes, or a set time.
- **The start.** 🎲 Random picks a digit, here 21,851. Past the first 20,000
  digits, Play first computes pi up to that point, with a progress bar.
- **Digits → notes.** Each note as a chip, with the four digits it came from.
  The chip that's playing lights up.
- **Piano roll.** A 32-beat window that scrolls with the playhead, one color
  per instrument.
- **Sheet music.** The score in 4/4, a page of 8 bars at a time. Notes that
  cross a barline are split into tied notes, and the page turns when the
  playhead reaches the next one.
- **Stop.** The status shows which digits were played: 21,851 to 22,438, in
  23 seconds.

## How it's built

- **Pi computed in the browser.** Small starts use `BigInt` and Machin's
  formula, instantly. Larger ones go to a Web Worker running the Chudnovsky
  series with binary splitting. Firefox caps a `BigInt` at about a million
  bits, roughly 157,000 digits for this calculation, so the worker runs on
  GMP compiled to WebAssembly instead: a million digits in about a second,
  twenty million in about half a minute, checked against MPFR's own value
  of pi.
- **A bar at a time.** An infinite piece can't be built before it plays. It's
  generated one 4/4 bar at a time: instrument 1 reads digits up to the
  barline, then instrument 2, and so on. Generation stays 12 bars ahead, so
  each score page is complete when it appears.
- **Flat memory.** Notes that ended more than 64 beats ago are dropped, along
  with their chips. Each voice keeps an offset, so the notes that remain keep
  their numbers, and memory stays the same however long it plays.
- **More digits while it plays.** When fewer than five minutes of digits are
  left, the worker computes about twenty more minutes' worth in the
  background. Pi can't be computed from an offset, so each refill starts over
  from the 3, which is why it starts so early. If the music catches up anyway,
  the audio clock pauses until the digits arrive.
- **One file, no samples.** The app is a single HTML page with no build step.
  Every instrument is synthesized with Web Audio oscillators, custom
  waveforms and filters.
- **A tested core.** The music logic doesn't touch the page, and it's tested
  in Node, including against the first version's output for 11,520
  combinations of settings.
