# Vikunja task labels

Tasks for this repository live in Vikunja project `HOME-NEXT` and are managed
with the `veans` CLI. Labels mirror GitHub issue labels. `veans` prepends the
`veans:` namespace automatically, so pass the short name:

```bash
veans create "fix toc collapsing on scroll" --priority 2 --label bug --label area:blog
veans update HOME-NEXT-12 --label-add responsive
```

The full task shape (title, priority, body) is defined in
`.agents/vikunja-tasks.md`. This file only decides which labels to pass.

All labels below already exist in Vikunja. Do not invent new labels; if none
fits, use the closest one and say why in the description.

## Rules when creating a task

Every task gets:

1. **Exactly one type label.** It matches the conventional-commit type the
   work will be committed under.
2. **One area label** for the part of the site it touches. Use two only when
   the change genuinely spans both (for example a Velite schema change plus
   the route that renders it). Use none only for purely repository-wide work.
3. **Any flag labels that apply.** Zero is normal.

Use Vikunja's built-in **priority** (`--priority 1..5`) instead of priority
labels. Use `--blocked-by` relations instead of a "blocked" label. Branch
labels (`veans:branch:*`) are added by `veans claim`; never add them by hand.

## Type labels (exactly one)

| Label           | Use when                                                                | Commit type      |
| --------------- | ----------------------------------------------------------------------- | ---------------- |
| `bug`           | Something is broken or behaves incorrectly                              | `fix`            |
| `enhancement`   | A new feature or user-visible improvement                               | `feat`           |
| `refactor`      | Restructuring with no change in behavior or appearance                  | `refactor`       |
| `style`         | Visual polish only: spacing, typography, color, motion                  | `style`          |
| `performance`   | Bundle size, render cost, image weight, load time                       | `perf`           |
| `documentation` | `AGENTS.md`, `README.md`, `DESIGN.md`, code comments                    | `docs`           |
| `test`          | Adding or fixing tests with no production change                        | `test`           |
| `chore`         | Maintenance, CI, build config, scripts                                  | `chore` / `ci`   |
| `dependencies`  | Adding, upgrading, or removing a package                                | `chore(deps)`    |
| `content`       | Writing or data only: posts, TIL, journey stops, photos, `uses` entries | `chore(content)` |

Tie-breakers:

- A visual regression is a `bug` (add `regression`), not `style`.
- A refactor that also changes behavior is the behavior change (`bug` or
  `enhancement`); mention the refactor in the description.
- Adding a new content _field or collection_ is `enhancement` +
  `area:content-pipeline`; filling in entries is `content`.

## Area labels (usually one)

| Label                   | Covers                                                                                             |
| ----------------------- | -------------------------------------------------------------------------------------------------- |
| `area:home`             | `/` landing page: `src/app/_components/grid` and its cards (ticket printer, music, stats cards)    |
| `area:blog`             | `/blog`, posts, TIL, TOC, post list, MDX rendering components                                      |
| `area:gallery`          | `/album`, `/mansory`, image lightbox, `src/components/gallery`                                     |
| `area:journey`          | `/journey` globe map and `content/journey` locations                                               |
| `area:library`          | `/library` (anime, manga, books, games, courses) and `tools/sync-*`                                |
| `area:music`            | `/songs`, `src/lib/api/lastfm`, the Last.fm worker in `workers/`                                   |
| `area:projects`         | `/projects`, `/repos`, `src/lib/api/github`, LeetCode and Wakapi stats, heatmap                    |
| `area:pages`            | Small standalone routes: about, uses, room, friends, guestbook, donation, sitemap                  |
| `area:layout`           | Global shell: root layout, header, kbar, transitions, fonts, `src/styles`, `src/components/ui`     |
| `area:content-pipeline` | `velite.config.ts`, `content/collections`, content schemas, MDX/rehype plugins in `content/plugin` |
| `area:tooling`          | `tools/`, `next.config.js`, `.github` workflows, lint/test/build setup, `.agents`, `.veans.yml`    |

## Flag labels (zero or more)

| Label           | Add when                                                                                                 |
| --------------- | -------------------------------------------------------------------------------------------------------- |
| `regression`    | It used to work and broke                                                                                |
| `breaking`      | Changes URLs, routes, content schema, or other public behavior                                           |
| `static-export` | Touches `output: 'export'`, `generateStaticParams`, or needs `out/` verification                         |
| `external-api`  | Depends on a third-party service (GitHub, Last.fm, Wakapi, AniList, Hardcover, Steam, LeetCode, Discord) |
| `accessibility` | Keyboard, focus, screen reader, contrast, or reduced-motion work                                         |
| `responsive`    | Phone/tablet layout, horizontal overflow, clipped controls                                               |
| `security`      | Secrets, CSP, unsafe HTML, vulnerable dependencies                                                       |

## Resolution labels (only when scrapping)

Add one together with `veans update <ID> -s scrapped --reason "..."`:

| Label       | Meaning                                      |
| ----------- | -------------------------------------------- |
| `duplicate` | Already tracked; reference the other task ID |
| `wontfix`   | Intentionally not doing this                 |
| `invalid`   | Not reproducible, or the premise was wrong   |

## Examples

The `-d` body is omitted here for brevity; real tasks always include one.

```bash
# Music card shows the wrong track after Last.fm returns an empty response
veans create "fix music card keeping stale track on empty last.fm response" \
  --priority 3 --label bug --label area:home --label external-api

# Add a "location" field to journey entries and show it on the globe
veans create "add location field to journey entries" \
  --priority 2 --label enhancement --label area:content-pipeline --label area:journey

# Gallery grid overflows horizontally on phones
veans create "fix album grid overflowing on phones" \
  --priority 3 --label bug --label area:gallery --label responsive

# Rename the mansory route to masonry
veans create "rename /mansory route to /masonry" \
  --priority 2 --label refactor --label area:gallery --label breaking --label static-export

# Upgrade Next.js
veans create "upgrade next to latest minor" \
  --priority 2 --label dependencies --label area:tooling --label static-export

# Publish a new blog post
veans create "write post about kintaro onsen trip" \
  --priority 1 --label content --label area:blog
```
