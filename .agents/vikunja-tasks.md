# Vikunja task format

Every task in Vikunja project `HOME-NEXT` uses the same shape so the board
reads uniformly. Create and edit tasks only through the `veans` CLI.

Vikunja's quick-add magic (`*label`, `!3`, `@user`, `+project`, dates,
`every 2 weeks`) is parsed by the web UI only. The REST API that `veans` uses
stores those tokens as literal title text, so never put them in a title. Set
each property with its `veans` flag instead.

## Command shape

Always pass the parts in this order:

```bash
veans create "<title>" \
  --priority <1-5> \
  --label <type> --label <area> [--label <flag> ...] \
  -d '<ul><li>...</li><li>...</li></ul>'
```

Add `-s in-progress` only when you start the work immediately.

| Part     | Flag         | Rule                                                                 |
| -------- | ------------ | -------------------------------------------------------------------- |
| Title    | positional   | Brief, plaintext, lowercase, imperative, at most about 70 characters |
| Priority | `--priority` | Required, `1` to `5` (scale below)                                   |
| Labels   | `--label`    | At least one; lowercase; follow `.agents/vikunja-labels.md`          |
| Body     | `-d`         | HTML bullet list only (rules below)                                  |

Properties `veans` cannot set are intentionally omitted: due date, repeat
interval, assignees, and project. The project comes from `.veans.yml`, and
`veans claim` assigns the bot.

## Dates

Do not encode dates in the title or body. Vikunja records them itself:

- `created` is the creation date;
- `done_at` is the completion date, set when a human or the merge hook closes
  the task.

## Priority scale

| Value | Meaning                                                     |
| ----- | ----------------------------------------------------------- |
| `1`   | Low: nice to have, no user impact                           |
| `2`   | Normal: planned improvement or minor defect (default)       |
| `3`   | High: visible bug or broken feature on one route            |
| `4`   | Urgent: broken build, broken deploy, or several routes down |
| `5`   | Do now: site down, leaked secret, or security issue         |

## Title

- Plaintext only: no HTML, Markdown, or quick-add tokens.
- Lowercase, matching the repository's commit-subject style.
- Describe the outcome, not the steps: `fix toc collapsing after navigation`,
  not `look into toc`.

## Body

The description is HTML because Vikunja's editor renders HTML. Markdown is
stored as literal text.

- Use exactly one flat `<ul>` of `<li>` items.
- One fact per bullet. Order the bullets: goal or problem, scope (routes or
  files), acceptance criteria, notes.
- Inline `<code>`, `<strong>`, `<em>`, and `<a href>` are allowed inside a
  bullet.
- Never use a separator: no Markdown `---` and no `<hr>`.
- No headings, paragraphs, or task-list checkboxes (`data-type="taskList"`).
  Record progress and decisions as comments with `veans update <ID> --comment`.
- Escape literal `<`, `>`, and `&` as `&lt;`, `&gt;`, and `&amp;`.

To add a bullet later, replace the closing tag so the list stays a single
`<ul>`:

```bash
veans update HOME-NEXT-12 \
  --description-replace-old '</li></ul>' \
  --description-replace-new '</li><li>new fact</li></ul>'
```

## Updating a task

| Change   | Command                                                            |
| -------- | ------------------------------------------------------------------ |
| Title    | `veans update <ID> -t "<new title>"`                               |
| Priority | `veans update <ID> --priority <1-5>`                               |
| Labels   | `veans update <ID> --label-add <name> --label-remove veans:<name>` |
| Status   | `veans update <ID> -s in-progress \| in-review`                    |
| Scrap    | `veans update <ID> -s scrapped --reason "..." --label-add wontfix` |

Agents never move a task to `completed`; that sets `done_at` and belongs to a
human or the merge hook.

## Example

```bash
veans create "fix album grid overflowing on phones" \
  --priority 3 \
  --label bug --label area:gallery --label responsive \
  -d '<ul><li>The album grid scrolls horizontally below 400px wide.</li><li>Scope: <code>src/app/album/components/gallery-image-grid.tsx</code>.</li><li>Done when there is no horizontal overflow at 320px, 375px, and 768px.</li><li>Started after the masonry collection rename.</li></ul>'
```
