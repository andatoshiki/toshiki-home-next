# Blog UI style baseline

This note records the intended blog presentation before the July 2026 UI
cleanup. Refactors should preserve these characteristics unless a redesign is
explicitly requested.

- Content is centered in a `52rem` container with compact mobile padding.
- The blog uses the site's neutral gray palette in both color schemes.
- A subtle `16px` radial-dot pattern sits behind all blog routes.
- Page and post titles use large, semibold/bold sans-serif typography.
- Post metadata is compact, muted, and icon-supported rather than card-based.
- The index groups entries beneath oversized, low-opacity year watermarks.
- Post prose uses relaxed neutral body text, prominent headings, restrained
  underlined links, rounded media, and horizontally scrollable code/tables.
- The desktop table of contents sits in the left rail. Narrow viewports use a
  left-side drawer with the same content and visual language.
- Controls are circular or lightly rounded, with neutral hover treatments.
- UI motion is short and limited to opacity or transform transitions.
- Scrollable regions use the project's 3px thin scrollbar treatment.

Permitted corrective differences:

- Long content may wrap or scroll instead of widening the page.
- Long tables of contents may scroll within the viewport and show nesting.
- Keyboard focus indicators may appear on interactive elements.
- Reduced-motion users may receive no animation or smooth scrolling.
