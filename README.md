# MCGI Notes v1.3 — Direct Update

Upload all files in this ZIP to the root of the existing `church-notes-pwa` GitHub repository on `main`. Export a JSON backup first. Keep the same GitHub Pages URL and browser profile to retain IndexedDB data.

Changes:
- Favicon and 192/512 PWA icons use the user's supplied MCGI Notes logo, centered with safe margins.
- Inline suggestion Insert Verse replaces the exact typed reference in place with localized reference + retrieved verse text, preserving surrounding rich-text content and avoiding duplicate paragraphs.
- If lookup fails or the text changes during retrieval, original text remains unchanged.
- New cache version refreshes PWA assets.

Tests required on desktop and mobile: reference alone; reference mid-sentence; bold/italic neighboring text; ADB/KJV; offline cached lookup; failed lookup; autosave and reload; icon after PWA refresh.

No IndexedDB schema changes, no new hosting or staging.
