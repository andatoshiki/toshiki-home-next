# Design System and Visual Direction

- Status: Living reference
- Last reviewed: 2026-09-13
- Applies to: The entire website

## 1. Purpose

This document defines the visual and interaction direction for the site. It is
the design counterpart to `AGENTS.md`: contributors should use it when creating,
reviewing, or refactoring any user-facing interface.

The current site contains a strong core design, but it also contains several
styles inherited from experiments, copied features, and older implementations.
Existing code is therefore evidence, not automatic precedent. New work should
follow the canonical direction below instead of copying whichever nearby
component happens to look similar.

The goal is not to make every page identical. The goal is to make every page
feel like part of one product while preserving meaningful differences between
editorial content, data displays, galleries, and interactive experiences.

## 2. Canonical direction

The canonical design is a **quiet technical editorial portfolio with restrained
neutral surfaces and occasional playful feature moments**.

Its strongest existing examples are the shared page container and theme, the
main `Title`, the Blog article treatment, and the newer neutral cards used by
Uses, Songs, and Repositories. These areas share the qualities that should
define the whole product:

- content and hierarchy lead before decoration;
- a near-monochrome palette works in both light and dark themes;
- thin borders separate surfaces without making the page feel boxed in;
- typography is compact, legible, and purposeful;
- color communicates status, meaning, or brand identity;
- motion is subtle feedback rather than continuous spectacle;
- playful elements are contained so they do not redefine neighboring pages.

This direction should absorb the stronger parts of the dashboard, media-card,
and Home bento styles. Saturated link colors, large floating shadows, unrelated
pill systems, arbitrary gradients, and copied product-dashboard styling should
not become additional site-wide design languages.

## 3. Audit conclusion

The site does not lack a visual identity. It lacks consistent application of
the identity it already has.

Four visual languages currently overlap:

1. **Neutral editorial:** narrow content width, strong headings, restrained
   text colors, subtle dividers, and simple links. This is the canonical base.
2. **Product dashboard:** dense cards, tabs, badges, charts, and loading states.
   Keep the information patterns, but restyle them around the neutral base.
3. **Playful portfolio:** the Home bento grid, signature, status widgets, and
   ticket or receipt objects. Keep these as deliberate personality moments.
4. **Legacy or copied UI:** isolated blues, inconsistent shadows and radii,
   duplicate tooltip systems, route-specific controls, animated third-party
   skins, and one-off hard-coded colors. Redesign these rather than preserving
   them as a style.

The site will feel cohesive when the global shell, hierarchy, controls, surface
treatment, and interaction states remain stable while only the content canvas
changes from route to route.

## 4. Foundations

### 4.1 Color

The default palette is neutral. Use the existing theme variables or the
equivalent established neutral values for semantic roles.

| Role            | Light theme                    | Dark theme                     |
| --------------- | ------------------------------ | ------------------------------ |
| Page background | `neutral-50` / `background`    | `neutral-1000` / `background`  |
| Raised surface  | white / `card`                 | `neutral-950` / `card`         |
| Strong text     | `neutral-900` / `foreground`   | `neutral-100` / `foreground`   |
| Body text       | `neutral-600`                  | `neutral-400`                  |
| Supporting text | `neutral-500`                  | `neutral-500`                  |
| Border          | `neutral-200` / `border`       | `neutral-800` / `border`       |
| Hovered border  | `neutral-300`                  | `neutral-700`                  |
| Focus ring      | a clearly visible neutral ring | a clearly visible neutral ring |

Rules:

- Use one semantic role consistently; do not choose a shade independently for
  every component.
- Accent color must communicate status, category, brand, or a deliberate focal
  action. It is not general decoration.
- Blue is not the default link color. Inline links should use the editorial
  underline and contrast treatment unless blue has semantic meaning.
- Hard-coded hex, RGB, and HSL values belong only to brand assets, charts,
  maps, illustrations, or another documented exception.
- Status colors must retain the same meaning everywhere: green for success or
  active, amber for warning or pending, red for error or destructive, and blue
  for informational or geographic emphasis.
- Light and dark themes must preserve hierarchy, not merely invert colors.

The current duplication between direct neutral utilities and semantic CSS
variables should be consolidated gradually. Do not introduce a third color
system during that migration.

### 4.2 Typography

Use typography to make content scannable before adding containers or color.

- Inter is the product and reading typeface.
- Berkeley Mono is for code, technical identifiers, keyboard hints, and genuinely
  machine-like decorative objects.
- Caveat is reserved for the signature or a rare personal accent.
- Crimson Text does not currently have a clear product role. Do not introduce
  new serif usage until a specific editorial role is established; if it remains
  unused, it is a candidate for later removal.

Canonical hierarchy:

| Role            | Default treatment                                 |
| --------------- | ------------------------------------------------- |
| Page title      | `text-4xl`, semibold, tight leading, left aligned |
| Article title   | `text-4xl`, bold, readable line length            |
| Section title   | `text-2xl`, semibold or bold                      |
| Card title      | `text-sm` to `text-lg`, medium or semibold        |
| Body            | `text-base`, relaxed enough for reading           |
| Supporting text | `text-sm`, neutral secondary color                |
| Metadata        | `text-xs`, neutral secondary color                |
| Eyebrow label   | `text-xs`, medium, uppercase, modest tracking     |

Additional rules:

- Use `text-balance` for short display headings and `text-pretty` for
  descriptions where supported.
- Left-align route titles and content on all breakpoints. Centering is reserved
  for the Home hero, empty states, dialogs when appropriate, and explicitly
  composed showcase moments.
- Do not use functional text below 12 px. Smaller type is acceptable only as a
  nonessential detail inside a deliberate illustration such as a receipt.
- Use tabular numerals for comparable counts, dates, durations, and metrics.
- Avoid `text-justify`; it creates uneven spacing at narrow widths.
- Heading levels must describe document structure, not visual size.

### 4.3 Spacing and layout

The existing four-pixel Tailwind rhythm is the spacing base. Prefer established
steps over arbitrary values.

- `content-container` is the default page width: full width with 1 rem mobile
  padding and a maximum reading width of 52 rem.
- The root layout owns normal page top and bottom spacing through
  `content-vertical-spaces`. A page must not apply it again.
- Use 2 rem between a route header and its main content.
- Use 1.5 to 2 rem between related content groups.
- Use 4 to 5 rem between major narrative sections.
- Use 0.75 rem as the normal grid and compact-card gap; use 1.5 rem when cards
  need stronger visual separation.
- Prefer CSS grid and flexbox. Do not measure layout in JavaScript when CSS can
  express it.

Full-width or narrower experiences are allowed only when the content requires
them. Galleries may use a narrower photographic measure; maps and 3D canvases
may use the full content width. They should still align their headings and
supporting controls with the global page grid.

### 4.4 Shape and elevation

The current site uses too many interchangeable radii and shadow strengths. Use
shape to communicate component scale:

| Element                                  | Radius         |
| ---------------------------------------- | -------------- |
| Small control or inline element          | `rounded-md`   |
| Button, tab, input, or compact panel     | `rounded-lg`   |
| Standard content or media card           | `rounded-xl`   |
| Prominent card, dialog, or feature panel | `rounded-2xl`  |
| Avatar, status dot, badge, or true pill  | `rounded-full` |

`rounded-3xl` is reserved for an intentionally large immersive canvas. A card
should not become more important merely by receiving a larger radius.

Borders are the default method of separating surfaces. Shadows should be
subtle and infrequent:

- no shadow for ordinary inline and content surfaces;
- `shadow-sm` for a raised control or media card when needed;
- `shadow-lg` or `shadow-xl` only for overlays and dialogs;
- avoid applying a large shadow and vertical lift to every hoverable card.

### 4.5 Breakpoints and density

Use the default Tailwind breakpoints as the shared responsive vocabulary:

| Name | Width        | Intended use                                    |
| ---- | ------------ | ----------------------------------------------- |
| Base | below 640 px | Phone-first layout and touch interaction        |
| `sm` | 640 px       | Room for denser card grids and paired content   |
| `md` | 768 px       | Desktop-style alignment and expanded navigation |
| `lg` | 1024 px      | Wider grids and supporting side content         |

Add a custom breakpoint only when the content demonstrably breaks between these
steps. Do not use one-off media queries to patch a component whose internal
layout should reflow naturally.

The site supports two intentional density levels:

- **comfortable:** normal pages, prose, navigation cards, forms, and primary
  controls;
- **compact:** metadata, dashboards, tables, heatmaps, and dense media grids.

Compact does not mean tiny. Both densities use the same typography, target
sizes, color roles, and interaction states. Density should be set by the owning
section rather than changed unpredictably inside individual cards.

### 4.6 Layering

The current interface uses several unrelated large and arbitrary z-index values.
Use a small shared layer order so overlays remain predictable:

| Layer   | Intended content                                               |
| ------- | -------------------------------------------------------------- |
| Base    | Page content and decorative backgrounds                        |
| Raised  | Sticky section controls and local floating affordances         |
| Header  | Global navigation and its menus                                |
| Overlay | Scrims and full-screen interaction backdrops                   |
| Dialog  | Dialogs, command menu, lightbox content, and popovers          |
| Notice  | Time-sensitive toast or system notice that must remain visible |

Prefer named CSS variables or documented shared utilities when the layer is
used across routes. A route-local decorative effect must not rise above the
global header or an active dialog. Negative z-index content must remain purely
decorative and must never contain interaction or essential information.

### 4.7 Theme behavior

Light, dark, and system modes are equal presentations of one design system.

- Use the root theme class and shared color roles; do not maintain route-local
  theme state.
- Keep the browser `color-scheme` and theme color aligned with the rendered
  background.
- Avoid a flash of the wrong theme and avoid rendering theme-dependent text or
  geometry that changes during hydration.
- Light and dark image variants must use the same dimensions and composition so
  changing theme does not move content.
- Third-party interfaces should follow the selected theme when their APIs allow
  it without duplicating theme observers throughout the component tree.
- The theme control must expose the current selection, support the keyboard,
  and use clear labels for Light, Dark, and System.
- A theme may adjust contrast and imagery, but it must not change navigation,
  content order, available actions, or component identity.

## 5. Layout and hierarchy

### 5.1 Global shell

Every normal route should use the same page background, content alignment,
header, footer, and vertical rhythm. The shell must feel calm enough to support
both articles and visually rich features.

The compact signature-led header is a stronger base than maintaining multiple
navigation bars. Keep its calm silhouette, but make essential destinations
discoverable without prior shortcut knowledge. Standardize control sizes,
grouping, labels, focus states, and surface treatment. Remove obsolete header
presentations once their lack of consumers is proven.

The command menu may supplement navigation, but essential destinations must
remain understandable and keyboard accessible. A shortcut string is helpful
secondary text, not the accessible name of the menu action.

### 5.2 Page headers

`Title` is the canonical route-heading treatment. It should eventually support
the common title, description, and optional adjacent action without each route
rebuilding alignment.

Exceptions:

- Blog posts use an article-specific title and metadata composition.
- The Home hero uses its own display hierarchy.
- Media-first galleries may keep a visually hidden page heading when the
  gallery itself is intentionally the immediate visual entry point.

Tags, categories, Repositories, and other index pages should not keep unrelated
`h1` sizes and margins. Migrate them to the canonical page-header contract.

### 5.3 Content hierarchy

Use this order where applicable:

```text
page title
  supporting description or metadata
  primary controls or filters
  content sections
    section title
    cards list or prose
  empty error or loading state
```

Do not use extra cards, pills, or headings when spacing and typography already
express the relationship.

### 5.4 Navigation and location

Navigation should make the site's breadth discoverable without forcing visitors
to understand a command palette.

- Keep the same essential destinations available on phone and desktop, even if
  their presentation changes.
- Show an active state when the visitor is inside a major section.
- Use Next.js links for internal navigation and ordinary anchors for external
  destinations or downloadable resources.
- Preserve browser expectations such as opening links in a new tab, copying a
  destination, and using back and forward navigation.
- Reflect meaningful filters, selected categories, pagination, and other
  shareable views in the URL.
- Deep routes should provide enough context through the title, metadata,
  breadcrumbs, or nearby navigation to explain where the visitor is.
- Pagination uses clear Previous and Next labels, identifies the current page,
  and does not present unavailable directions as active controls.
- A table of contents supplements article structure and must not obscure the
  document or focused headings at any viewport.

## 6. Component language

### 6.1 Cards

Cards may vary by content, but they should inherit one surface language.

Canonical standard card:

```text
rounded-xl or rounded-2xl
1 px neutral border
white light surface / neutral-950 dark surface
clear title and secondary text
subtle border or background hover
visible focus ring when interactive
```

Supported card families:

- **Navigation card:** icon, title, two-line description, entire surface links.
- **Data card:** label, prominent value, supporting context, no decorative lift.
- **Media card:** image-led ratio, concise metadata, optional semantic badge.
- **Showcase card:** an explicitly playful or immersive object used sparingly.

`PagesCard` and `BlockCard` currently duplicate the same navigation-card
language. Consolidate them around one implementation rather than maintaining
parallel APIs. Project, Library, Uses, Songs, Repositories, and statistics cards
should then adopt the appropriate family instead of inventing another base
surface.

### 6.2 Buttons and icon controls

Use a small shared set of visual roles once reuse exists:

- primary: high-contrast filled action;
- secondary: quiet filled or bordered action;
- ghost: text or icon action on a transparent surface;
- destructive: red only for an irreversible or dangerous action;
- icon: square control with an accessible name and tooltip when helpful.

All controls must:

- use a semantic `button` for actions and a link for navigation;
- have a minimum practical touch target of 44 by 44 px;
- have hover, active, disabled, and `focus-visible` states;
- increase contrast on interaction rather than becoming less visible;
- avoid nesting one pill-shaped container around another button;
- use a specific accessible label such as “Open menu” or “Change theme.”

### 6.3 Links

- Inline prose links use the Blog article underline treatment.
- Standalone navigation links may use a subtle background hover and an external
  arrow when leaving the site.
- Do not mix blue, underline-only, pill, opacity-only, and filled-button link
  styles within the same hierarchy.
- External links use `target="_blank"` only when opening a new context is useful
  and always include `rel="noopener noreferrer"`.

### 6.4 Tabs and filters

Uses, Journey, and Library currently implement similar segmented controls with
different radii, spacing, icons, and transitions. They should converge on one
control recipe while retaining route-owned data and behavior.

- use `rounded-lg` segments by default;
- use one selected treatment: strong neutral fill and inverse text;
- use one unselected treatment: quiet neutral fill and secondary text;
- use pills only when the content is truly a compact status or filter chip;
- keep icons optional and use the same size when present;
- expose selection semantics with tabs or pressed buttons as appropriate;
- wrap or horizontally scroll without clipping on phones;
- reflect durable or shareable state in the URL when it materially changes the
  presented content.

### 6.5 Badges and status

Badges are compact metadata, not miniature buttons.

- Use consistent height, padding, type size, and radius.
- Color only semantic badges; ordinary tags stay neutral.
- Pair color with text or an icon so color is never the only signal.
- Keep labels concise and do not crowd cards with every available field.

### 6.6 Icons

Phosphor is the canonical interface icon family. Use its regular or duotone
weights consistently for navigation and controls.

Other icon sources are justified for technology logos, service marks, or an
existing asset unavailable in Phosphor. Do not mix icon libraries within one
control group. Decorative icons should be hidden from assistive technology;
meaningful icon-only controls require accessible names.

### 6.7 Tooltips and overlays

Use the accessible Radix tooltip and dialog foundations already in the project.
The handwritten `.tooltip` CSS and the separate menu-only tooltip presentation
represent competing systems and should be consolidated.

- Tooltips explain unfamiliar icons or shortcuts; they do not contain required
  instructions.
- Dialogs use a backdrop, a clear title, an accessible description where
  relevant, a visible close control, and restrained overlay motion.
- Dialog and drawer scroll must remain contained on touch devices.
- Overlay surfaces may use stronger elevation than ordinary cards.

### 6.8 Forms and inputs

Guestbook comments, search, selectors, and future forms should share one input
language rather than inherit an external library's defaults.

- Every control has a visible label or an accessible name. Placeholder text is
  supporting guidance, not a label.
- Labels and their controls share one click or tap target where applicable.
- Use the correct input type, input mode, name, and autocomplete value.
- Use `rounded-lg`, a neutral border, the page surface color, and the standard
  focus ring.
- Keep control text at least `text-sm` and primary input targets at least 44 px
  high on touch layouts.
- Show validation beside the affected field and focus the first invalid field
  after submission.
- Preserve pasted content and browser autofill. Do not block paste or password
  managers without a specific security reason.
- Keep the submit action available until submission starts, then communicate
  progress without replacing the button with an unexplained spinner.
- Warn before discarding meaningful unsaved input.
- Use native controls when they satisfy the interaction. A custom selector must
  reproduce keyboard navigation, focus, selected state, and dismissal behavior.

### 6.9 Charts heatmaps and metrics

Data visualization must explain information rather than decorate a dashboard.

- Give every chart a visible title or nearby label that states what is being
  measured and over what period.
- Use a small intentional palette. Do not generate a rainbow merely because a
  series can have a unique color.
- Never make color the only distinction; pair it with labels, ordering, shape,
  texture, or an accessible summary.
- Preserve sufficient contrast for marks, grid lines, axes, and tooltip text in
  both themes.
- Format numbers, dates, durations, and percentages consistently with `Intl`
  formatters or an established shared formatter.
- Use tabular numerals in aligned values and avoid false precision.
- Tooltips must supplement information that is also reachable without precise
  pointer hover. Provide a text summary or table when the graphic communicates
  important data.
- Keep axis labels and legends readable at phone widths. Reduce detail or allow
  intentional horizontal scrolling instead of shrinking text below 12 px.
- Loading, empty, partial, stale, and error states retain the chart's context so
  users know which data is unavailable.
- A prominent number should include its unit and timeframe; a naked metric is
  not meaningful hierarchy.

### 6.10 Images video and galleries

Media should feel deliberately art-directed and should not cause layout shift.

- Provide intrinsic dimensions or a stable aspect ratio for every image and
  video.
- Use one crop rule within a repeated collection. Use `object-cover` for
  editorial thumbnails and `object-contain` for products, logos, or objects
  whose full silhouette matters.
- Reserve eager loading or priority for genuinely above-the-fold media. Lazy
  load noncritical media.
- Write alternative text for the image's purpose in context. Use empty
  alternative text for decoration and avoid repeating a nearby caption.
- Captions use the metadata style and remain associated with their figure.
- Lightboxes preserve the source ratio, provide previous, next, and close
  controls where applicable, trap focus, restore focus on close, and support
  the keyboard.
- Hover captions must also appear on focus and have a readable touch behavior.
- Do not stretch low-resolution assets to imply importance. Use intentional
  cropping, a neutral fallback, or a higher-quality source.
- Prefer compressed video with a still fallback over an animated GIF for
  nonessential loops. Stop decorative motion under reduced-motion preferences.
- Credit or attribution belongs next to the relevant media or in route-owned
  metadata rather than in a detached global note.

### 6.11 Third-party interfaces

An embedded service is a capability, not a license to introduce another design
system.

- Place third-party UI inside a route-owned boundary with a stable loading,
  failure, and unavailable state.
- Normalize typography, control shapes, focus treatment, and core surface colors
  where the service safely allows customization.
- Do not globally override broad selectors to restyle one integration.
- Avoid remote decorative assets that add motion, visual noise, tracking, or a
  new visual theme without improving the task.
- Keep attribution and required provider branding intact, but separate it from
  the page's primary hierarchy.
- If an integration cannot meet the site's keyboard, contrast, privacy, or
  responsive baseline, isolate it clearly and record the limitation.

### 6.12 Prose code and tables

Long-form content is a primary product surface and should remain calmer than
dashboard or showcase UI.

- Keep prose within a readable line length and use consistent paragraph rhythm.
- Article headings use the documented hierarchy, scroll margin, and anchor-link
  treatment.
- Inline code is visually distinct without overpowering the sentence around it.
- Code blocks preserve whitespace, scroll horizontally when required, and keep
  titles, captions, line numbers, and highlighted lines legible in both themes.
- Copy controls require a clear accessible label and visible success feedback.
- Tables keep semantic header and cell markup. On narrow screens, scroll the
  table container rather than compressing text into unreadable columns.
- Callouts use color, icons, and labels together. Their tone and importance
  should match the message rather than adding decoration to ordinary prose.
- Quotes, footnotes, mathematics, embedded media, and captions must retain the
  same reading measure and link language as the article.

### 6.13 Accordions and disclosures

- The entire disclosure heading is a button-sized target and communicates its
  expanded state.
- Use a consistent chevron or directional indicator and rotate it with an
  explicit reduced-motion alternative.
- Keep the trigger visible while its panel has keyboard focus.
- Preserve heading hierarchy around disclosure triggers; do not choose a
  heading level for size alone.
- Do not hide essential page instructions inside a collapsed panel by default.
- Expansion must not unexpectedly scroll the page or trap keyboard focus.

## 7. Interaction and motion

The default interaction language is a small change in border, background,
foreground, opacity, or transform over 150 to 250 ms.

- List transitioned properties explicitly; do not use `transition-all`.
- Prefer opacity and transform animation for performance.
- Provide `motion-reduce` behavior for every nonessential animation.
- Hover-only information must also appear on keyboard focus and have a usable
  touch alternative.
- Repeated cards should not all shrink, lift, glow, and cast a larger shadow.
  Choose one restrained feedback pattern for the card family.
- Continuous motion belongs only to meaningful live status or a deliberate
  showcase and must stop or simplify under reduced motion.
- Page transitions should remain subtle and must not delay navigation.
- Destructive or difficult-to-reverse actions require confirmation or a clear
  undo window.
- Drag, swipe, pinch, and hover interactions need a tap and keyboard alternative
  unless the gesture is the essential subject of the experience.
- Use autofocus only for one obvious desktop task and avoid it on mobile.

The Home bento grid may use a small scale response as a personality detail. That
effect is not the default interaction for Library, Projects, Blog, Uses, or
other content collections.

## 8. Responsive behavior

Design mobile-first and verify phone, tablet, and desktop widths.

- Preserve at least 1 rem page gutters on phones.
- Keep titles, descriptions, and primary controls visible without horizontal
  scrolling.
- Stack metadata only when it remains clear which item it belongs to.
- Do not hide important descriptions merely because the viewport is narrow;
  shorten or clamp them deliberately.
- Use `min-w-0`, truncation, line clamping, and `break-words` for untrusted or
  remote content.
- Keep media dimensions or aspect ratios explicit to prevent layout shift.
- Navigation, dialogs, maps, galleries, and tab rows must respect safe areas and
  avoid clipped controls.
- Touch interaction cannot depend on hover.

Responsive variation is justified when it improves hierarchy. Replacing the
same component with an unrelated visual language at another breakpoint is not.

## 9. Loading empty error and live states

Every data-backed feature should use a consistent hierarchy of states:

- loading: preserve the final layout and identify the region with a concise
  status;
- empty: explain that no content is available without presenting a broken card;
- error: explain what failed and offer the next useful action when one exists;
- success: replace the placeholder without causing avoidable layout shift;
- live update: announce meaningful text changes politely when needed.

Skeletons should match the geometry of their final cards. Spinners are suitable
for isolated canvases or short actions, not as a default page layout. Optional
remote widgets must fail independently rather than collapsing neighboring
content.

## 10. Content voice and formatting

The portfolio can sound personal without making interface copy unpredictable.

- Use a direct, concise, human voice. Personal narrative may use first person;
  instructions should address the visitor directly.
- Use Title Case for page titles, section headings, buttons, tabs, and short
  control labels. Use sentence case for descriptions, hints, statuses, and
  error messages.
- Prefer specific action labels such as “Open Gallery” or “Retry Loading” over
  vague labels such as “Continue” or “Click Here.”
- Use a single ellipsis character in progress copy: “Loading…” rather than
  “Loading...”
- Error copy states what failed and the next useful action when one exists.
- Use numerals for counts and keep units next to their values.
- Format user-facing dates, times, numbers, and percentages with `Intl` rather
  than assembling locale-specific strings by hand.
- Preserve correct capitalization for brands, technologies, and personal names.
- Wrap code tokens, account handles, and identifiers so translation tools do not
  corrupt them when localization is introduced.
- Edit copied or generated descriptions to match the site's voice before they
  become interface text.
- Truncation must not remove the only explanation of an action or state.

## 11. Performance and perceived quality

Performance affects visual trust and is part of the design standard.

- Prevent layout shift with stable media geometry, skeleton geometry, and fixed
  space for asynchronously loaded widgets.
- Load critical fonts with a swap strategy and avoid adding a font for one
  isolated label.
- Defer below-the-fold media and heavy interactive canvases until needed while
  preserving useful static HTML around them.
- Prefer transform and opacity animation and avoid layout reads during render.
- Consider virtualization or `content-visibility` for collections that grow
  beyond roughly 50 substantial items.
- Do not make the initial page depend on an optional analytics, comments, map,
  music, or statistics service.
- Use preconnect only for stable critical asset origins; do not accumulate hints
  for every optional third party.
- Avoid animation, blur, backdrop filters, and large shadows when they do not
  materially improve hierarchy or feedback.

## 12. Accessibility baseline

Accessibility is part of the design system, not a final polish pass.

- Use semantic elements before ARIA.
- Maintain one logical `h1` and a hierarchical heading outline.
- Provide a keyboard-visible skip link to the main content.
- Give every interactive element a visible `focus-visible` indicator.
- Never remove an outline without providing an equivalent focus treatment.
- Ensure sticky headers, sidebars, and overlays do not cover the focused element.
- Label icon-only controls and form controls.
- Keep keyboard access equivalent to pointer access.
- Give meaningful images useful alternative text and decorative images empty
  alternative text.
- Meet contrast requirements in both themes and every interaction state.
- Preserve browser zoom and text resizing.
- Respect reduced-motion preferences.
- Keep anchored headings clear of the header with scroll margin.
- Give meaningful audio and video an appropriate caption, transcript, or text
  description.

The project should follow the current
[Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md)
as a practical implementation checklist in addition to this product-specific
direction.

## 13. Intentional and justified variation

These differences support the content and should not be flattened into generic
cards:

| Area                     | Justified variation                                    | Constraints                                                                      |
| ------------------------ | ------------------------------------------------------ | -------------------------------------------------------------------------------- |
| Home hero                | Larger type, avatar art, typewriter, personal voice    | Keep the global palette, readable hierarchy, and reduced motion                  |
| Home bento grid          | Denser composition and a few playful branded cards     | Use shared gutters, focus behavior, and restrained base surfaces                 |
| Blog articles            | Long-form typography, code blocks, callouts, footnotes | Keep a readable measure and consistent heading and link treatment                |
| Album and Masonry        | Image-first layouts and lightbox overlays              | Preserve semantic headings, captions, keyboard access, and stable image geometry |
| Journey                  | Map canvas and semantic location colors                | Keep surrounding controls and summary cards canonical                            |
| Room                     | 3D canvas and lighting controls                        | Keep loading, error, reduced-motion, and input patterns canonical                |
| Ticket or receipt object | Skeuomorphic color, mono type, and physical motion     | Contain it to the object and never use it as a general card template             |
| Home cat theme toggle    | Stacked translucent ripple forming a soft gradient     | Use one neutral tone; let ring opacity, not hue, fade evenly toward the card     |
| Brand integrations       | Official service colors and logos                      | Use only where identity or status requires them                                  |

Variation is justified by a change in content model or interaction mode. It is
not justified merely because an older route already looks different.

## 14. Inconsistencies to redesign

The following current patterns should not be copied and should be corrected in
focused changes:

1. Multiple page-title sizes, alignments, descriptions, and margins outside the
   documented exceptions.
2. Duplicate navigation-card implementations and numerous unrelated base-card
   recipes.
3. Route-specific tab systems with conflicting pill, square, radius, spacing,
   and selected-state rules.
4. Mixed card backgrounds such as white, `neutral-50`, `neutral-900`, and
   semantic `card` without a consistent elevation meaning.
5. Excessive use of `rounded-3xl`, `rounded-full`, large shadows, hover lift,
   and hover scale on ordinary content cards.
6. Hard-coded interface colors in Projects, Statistics, Sitemap, and other
   non-brand UI.
7. Blue links used as a separate visual language from the editorial Blog links.
8. Mixed interface icon libraries and inconsistent icon weights or sizes.
9. Functional text at 9 to 11 px in dense cards.
10. `transition-all` and motion without a reduced-motion equivalent.
11. Interactive elements that rely on hover or have no explicit focus style.
12. Duplicate tooltip styling, repeated dark-theme blocks, commented-out style
    systems, and legacy global CSS that can leak into unrelated routes.
13. The heavily customized third-party comment skin, animated remote background,
    and spinning avatars, which compete with article content and the canonical
    product tone.
14. Double-applied page spacing and local alignment patches that compensate for
    unclear ownership between the root shell and route layouts.
15. Multiple header presentations that imply different navigation systems.
16. Arbitrary z-index values that make local decoration compete with navigation,
    lightboxes, menus, or dialogs.
17. Chart palettes and hover-driven details that lack a shared visual or
    accessible data-presentation contract.
18. Form and selector styling inherited from route code or third-party defaults
    without a consistent label, error, focus, and submission pattern.
19. Media treatments that vary in crop, caption placement, hover behavior, and
    loading geometry without a content-based reason.
20. Copied, generated, or legacy interface copy that uses inconsistent casing,
    voice, punctuation, units, and action labels.
21. Essential navigation hidden behind a command palette whose generic trigger
    does not explain the site's main destinations.
22. Route-local theme handling and light or dark asset decisions that can create
    duplicate observers, hydration changes, or mismatched component states.
23. Disclosure, pagination, prose-table, and code-block controls that follow
    local conventions instead of one keyboard and responsive contract.

These are design debts, not permission for a repository-wide rewrite. Address
them by component family or route, verify current consumers, and preserve
behavior unless a task explicitly includes redesign.

## 15. Consolidation order

### Priority 0: Foundation

1. Choose one semantic color-role mapping and remove competing global defaults.
2. Make route headers and vertical page rhythm consistent.
3. Standardize focus rings, touch targets, link states, and reduced motion.
4. Remove or isolate duplicate and obsolete global CSS after proving it unused.
5. Choose the active global header presentation and remove stale alternatives.
6. Replace arbitrary z-index values with a shared layer order.
7. Make primary destinations visibly discoverable and keep the command palette
   as a fast supplemental navigation path.

### Priority 1: Shared component families

1. Consolidate `PagesCard` and `BlockCard` into one navigation-card contract.
2. Define the standard data, media, and showcase surface recipes.
3. Unify Uses, Journey, and Library segmented controls.
4. Unify badges, empty states, error states, and skeleton geometry.
5. Consolidate tooltip and overlay styling on the accessible primitives.
6. Define shared form-field and data-visualization contracts as real reuse is
   encountered.
7. Standardize disclosure, pagination, long-form table, and code-block controls.

### Priority 2: Route alignment

1. Bring Projects and Library cards into the canonical surface and motion
   language.
2. Align Repositories, tag, category, and statistics page headers.
3. Replace one-off Sitemap and metadata link styling.
4. Reduce the visual weight of the comment integration.
5. Audit the Home bento cards so their deliberate personality does not create
   accidental base patterns.
6. Align gallery media behavior, chart accessibility, and interface copy with
   the documented standards.

## 16. Contribution rules

Before adding or changing UI:

1. Identify whether the element is a foundation, shared component family,
   route-owned composition, or intentional showcase.
2. Check for an existing component with the same semantic role.
3. Reuse the canonical hierarchy, surface, and interaction recipes.
4. Keep route-specific decoration inside that route.
5. Do not create a global primitive for one speculative consumer.
6. Do not copy a legacy style merely to preserve local inconsistency.
7. Test light and dark themes plus phone, tablet, and desktop widths.
8. Test keyboard navigation, visible focus, touch behavior, reduced motion,
   loading, empty, error, and long-content states where applicable.
9. Confirm that visual changes do not compromise static export.
10. Record any intentional exception in the owning component or route.
11. Verify labels, formats, and messages with short, typical, empty, and long
    content.
12. Check that local overlays use the shared layer order and restore focus when
    dismissed.

When two implementations conflict, prefer the one that is simpler, more
legible, more accessible, and closer to the neutral editorial direction. A
component being newer or older is not by itself a design argument.

## 17. Review checklist

- Does the page clearly communicate its title and primary purpose?
- Can a first-time visitor discover the primary destination without knowing a
  keyboard shortcut?
- Does it use the shared content grid and avoid duplicate vertical spacing?
- Are type sizes and weights drawn from the documented hierarchy?
- Do colors express semantic roles rather than local preference?
- Does each surface use the correct radius and elevation level?
- Are equivalent actions styled and labeled consistently?
- Are hover, active, disabled, focus-visible, and reduced-motion states present?
- Does the interface remain usable without hover and at narrow widths?
- Are loading, empty, error, and long-content states intentional?
- Are forms labeled, actionable, and safe against lost input?
- Can charts and visualizations be understood without color or precise hover?
- Do images use deliberate crops, stable dimensions, useful alternative text,
  and appropriate loading priority?
- Are dates, numbers, units, labels, and messages formatted consistently?
- Do overlays and sticky elements follow the shared layer order without hiding
  focus?
- Do light, dark, and system modes preserve the same hierarchy and behavior
  without layout shift?
- Does the page remain useful before optional third-party UI loads?
- Is route-specific personality contained rather than becoming a second design
  system?
- Would the feature still look native if placed beside Blog, Uses, Songs, or
  Repositories?

If the answer to the last question is no, the feature should be reconciled with
the canonical system before adding more local styling.
