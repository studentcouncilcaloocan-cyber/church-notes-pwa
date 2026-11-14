# MCGI Notes v1.5.3 — Words of Wisdom review candidate

Includes v1.5.2 Verse of the Day layout fix and new Words of Wisdom horizontal carousel, title search, playlist tabs, and in-app YouTube playback. Existing IndexedDB notes and offline Bible code are retained.

## Important: catalog not yet populated
`videos.json` contains two playlist records with empty video arrays. The video extraction cannot be verified in the build environment because YouTube network access and yt-dlp are unavailable. **Do not deploy this candidate as a completed video catalog.** The playlist iframe remains functional when YouTube permits embedding, even without catalog metadata.

## Automated refresh
Upload all ZIP contents, including `.github/workflows/update-wisdom-catalog.yml` and `scripts/update-wisdom-catalog.py`, to a **review branch first**. On that branch, manually trigger the `Update Words of Wisdom catalog` GitHub Action. The workflow installs yt-dlp and extracts both playlists, preserving the existing catalog on failure. Check the Action logs and `videos.json` before any merge into main. Scheduled runs only operate on the default branch once approved and merged. GitHub Actions requires workflow write permission (`Settings > Actions > General > Workflow permissions > Read and write permissions`) for automatic commits; if blocked, adjust permissions with repository owner approval.

The video catalog does not cache actual videos; internet is required for playback. Autoplay with sound may be blocked by browsers or YouTube. Some videos may prohibit embedding.


## Words of Wisdom catalog activation

The first catalog is empty until GitHub Actions successfully runs `Update Words of Wisdom catalog`. In GitHub: Actions > Update Words of Wisdom catalog > Run workflow. After it commits videos.json, refresh the website. Future daily updates run automatically. The workflow needs GitHub Actions write permissions and access to YouTube. YouTube may restrict extraction or autoplay; these cannot be guaranteed.
