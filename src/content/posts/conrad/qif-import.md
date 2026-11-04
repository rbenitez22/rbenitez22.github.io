---
title: Ten years of Quicken, imported
summary: A step-by-step wizard turns Quicken's QIF exports into a new Conrad book, and nothing posts until you've seen what will.
pubDate: 2026-11-03
draft: false
clips:
  - name: qif-import
    caption: A ten-year household QIF file through the import wizard into a new book. Demo data; one jump cut skips most of the import run.
---

Moving off Quicken shouldn't mean starting from zero. Conrad reads Quicken's
QIF exports into a new book through a wizard, step by step, and nothing is
posted until the last step.

## What you're seeing

- **Upload.** One QIF file holding every account, or one file per account.
  Transfers between files find each other by account name.
- **Files.** What was read: 5,333 entries from October 2016 to September 2026.
- **Accounts.** Each Quicken account becomes an account in the book. Its kind
  (asset, liability) is guessed and can be changed, and two accounts given the
  same name become one.
- **Categories.** Quicken categories map onto the chart of accounts. A colon
  nests them (`Auto:Fuel`), and a category can land on an account you already
  have.
- **Tags.** Quicken classes become tags.
- **Review.** Before anything posts: the date range, how many transactions,
  354 transfers found in both registers and posted once, entries with no
  category, and anything odd, such as a split that doesn't add up or an
  investment account that isn't imported.
- **Import.** 4,979 transactions, posted in the background. The book opens on
  ten years of history.

## How it's built

- **The import is a batch, not a request.** Each step saves its mappings on
  the server, so an import can be left half-done and picked up again from the
  book list.
- **Posted a month at a time.** A background job on a `SKIP LOCKED` queue
  commits one month per database transaction and records how far it got. A
  failure or a restart resumes at the next month, and a transfer pair is never
  split across two months.
- **Mappings freeze once posting starts**, because an account that already
  holds splits can't be cleaned up behind the run.
- **Cleared stays cleared.** Entries Quicken had reconciled arrive as cleared;
  one button marks them reconciled once the book looks right.
- **Built to be reused.** The wizard shell, the mapping and the matcher are
  meant to serve bank-statement import next, so that importer won't start from
  scratch.
