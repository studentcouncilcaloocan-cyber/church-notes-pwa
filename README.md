# MCGI Notes v1.1 — UI and navigation update

Complete root-level GitHub Pages upload package (12 files). No staging.

- Renamed display name and install manifest to MCGI Notes.
- Moved Bible Verse Share Cards to Home.
- Moved automatic Bible API translation and Bible preferences to Settings.
- Removed Bible Companion from navigation.
- Replaced below-editor detected reference panel with a contextual suggestion popup at the caret.
- Preserved IndexedDB name `church-notes`, schema version 2, localStorage preference keys and backup format to protect existing data.
- Preserved current GitHub Pages URL, service worker scope, and API integrations.

Before upload: export a JSON backup. Upload all 12 files to the root of the existing `main` branch and commit. Refresh online twice after Pages deployment. Verify ADB/KJV, inline popup, share card and backups on both desktop and mobile.

Important: browser `document.execCommand` is legacy. JSON backups are not encrypted. API lookup requires connectivity on first use; cached verses can be used offline.
