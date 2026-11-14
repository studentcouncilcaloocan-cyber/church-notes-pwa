# Church Notes — Phase 2 Staging

## Purpose
A complete, dependency-free Phase 2 staging package. **Do not overwrite the existing Phase 1 production repository.** Deploy to a separate public GitHub Pages repository, e.g. `church-notes-pwa-staging`.

## Included
- Working notes editor: bold, italic, underline, headings, quote, bullet/numbered lists, undo/redo
- Debounced IndexedDB autosave (500ms), Save now, duplicate and confirmed delete
- Editable preset/custom gathering categories
- Search note title/body/category, filter and sort
- Calendar grouped by gathering date
- Bookmarks, recent notes, theme preference, responsive mobile drawer
- Installable PWA with offline shell
- Version 2 upgrade of existing database schema (when opened on same origin; staging uses a separate origin/path)

## Not included yet
- Phase 3: MCGI Digital Bible integration, automatic verse detection, verse preview, 1080×1920 / 1080×1080 share cards
- Phase 4: backup/export/import, stronger security and comprehensive regression testing
- Cross-device sync or user accounts

## Browser-first deployment
1. GitHub > New repository > `church-notes-pwa-staging`, Public, empty (do not initialize with README).
2. Upload the **nine extracted files** from this package directly to repository root; commit.
3. Settings > Pages > Source: Deploy from a branch > main > /(root) > Save.
4. Open `https://studentcouncilcaloocan-cyber.github.io/church-notes-pwa-staging/` once Pages reports it is published.
5. Do not upload these files to `church-notes-pwa` until approved.

## Verification checklist (Chrome)
1. Homepage and all eight navigation destinations work.
2. On narrow screen, drawer opens/closes via menu, overlay, Escape.
3. Create a note, enter title and content, apply bold/italic/underline, headings and lists.
4. Wait for `Saved locally`, reload, verify title/content/formatting remain.
5. Edit gathering date and category, reload, verify they remain.
6. Add a custom category, rename it, and filter notes by it.
7. Search note body and title; sort by title/date/recently edited.
8. Bookmark a note; confirm it appears in Bookmarks and persists after reload.
9. Open Calendar, navigate months, select a date with a note and open it.
10. Duplicate a note; delete the duplicate after confirmation; verify original remains.
11. Switch theme and reload; test mobile navigation.
12. In Chrome DevTools > Application > IndexedDB, verify `church-notes` database and stores `notes`, `categories`, `settings`, `bibleVersions`.
13. After an online load, Network > Offline, reload, edit and save a note, reload again while offline. Verify the change remains.
14. Install as PWA on Chrome if offered, and open it in standalone mode.
15. Revisit Phase 1 production URL and confirm it remains unchanged.

## Data safety
This is a staging build and has **no export/backup feature yet**. Do not store irreplaceable notes here. Browser storage may be cleared or evicted. Staging and production GitHub Pages repository paths share an origin; this package currently uses the same IndexedDB database name as Phase 1. Phase 1 has no note editor, but **do not rely on repository separation as database isolation**. For stronger isolation, use a separate Chrome profile for staging. Phase 2 should not be promoted until backup/data-migration concerns are resolved.

## Caveats
The rich-text toolbar uses browser `document.execCommand` for a dependency-free initial editor. It is deprecated and should be replaced with a maintained editor before long-term production use. The service worker is cache-first and requires a cache-version bump for future updates.
