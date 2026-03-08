# Anime Collection

This directory contains anime entries synced from AniList.

## Syncing Data

Run the following command to sync your anime list from AniList:

```bash
npx ts-node tools/sync-anilist.ts --anime --username YOUR_USERNAME
```

Or sync both anime and manga:

```bash
npx ts-node tools/sync-anilist.ts --all --username YOUR_USERNAME
```

## File Structure

Each anime entry is stored as a YAML file with the following structure:

```yaml
id: 12345 # List entry ID
mediaId: 67890 # AniList media ID
status: COMPLETED # CURRENT, PLANNING, COMPLETED, DROPPED, PAUSED, REPEATING
score: 8.5 # Your rating (0-10)
progress: 12 # Episodes watched
updatedAt: 1703318400 # Unix timestamp
createdAt: 1703232000 # Unix timestamp

title:
  romaji: 'Anime Title'
  english: 'English Title'
  native: '日本語タイトル'
  userPreferred: 'Preferred Title'

description: 'Synopsis...'
coverImage:
  extraLarge: 'https://...'
  large: 'https://...'
  medium: 'https://...'
  color: '#hex'

episodes: 12
chapters: null
volumes: null
format: TV
mediaStatus: FINISHED
siteUrl: 'https://anilist.co/anime/...'

# Custom fields you can edit
customNote: 'Your personal notes'
customTags: ['favorite', 'rewatch']
featured: false
```

## Custom Entries

You can manually create YAML files following the same structure to add custom entries
that aren't in your AniList account.
