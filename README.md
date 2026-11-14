# MCGI Notes v1.3.2 — Final Logo Assignments

**Source:** MCGI Notes v1.3.1 complete working package.

- Opening animation uses the exact user-supplied **transparent** MCGI Notes logo in `mcgi-notes-logo.png` over the existing navy background.
- Browser favicons, Apple touch icon, PWA icons and `icon.svg` use the user-supplied **blue-background** MCGI Notes artwork, scaled proportionally and with safe margins.
- `index.html` updates favicon/touch-icon references; `sw.js` refreshes the PWA cache and precaches the touch icon.
- All other application JavaScript, Bible API, rich-text editor, backup, settings, and styles are preserved from v1.3.1. No database migration.

## Direct GitHub Pages update
1. Export a full JSON backup from MCGI Notes before uploading.
2. Extract ZIP, then upload **all 17 files** (not the ZIP) to the root of `studentcouncilcaloocan-cyber/church-notes-pwa` on `main`.
3. Commit as `Fix final MCGI Notes splash and app icons`.
4. Wait for GitHub Pages deployment; open the PWA while online, refresh twice, then close/reopen. Some OS-installed icons can remain cached; reinstalling may be necessary **only after backing up** and checking data safety. Do not clear site data.

Verify desktop and mobile splash logo, browser favicon, installed app icon, note data, Bible lookup, share cards, offline loading, and backup.


## v1.3.3 Home rendering correction
- Constructs the Welcome heading and Create Note button as one stable Home section before Bible card initialization.
- Makes the Home heading/button independent of Bible Companion errors.
- Responsive mobile layout with full-width Create Note button.
- Adds cache-busting version query parameters and network-first service worker behavior for page navigation and versioned assets; offline fallback retained.
- IndexedDB schema, app data, backup format, and Bible lookup logic unchanged.
- Export JSON backup before uploading. Do not clear browser site data or uninstall.
