---
mode: experience
surface: portfolio-home
---

# Design

## Visual world

An editorial game-studio portfolio built from near-black, warm graphite, oxblood, ember red, and sparing signal orange. Ember red communicates developer identity and primary action; signal orange is reserved for hover and active emphasis. Skill proficiency remains an independent data palette: mint for advanced, cyan for intermediate, and indigo for foundational skills. Warm ivory is used for text rather than large page fields. Large Epilogue headlines meet JetBrains Mono labels. The visual system is sharp, spacious, image-led, and consistently dark across the landing page and project pages, with real game screenshots carrying the broadest color range.

## Composition

- A restrained first viewport centers Marcus as a high-resolution transparent portrait, with his name above “Game Developer”; the lowered portrait overlaps no more than the upper quarter of the role line.
- Para Po! receives a two-screen pinned chapter moment with three real screenshots.
- Additional work uses open project rows rather than boxed cards.
- Division 1 of the landing page retains its red atmospheric gradient and interactive dot field. Every section after it, plus both project pages, uses one uninterrupted near-black canvas with quiet 1px hairline rules between major sections.

## Components

- Fixed 72px navigation with a 1px rule.
- Ember-red rectangular primary buttons with signal-orange hover states and 7px corners.
- Underlined text links and neutral project metadata rows.
- Media frames use a consistent soft 10px radius and restrained image zoom on hover.
- The hero uses ten equal-width, translucent, center-aligned skill pills in a mirrored five-row arc around the silhouette. Advanced pills use mint, Intermediate pills use cyan, and Basic pills use a quieter indigo treatment. The formation preserves clear space around the face and title while tightening toward the head and waist and widening near the shoulders.
- Skill pills are static, non-interactive labels with a centered proficiency label beneath each skill name.

## Motion

- The landing hero background carries a quiet canvas dot grid. On fine pointers, dots within a restrained radius brighten toward signal orange, enlarge slightly, and repel from the cursor before springing back. Touch and reduced-motion users receive the static grid.
- A first-load IDE sequence lands the editor with a restrained overshoot, types `const developer = "Marcus Florentino";` above an already-present run line, then automatically depresses and releases a raised Enter key. Its orange execution outline resolves into a narrow code line while the dark screen separates upward and downward to reveal the hero beneath it.
- The intro uses compositor-only opacity and transform motion; typing is a discrete text update rather than frame-driven animation.
- Escape skips the sequence, Enter activates it when ready, and reduced-motion mode resolves the name immediately before a short fade.
- The hero enters once as the IDE curtain opens: the headline rises first, the portrait follows, the CTA overlaps their settle, and the five mirrored skill rows fade in as paired accents with shrinking delays.
- The hero’s depth is spatially static after entrance: the headline stays behind the portrait while every skill pill stays above it for full readability.
- After the entrance settles, the five skill rows run a restrained paired idle wave: a 3px rise and 1px settle, followed by a long rest within an eight-second loop. Reduced-motion mode removes the idle movement entirely.
- The 1280 × 638 desktop hero is the single reference canvas at every viewport. Phones, tablets, landscape devices, and smaller browsers uniformly scale that complete canvas to fit the available width and height; no child element is independently resized or repositioned.
- Linked media scales to 1.025 and linked controls respond on hover and press.
- Only the featured Para Po! chapter section changes with scroll.
- Reduced-motion mode collapses the hero choreography into one immediate opacity reveal and removes chapter transitions.

## Responsive behavior

- The hero stacks text before imagery on tablet and phone.
- The featured chapter becomes a static, single-image summary on phone.
- Navigation becomes a full-screen menu with a labeled 44px toggle.
- Buttons become full-width where narrow screens need larger targets.
