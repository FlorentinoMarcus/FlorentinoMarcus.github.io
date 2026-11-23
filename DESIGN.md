---
mode: experience
surface: portfolio-home
---

# Design

## Visual world

An editorial game-studio portfolio built from obsidian, graphite, warm ivory, and a disciplined technical palette. Cyan communicates developer identity, indigo distinguishes foundational skills, and signal orange is reserved for actions and the brand dot. Large Epilogue headlines meet JetBrains Mono labels. The visual system is sharp, spacious, and image-led, with real game screenshots carrying the color.

## Composition

- A restrained first viewport centers Marcus as a high-resolution transparent portrait, with his name above “Game Developer”; the lowered portrait overlaps no more than the upper quarter of the role line.
- Para Po! receives a two-screen pinned chapter moment with three real screenshots.
- Additional work uses open project rows rather than boxed cards.
- Light and dark sections alternate to create pacing; the first viewport alone uses a graphite gradient, a restrained cyan/indigo atmosphere, and a neutral portrait spotlight to establish depth.

## Components

- Fixed 72px navigation with a 1px rule.
- Orange rectangular primary buttons with 7px corners.
- Underlined text links and neutral project metadata rows.
- Media frames use a consistent soft 10px radius and restrained image zoom on hover.
- The hero uses ten equal-width, translucent, center-aligned skill pills in a mirrored five-row arc around the silhouette. Intermediate pills share a cyan technical treatment; Basic pills share a quieter indigo treatment. The formation preserves clear space around the face and title while tightening toward the head and waist and widening near the shoulders.
- Skill pills are static, non-interactive labels with a centered proficiency label beneath each skill name.

## Motion

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
