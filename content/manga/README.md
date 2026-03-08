# Manga Collection

This directory contains manga entries synced from AniList.

## Syncing Data

Run the following command to sync your manga list from AniList:

```bash
npx ts-node tools/sync-anilist.ts --manga --username YOUR_USERNAME
```

Or sync both anime and manga:

```bash
npx ts-node tools/sync-anilist.ts --all --username YOUR_USERNAME
```

## File Structure

Each manga entry is stored as a YAML file with the following structure:

```yaml
id: 12345 # List entry ID
mediaId: 67890 # AniList media ID
status: COMPLETED # CURRENT, PLANNING, COMPLETED, DROPPED, PAUSED, REPEATING
score: 9.0 # Your rating (0-10)
progress: 150 # Chapters read
updatedAt: 1703318400 # Unix timestamp
createdAt: 1703232000 # Unix timestamp

title:
  romaji: 'Manga Title'
  english: 'English Title'
  native: '日本語タイトル'
  userPreferred: 'Preferred Title'

description: 'Synopsis...'
coverImage:
  extraLarge: 'https://...'
  large: 'https://...'
  medium: 'https://...'
  color: '#hex'

episodes: null
chapters: 200
volumes: 20
format: MANGA
mediaStatus: FINISHED
siteUrl: 'https://anilist.co/manga/...'

# Custom fields you can edit
customNote: 'Your personal notes'
customTags: ['favorite', 'reread']
featured: false
```

## Custom Entries

You can manually create YAML files following the same structure to add custom entries
that aren't in your AniList account.
