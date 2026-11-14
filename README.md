# MCGI Notes v1.2 — Complete production update

Upload all root-level files to the existing `church-notes-pwa` GitHub Pages repository. Export a JSON backup first. Do not clear site storage.

## Changes
- Bible Verse Card preview appears first on Home; search/version/size/font/theme controls follow.
- Card canvas renders reference, then Bible version, then verse body, then optional `#MCGIKnows` footer. No API provider source is printed on cards.
- Splash animation opens a stylized Bible and reveals the user-supplied MCGI Notes logo once per page launch. Honors reduced motion.
- Preserves IndexedDB and existing application routes, notes, Bible lookups, backups, and settings.

## Acceptance tests
1. Backup first, upload all files and refresh twice online.
2. Verify Home card preview at top; search ADB and KJV verses.
3. Verify reference > version > body in preview and exported PNG.
4. Verify card size/font/theme dropdowns and `#MCGIKnows` footer.
5. Verify splash on launch and no splash during internal navigation; reduced-motion.
6. Verify notes, inline suggestions, settings, offline mode, and backup.

No data migration or staging. Browser acceptance testing remains required.


## UI correction (November 14, 2026)
- Verse card preview first; two compact control rows (search/version, size/font/theme); footer toggle and actions aligned.
- Exact user-supplied logo with transparent margins trimmed only, centered with contain fit.
- Bible reference then version then verse body, optional #MCGIKnows footer.
- Cache key bumped; no database schema or backup changes.
