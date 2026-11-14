# MCGI Notes v1.5.2 — Bible Verse Card layout correction

Changes from v1.5.1:
- "Bible Verse Card" is now a standalone heading outside the white card container, like "Recent notes".
- Inside the white container, the order is Verse of the Day, date, true-aspect 9:16/1:1 card preview, then search/version/size/font/theme and remaining controls.
- Preserves IndexedDB, offline Bible, existing Words of Wisdom playlist player, and all other files.

Important: Individual Words of Wisdom video metadata carousel is not implemented in this release. The existing embedded YouTube playlist controls remain available. Playback requires internet and browser autoplay policies apply.

Deploy by uploading all files at the ZIP root to the existing GitHub Pages repository root, only after making a JSON backup of your notes. No IndexedDB data migration or reset is performed.
