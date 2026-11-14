# Church Notes — Phase 3 direct update

## Destination
Existing `studentcouncilcaloocan-cyber/church-notes-pwa` GitHub repository, branch `main`, repository root. No staging repository. Do NOT delete the repo or clear site data.

## Files
Upload all 10 files from this ZIP to the root. Existing files with the same names are replaced; new `bible-companion.js` is added.

## Preserved data
Uses existing IndexedDB database `church-notes` (version 2) without dropping or recreating stores. Existing notes, categories, bookmarks, and dates are preserved by the code. Phase 3 preferences, manually entered excerpts and visual templates use browser localStorage on the same origin. Storage is local-only, not synced across devices. **There is still no backup/restore**: avoid irreplaceable notes and do not clear browser site data.

## Features
- Detects references in Tagalog/English (common names and abbreviations), multiple references, chapter and verse ranges.
- Clickable reference chips appear below editor; no disruptive auto-rewriting of rich text.
- Popup or inline preview; Side-panel preference opens a right-side reference drawer.
- Only user-entered, authorized Bible excerpts are displayed. No Bible translation corpus or official API is included. Adding a source/version label does not import text or confer reproduction rights.
- External link to https://web.digitalbible.app/ (homepage; direct-to-verse navigation not guaranteed).
- Offline Canvas verse card export at 1080×1920 and 1080×1080 PNG; optional browser native sharing; local visual templates, fonts and backgrounds.
- No “SCRIPTURE VERSE” heading, no fabricated MCGI logo or implied official endorsement.
- Existing Phase 2 notes editor, search, calendar, categories, bookmarks, autosave, theme and PWA retained.

## Manual verification
1. Deploy to existing GitHub Pages root; refresh twice online to allow service worker activation.
2. Create a temporary note, type `Juan 3:16; 1 Timoteo 3:15; John 3:16-18`. Confirm three clickable chips below editor.
3. Open a reference; confirm no verse text is invented. Add an excerpt that you have permission to use; reopen it.
4. In Bible Companion switch version/source labels and preview mode; confirm excerpts are per-source.
5. Create Story and Square share cards; download both PNGs and inspect dimensions.
6. Switch offline in Chrome DevTools, refresh, edit note and export PNG offline.
7. Verify existing notes/categories/bookmarks and installed PWA still work.
8. Do not clear IndexedDB/localStorage. Before deploying, keep a copy of the prior ZIP and repository commit for code rollback; code rollback does not restore deleted local data.

## Limitations
- No bundled Bible verses, official API, authorized logo, direct verse deep-link or multi-device sync.
- Browser `execCommand` rich text editing remains as in Phase 2.
- No backup/restore until Phase 4.
- Browser/Android share API depends on browser support.
- No automated end-to-end browser tests performed; JavaScript syntax and ZIP integrity are checked.
