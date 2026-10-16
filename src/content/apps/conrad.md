---
name: Conrad
tagline: Double-entry personal finance — ledgers, budgets, receipts and imports.
stack: [Java 25, Spring Boot, React, TypeScript, PostgreSQL, S3, LLM receipt reading, Railway]
order: 1
---

Conrad is a personal-finance application built on double-entry bookkeeping:
every transaction balances, every account has its own register, and a split
can carry one payment across as many accounts as it touches.

Around that core it reads receipt photos with a vision model, proposes how to
split them by item, imports years of Quicken history, budgets by period, and
schedules recurring entries.

The posts below each show one workflow running, with notes on how it's built.
