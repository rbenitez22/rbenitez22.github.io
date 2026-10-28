---
title: Meet Garçon
summary: One sentence in a chat, one balanced entry in Conrad's ledger. Garçon turns plain words into calls to my apps' APIs, and finds the right accounts by meaning.
pubDate: 2026-10-27
draft: false
images:
  - name: garcon-chat-ledger.png
    alt: On the left, the Garçon chat. I asked it to add a 44.95 charge to my Visa credit card for gasoline, and it replied that the charge was recorded, with "4 actions" under the reply. On the right, Conrad's ledger, with an arrow from the reply to a new entry, Gasoline, Fuel, $44.95 CR, running balance $430.95.
    caption: The request in the chat, and the entry it posted in Conrad's ledger.
  - name: garcon-chat-splits.png
    alt: The entry's two splits. "I said visa" points to Visa under Liabilities › Credit Cards, $44.95 CR. "I said gasoline" points to Fuel under Expenses › Auto, $44.95 DR.
    caption: The words I used, and the accounts Garçon chose for them.
---

Garçon is the assistant I built for my application: an MCP server with a chat client
in front of it. I say what I want in plain words, and it works out which
application's endpoints should handle it and what to send. Conrad is the first application shown here, but not the only one it serves.

## What you're seeing

- **The request.** "Please add a 44.95 charge to my visa credit card for
  gasoline." Nothing else: no book, no account names, no date.
- **The reply.** Garçon says it recorded the charge. Under the reply, "4
  actions" opens the list of calls it made, each with the tool, its arguments
  and the result.
- **The ledger.** The entry is in Conrad, posted and balanced: Gasoline,
  under Fuel, $44.95 on the Visa card, and the running balance moves to
  $430.95.
- **The splits.** I said "visa" and "gasoline". The book has no account named
  gasoline. Garçon chose Liabilities › Credit Cards › Visa for the credit and
  Expenses › Auto › Fuel for the debit: matched by meaning, not by spelling,
  and a proper double entry.

## How it's built

- **Two steps per message.** First a short LLM call reads the message and
  picks the apps it's about; here, Conrad. Then only Conrad's tools are
  offered to the model, which looks up the accounts and fills in the entry
  from the tools' descriptions. The next posts take each step in turn.
- **Tools are rows.** Each endpoint Garçon can call is described in
  PostgreSQL: the app, the HTTP method and URL template, and each parameter
  with its type and description. Garçon builds the HTTP request from that row.
- **Conrad does the bookkeeping.** Garçon sends an ordinary request to
  Conrad's REST API. Conrad validates it, posts it and computes the running
  balance, exactly as for an entry typed in the ledger.
- **The user's own permissions.** The call carries the signed-in user's token,
  so Conrad applies the same grants it would on its own screens.
