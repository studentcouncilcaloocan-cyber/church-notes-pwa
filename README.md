# MCGI Notes v1.4 — Offline Bible Library

Upload all 18 files to the existing GitHub Pages repository root. Export a notes JSON backup first.

In Settings, download Ang Dating Biblia (1905) and/or King James Version while online. The full translation is validated for 66 books and >30,000 verses before being saved to a **separate** IndexedDB database (`mcgi-offline-bible-v1`).

Installed versions are used before online Bible API lookup. The offline reader and full-text search are in Settings. Downloads may be several MB each; do not close the page during download. Data is local and subject to browser storage eviction. Other Bible versions continue using online API/cached verses.

No existing notes database migration. The downloaded Bible is not included in the notes backup. Verify Bible provider distribution terms for your jurisdiction before redistributing data.

Source: https://api.getbible.net/v2/tagalog.json and https://api.getbible.net/v2/kjv.json.


## v1.4.1 fix
Bible suggestions now detect the verse reference within the active editor paragraph rather than combining all paragraphs into a single text string. Cursor offsets are computed from text nodes, preserving inline formatting and repeated references in subsequent paragraphs. No database migration or changes to stored notes.
