---
name: Conrad
tagline: Double-entry accounting for personal finance — ledgers, budgets, receipts and ten years of imported history.
stack: [Java 25, Spring Boot, PostgreSQL, React, TypeScript, Vision LLM, S3, Railway]
order: 1
---
I have created accounting components in various applications, often consisting only of a Chart of Accounts and a 
Ledger.  For many years, I have wanted to create a full-featured personal finance manager.  Although it will never be 
finished, I have finally created it: a double-entry accounting financial manager I have named Conrad, after the 
proud bureaucrat and accountant from Futurama, Hermes Conrad.

## What it does

- **Ledger.** A register per account that opens at the newest entry and pages
  back through history as you scroll. Editing happens inline: each field saves
  as you leave it, and an entry posts itself once it balances.
- **Receipts.** Photograph a receipt and a vision model reads it: merchant,
  date, total, and line items. Conrad then proposes how to split it across your
  accounts, item by item, for you to review before anything is posted.
- **Imports.** Years of Quicken history (QIF, several files in one go), mapped
  onto Conrad's chart of accounts through a step-by-step wizard and posted a
  month at a time.
- **Budgets.** Budgets by period, with totals that roll up the account tree and
  each line's actual spending one click away.
- **Templates and schedules.** Recurring bills and paychecks are generated as
  editable drafts, ready to review and post.
- **Loans and reconciling.** Amortized loans, and statement reconciliation.

## How it's built

- **Backend.** Java 25 and Spring Boot, organized by bounded context (ledger,
  authorization, budgeting, templates, loans, billing) rather than by technical
  layer. PostgreSQL with Flyway migrations.
- **Concurrency.** Background work (receipt reading, scheduled entries,
  imports) runs on virtual threads through a `SKIP LOCKED` job queue. Running
  balances are computed on read, so they stay correct while entries post
  concurrently.
- **API.** Every capability is reachable over a versioned REST API, with
  RFC 7807 errors and idempotent writes.
- **Authorization.** Fine-grained and hierarchical: books are the entry point,
  grants on an account reach every account below it, and the API strips what a
  caller may not see before it is serialized.
- **Frontend.** React and TypeScript, built from small reusable components, with
  one transaction renderer used everywhere a transaction appears. Themes are
  built from color roles, and contrast is enforced by tests. The bookkeeping is
  explained in place: every `?` opens the same guide that `/help` shows.
- **Deployment.** On Railway, defined as infrastructure as code. Receipt images
  live in S3-compatible storage.

The source is private. The posts below show it working.
