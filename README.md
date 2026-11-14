# Church Notes v1.0 — Phase 5 Bible API correction

Direct update for existing GitHub Pages repository `studentcouncilcaloocan-cyber/church-notes-pwa`. Upload all 12 files to repository root; no staging, no data deletion, no reinstallation. Export a current backup first.

## Targeted changes
- Canonical Tagalog/English references share one cache key (e.g. `1 Timoteo 3:15` → `1 Timothy 3:15`).
- Numbered-book requests retry alternate English abbreviations after a 404, without silently substituting a different translation.
- Distinguishes uncached offline/network errors from a genuine 404, and returns cached text when the network fails.
- New service-worker cache version to ensure the fix is installed.

## Important limitations
A 404 can still occur if the provider lacks a passage; this is not guaranteed fixed without a live provider response. Bible API live endpoint could not be contacted from the build environment. Only local mocked tests and syntax/integrity checks are available; live Chrome tests must confirm `1 Timoteo 3:15` for ADB. No cloud sync, no encrypted backups. Existing IndexedDB and localStorage keys are unchanged.

## Test
1. Upload all 12 files; reload online twice to activate the new service worker.
2. In Bible Companion, enter `1 Timoteo 3:15`, click the chip, and confirm ADB text or record the exact error. Try KJV separately.
3. Fetch `Juan 3:16` while online, then set Chrome DevTools Network Offline and reopen the same translation/reference; text should be cached.
4. While offline, request a reference not previously opened; a clear uncached/offline message should appear.
5. Confirm notes, backup/restore, bookmarks, calendar, share-card exports, Windows/Android PWA.
