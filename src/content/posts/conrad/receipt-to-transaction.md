---
title: From a receipt photo to a posted transaction
summary: Snap a receipt; a vision model reads it, Conrad proposes the split by item, and you post it.
pubDate: 2026-11-10
draft: false
clips:
  - name: receipt-to-transaction
    caption: A grocery receipt, scanned, read, split across seven accounts by item, and posted to the Amex. Demo data; the two jump cuts skip the model's thinking time.
  - name: receipt-upload
    caption: The same flow from the API side — upload with curl, wait for the model, read back what it found.
---

A receipt photo becomes a posted, balanced entry in under a minute, and
nothing is posted without a look from you.

## What you are seeing

- **Scan.** Pick the photo and say what paid for it: here, the Amex.
- **Read.** A vision model reads it in the background: merchant, date, total,
  every line.
- **Split by items.** Choose the accounts to split into (here, Groceries and
  its six sub-accounts) and optionally say how in plain words: "Bacon is Pork.
  Deli turkey is Poultry." Your words are read last, so they win.
- **Review.** The proposal opens as an ordinary entry in the ledger's own split
  editor. In this take the model misread one price by 70¢. Conrad notices that
  the lines do not add up to the receipt, holds the difference on a line of its
  own, and will not post until it has an account. Choosing one that is already in
  the entry offers to merge it in.
- **Posted.** One charge on the Amex, split by what was bought.

## What you are seeing (API)

- The photo is posted to `POST /books/{id}/receipts/upload` and comes back
  `PENDING` straight away. The reading happens in the background.
- A vision model reads the merchant, date, total and lines, and files each
  line against an account from the book's own chart of accounts.
- `GET /receipts/{id}` returns the reading: here, the two books on one line and
  the café items on another, adding up to the receipt's $60.76.

## How it is built

- **A job, not a request.** The upload stores the image in S3-compatible
  storage and enqueues a reading job. Workers on virtual threads claim jobs
  with `SKIP LOCKED`, so the request never waits on the model.
- **Vendor-neutral reading.** The reader is chosen by configuration (a hosted
  model, or a local one running in Ollama) behind one interface.
- **Nothing posts by itself.** A reading becomes a proposal you review in the
  same split editor the ledger uses. Only then is it posted.
- **Same image, same answer.** A receipt image Conrad already holds is
  recognised, and the earlier reading is returned instead of a second one.
