# MCGI Notes v1.5.1 — UI & Bible update

Based on v1.5.0. Includes movable/resizable manual floating YouTube player, dismissible Bible popup, desktop logo adjustment, centered Verse of the Day heading, standalone correctly proportioned story/square card preview, official MCGI Google events calendar embed, revised page descriptions, and unified offline Bible search/reader.

The calendar uses the Google Calendar embed linked on https://mcgi.org/event-calendar/ (Asia/Manila). Facebook link is provided for announcements. Events are not invented or cached offline. YouTube and Google Calendar need internet.

Deploy all files to the existing GitHub Pages repository root. Export a JSON backup first. No IndexedDB schema changes.

Words of Wisdom: two supplied YouTube playlists are embedded for in-app viewing, with a responsive video player and playlist selector. Playlist-name filtering is available. Individual video title search is NOT implemented because YouTube playlist metadata is unavailable without a supported API/verified metadata source. Playback depends on YouTube embed permissions and internet access.
