# Church Notes v1.0 — Phase 5 direct production update

## Upload destination
Existing repository `studentcouncilcaloocan-cyber/church-notes-pwa`, branch `main`, repository root. **No staging**. Upload all 12 extracted files, including new `bible-api.js`. Preserve the existing GitHub Pages settings.

## Before uploading
1. In the current live app, go to **Backup & Restore** and **Export** your existing data. Store the JSON file safely. Do not clear site data or uninstall the PWA.
2. Download/extract this ZIP, then upload its 12 files to the existing GitHub repository root and commit `Church Notes v1.0 - Final Phase 5`.
3. After GitHub Pages publishes, open the existing live URL and refresh twice while online. Service-worker cache changes to `church-notes-v1-0-phase5`.

## Bible API
- Provider: https://bible-api.com/ (public, no API key, browser CORS). Default `tagalog` is **Ang Dating Biblia (1905)**. Select KJV, WEB, ASV, BBE, BSB, Darby, DRA, OEB-US, WEBBE, or RV1909.
- Open a detected Bible reference in the notes editor or enter one in Bible Companion. The preview fetches the selected translation automatically on first lookup, without opening another app. Click **Copy verse + citation**, **Copy citation**, **Insert into note** (when a note is open), or **Create share card**.
- The Share Cards editor offers **Auto-fill from Bible API**; the existing Story (1080×1920) and Square (1080×1080) PNG exports remain.
- Fetched passages are cached in browser localStorage (up to 120 references per translation combination across all versions); previously retrieved passages work offline. The app does **not** download the full Bible. Cache is included in the JSON backup.
- Provider currently limits requests to **15 per 30 seconds per IP**. The API may be unavailable, and the initial lookup needs internet. See https://bible-api.com/ for current service rules. The API provider can see network request metadata, including IP and requested reference.
- Manual authorized excerpts, MCGI Digital Bible external link, version/source labels, and all previous features remain. API translation is separate from manual source labels. No official MCGI integration is claimed.
- The selected API's `translation_name` is shown in citation. Only public-domain versions from the provider's published catalog were selected for this release. Check local jurisdiction and attribution obligations before redistribution.

## Data and security
- Existing IndexedDB `church-notes` version 2 is preserved; no migrations or store deletion.
- Existing Phase 4 backup format remains schema 1 and is backwards compatible; new Phase 5 localStorage keys are optional when restoring old backups.
- Backups are unencrypted JSON; store them securely. Restore replaces local data only after confirmation. No accounts or automatic cloud sync.
- Rich-text formatting still uses browser `execCommand`; a full editor migration is deferred to avoid risking saved content during this final compatibility release.

## Final acceptance checklist
1. Confirm all existing notes, bookmarks, categories, and Bible excerpts are present.
2. In a note type `Juan 3:16`, click the reference. With internet, confirm Ang Dating Biblia (1905) text and attribution load.
3. Switch to KJV and confirm the verse text changes. Copy citation and insert a verse into a disposable note; confirm autosave.
4. Open Bible Companion, enter `1 Timoteo 3:15`, click reference, and verify the selected API translation.
5. Go offline and reopen a **previously fetched** reference; confirm cached verse appears. Confirm an **uncached** reference shows a clear offline error.
6. Create both Story and Square PNG share cards using **Auto-fill from Bible API**; confirm dimensions.
7. Export a new Phase 5 backup; verify it includes `cn-phase5-api-version` and `cn-phase5-api-verse-cache` under `localStorage`. Test restore with disposable notes only.
8. Verify search, calendar, bookmarks, themes, autosave, offline PWA, and Windows/Android installed app behavior.
9. Inspect browser Console for uncaught errors. Do not mark final release approved until all tests pass.

## Install
- Windows Chrome/Edge: open the live URL; use the Install icon in the address bar or browser menu > Install Church Notes (when offered).
- Android Chrome: open the live URL; browser menu > Install app or Add to Home screen (when offered).
- Installation is per device. To transfer notes, export on one device and restore on the other. This replaces destination local data.

## Verification performed for package
JavaScript syntax checks, Node-based mocked API response/cache/version tests, archive integrity, and file inventory. **Not performed:** live GitHub Pages deployment, browser end-to-end tests, live network fetch from the build container, Windows/Android device installation. These require user verification.
