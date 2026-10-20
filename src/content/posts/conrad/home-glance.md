---
title: Home at a glance
summary: Accounts and net worth, what's due, money in against money out, where it went, and what's changing, on one screen, by month, quarter or year.
pubDate: 2026-10-20
draft: false
clips:
  - name: home-glance
    caption: Conrad's Home screen, each card in turn, then September's spending against August's, and the same cards by quarter and by year. Demo data.
---

Conrad opens on Home: the whole book on one screen, in cards. Each one
answers one question, and every card follows the same period at the top:
a month, a quarter or a year.

## What you're seeing

- **Accounts.** Every account by type, assets and liabilities, and the net
  worth they add up to. Names link to their registers.
- **Upcoming.** What's overdue, due today and coming up in the next two
  weeks, with the same Review, Pay and Skip as the Upcoming screen.
- **Income vs expense.** Money in against money out, period by period.
- **Spending.** By category, each one opening into its own accounts (Shopping
  into Clothing and Household). Turn on "Compare with the month before" for
  before, now and the change side by side. The clip steps back to September
  first: October is only half over, and comparing half a month with a whole
  one would read as a drop.
- **Where the money goes.** The top five categories and the rest.
- **Expense patterns.** Which categories are growing, shrinking or steady.
- **Quarter and year.** The same cards, by Q3 and then by year, stepped back
  to 2025 against 2024.

## How it's built

- **One query behind four cards.** Spending, income vs expense, where the
  money goes and expense patterns all read one endpoint: a book's income and
  expense by period, for a date range and a period length.
- **Figures are the server's.** Totals and balances are computed in the
  database and shown exactly as sent. The browser only orders them and sizes
  the charts.
- **Patterns are a yardstick, not a forecast.** Each category's last period
  against the average of the periods before it. Within 15% either way is
  steady, above is growing, below is shrinking. The average is never shown,
  only the change.
- **The screen remembers you.** Which cards are open, and whether you look by
  month, quarter or year, are kept, so Home comes back the way you left it.
