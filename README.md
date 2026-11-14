# MCGI Notes v1.5.0 — UI refinement and floating player

This is the full GitHub Pages root package, based on v1.4.9. Upload the **contents** of this folder to the existing repository root, not the folder itself.

Changes: proportional welcome brand logo; consistent SVG outline icons for navigation, note actions, and category actions; dialog close button moved to a separate header row; daily verse label aligned with card heading; standalone shadowed verse canvas; user-controlled floating Songs of Faith / Community Prayer player. The player starts muted because browsers commonly prohibit unmuted autoplay. Click inside the video to enable sound. Floating player is limited to this app's pages and requires internet. Opening another stream replaces the previous stream.

Existing IndexedDB schema, backup modules, Bible library, and PWA manifest are unchanged. Before deploying, export a JSON backup. No data reset is needed.

Verification: static JavaScript syntax and ZIP integrity; actual mobile keyboard, YouTube embedding, autoplay and playback persistence require device/browser tests.
