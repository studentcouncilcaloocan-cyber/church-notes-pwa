# Church Notes PWA — Phase 1 Foundation

This is a complete **Phase 1 only** static PWA build, not a completed notes editor.

## Included
- Responsive desktop sidebar and mobile drawer
- Light, dark and system-adaptive theme
- Seven planned navigation screens
- Installable web manifest and local icon assets
- Offline app shell service worker
- IndexedDB database with `notes`, `categories`, `settings`, `bibleVersions` stores
- No login, backend, cloud synchronization, or external dependencies

## Run and install
A service worker requires HTTPS or localhost. Opening `index.html` via `file://` will **not** enable offline installation.

**Browser-first deployment:** Create a Firebase Hosting site (Spark plan), upload/deploy these exact static files as the Hosting public directory. Firebase Hosting cannot deploy a ZIP through its browser console alone; use Firebase CLI or GitHub Actions to deploy.

**Local test:** With Python installed, open a terminal in this folder and run `python -m http.server 8080`, then visit `http://localhost:8080`. For install testing, use Chrome's install option where supported.

**GitHub Pages alternative:** Upload these files to a GitHub repository, enable Pages from the root of its publishing branch, and open the resulting HTTPS URL. This is suitable for testing without Firebase CLI. Note that Pages on a public repository exposes app source code, but **not** your locally stored notes.

## Phase 1 acceptance tests
1. Open site on desktop and navigate through all seven screens.
2. Resize to mobile; hamburger drawer opens, links navigate, overlay and Escape close it.
3. Change theme in Settings, reload, verify preference persists.
4. In DevTools > Application > IndexedDB verify `church-notes` stores exist.
5. In DevTools > Application > Service Workers verify registration.
6. Load site once online, then use DevTools > Network > Offline and reload. Shell should still load.
7. On supported Chrome/Android browsers, use Install App or browser installation menu.

## Boundaries
Notes editor, autosave, search, categories management, Bible data, MCGI links, verse share card PNG export, backup/restore and security hardening are not implemented in Phase 1. There is no "SCRIPTURE VERSE" heading in the planned share-card design.

## Important
Do not store important church notes in this Phase 1 foundation. Keep your original notes elsewhere until Phase 2 is complete and verified.
