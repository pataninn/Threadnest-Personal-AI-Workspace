# Dates in new demo sessions

Demo task deadlines retain their calendar-day offset from the published
showcase's date. Each private copy applies that offset to the demo account's
persisted creation date, using the application's Asia/Shanghai calendar.

For example, a showcase published on October 28 with tasks due October 28,
October 31 and November 2 becomes November 7, November 10 and November 12
for a demo started on November 7. Deliberately overdue samples retain their
negative offsets. Tasks without a deadline keep no deadline.

The calculation happens only when creating the private task rows. A delayed
copy or retry still uses the original account creation date. Reloading,
reconnecting and retrying a completed copy preserve its dates and visitor edits.
Each workspace in a demo bundle uses the same session start date and its own
pinned publication date. Original owner tasks, published snapshots and already
created demo tasks are not rewritten. Dates embedded in prose are not changed.

No database migration or new configuration is required. The rule lives in
`backend/src/modules/demo/domain/demo-task-deadline.ts`, and the private-copy
repository supplies the locked account's creation timestamp.

Verification covers calendar offsets, deliberately overdue and undated tasks,
Shanghai midnight, leap days, year boundaries, invalid dates and retry stability.
The PostgreSQL integration test creates two demo accounts with different start
dates and checks their copied deadlines, replay behavior and unchanged snapshot.

## Verification and deployment — November 7, 2026

- Backend unit tests: **1,117 passed** across 186 suites.
- Dedicated PostgreSQL demo-admission integration tests: **10 passed**, including
  two different persisted session start dates and preservation of a visitor edit
  after replay/retry. The database ran in a disposable isolated container; the
  production database was not used for integration tests.
- TypeScript checks and production backend/frontend build passed.
- Deployed runtime commit `45092e80dee8374ed2476336986c0f3689f11c0d` to the
  existing AWS Sydney app. Retained the previous image and a private backup.
- Public live demo: verified all **nine copied task dates** against publication
  offsets and the new account's November 7 start date. Dated tasks were
  November 5, 7, 10, 12 and 15; the other four kept no deadline. November 5 is
  the deliberately overdue example. Reload, session reuse, copy retry and
  sign-out passed. This verification made no AI calls.
- Original owner deadline hashes matched before and after deployment. App
  health, readiness and storage reconciliation passed. AI settings, spending
  caps and the AWS Free plan were preserved.

To see the new dates, sign out and choose **Try demo** to create a fresh demo
account. Opening another tab or reconnecting to an existing demo keeps that
account's original dates.
