---
title: Ten years in one ledger
summary: A register for every account, a running balance that's always right, and a paycheck split across eight accounts.
published: 2026-10-15
draft: true
clips:
  - name: ledger-tour
    caption: The Checking register, scrolled back through ten years of history, then one paycheck opened to its splits. Demo data.
---

Conrad keeps a register for every account. The clip opens Checking at its
newest entries, scrolls back through the history, and opens a paycheck.

## What you're seeing

- **A running balance on every line.** It's the account's real balance at that
  point, not a sum of whatever happens to be on screen, so a line reads the same
  however you reached it.
- **Ten years of history, a scroll away.** The register opens at today and
  loads older entries as you scroll up. Nothing is paginated by hand.
- **One paycheck, nine lines.** The deposit lands in Checking. The other side is
  gross salary, less federal and state tax, Social Security, Medicare, medical
  and dental insurance, and a 401(k) contribution. It's one transaction, and it
  balances to the cent.

The history is generated demo data: a household's ten years, imported from a
Quicken (QIF) file through Conrad's import wizard.

## How it's built

- **Balances computed on read.** The running balance starts from everything
  posted before the first visible line, then adds a window sum over the page in
  `(date, sequence)` order. Any page, fetched in any order, carries correct
  absolute balances, even while other entries are being posted.
- **Paged backwards by rows.** The API reads the register newest-first with a
  keyset cursor, so scrolling back ten years costs the same per page as
  scrolling back one month.
- **Sides, not signs.** The database stores a split's side as the sign of its
  amount. Everything above the persistence layer speaks in magnitude plus side
  (debit or credit), so a negative number on screen always means something:
  overdrawn, or contra.
- **One split editor.** The rows that open under the paycheck are the same
  component that edits entries, fills in templates and reviews receipt
  proposals.
