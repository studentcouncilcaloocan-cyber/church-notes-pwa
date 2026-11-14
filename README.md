# Church Notes Phase 4 — Direct Update

Upload all 11 files to the **existing** `studentcouncilcaloocan-cyber/church-notes-pwa` repository root. Do not create a staging repository, delete existing files, clear site data, or reinstall the PWA. New file: `backup.js`.

## Features
- Backup & Restore screen with portable JSON export of all four IndexedDB stores (`notes`, `categories`, `settings`, `bibleVersions`) and Phase 3 localStorage data (verse excerpts, version labels, card templates, preferences, theme).
- Restore validates schema, duplicate IDs, note/category relationships, data types, JSON settings, and 20 MB file limit before showing confirmation. Restore overwrites current device data. IndexedDB writes are atomic; localStorage failure triggers a best-effort rollback.
- No server, no sync, no encryption. Keep backups private and outside browser storage.
- Existing Phase 1–3 features retained.

## Tests
1. After upload, verify existing notes and Bible Companion work.
2. Create disposable sample note, category, bookmark, authorized excerpt, and card template.
3. Export backup; check a `.json` file is downloaded.
4. Try invalid JSON and verify restore is rejected without changing notes.
5. Validate the good backup, confirm replacement; verify data after reload.
6. Offline: export backup, refresh, edit notes and download verse card.
7. Mobile: verify Backup & Restore screen and navigation.
8. Inspect console for errors; test new and existing notes and themes.

## Important limitations
- Existing browser-native `execCommand` editor remains; replacing it is not included in this phase.
- Browser storage is device/browser-profile local. Backup JSON contains potentially sensitive notes and is unencrypted.
- Restore is **replace**, not merge. In case of power loss between IndexedDB and localStorage operations, recovery is not fully atomic across both systems.
- There are no official MCGI Bible API or licensed verse datasets bundled.
- Syntax and package integrity checked, not live-browser end-to-end tested.


## Hotfix 3: ADB translation mismatch
- ADB 1905 uses the getBible Tagalog endpoint directly rather than accepting English content from the generic API.
- ADB responses must pass a conservative Tagalog-language sanity check before display or caching. Some legitimate very short verses may be rejected; manual excerpts remain available.
- Uses a new Bible API cache namespace to avoid previously mislabeled English passages; existing notes and backups remain untouched.
- Other translation lookups still use bible-api.com.
- This does not establish that the external provider is reliable or authorized for all uses. Verify live response and rights before sharing.
