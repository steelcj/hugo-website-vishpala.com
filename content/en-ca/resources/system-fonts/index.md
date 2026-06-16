---
title: "System Fonts — Why We Don't Load Custom Typefaces"
date: 2026-06-15
description: "The case for system-ui: why vishpala.com uses the device's native font stack rather than loading external typefaces, and what that means for accessibility, performance, and sovereignty."
draft: false
params:
  status: "Stable"
  version: "1.0.0"
---

## The decision

This site uses `system-ui, -apple-system, sans-serif` — the device's native font stack — for all text. We do not load Google Fonts, self-hosted custom typefaces, or any external font files.

This was a deliberate decision made on accessibility, performance, and sovereignty grounds.

## Accessibility

System fonts are the typefaces operating system vendors have spent the most resources optimising for screen legibility at every size, display density, and accessibility setting. San Francisco on macOS and iOS, Segoe UI on Windows, and Roboto on Android are each the product of significant investment in hinting, spacing, and rendering.

Critically, system fonts respond correctly to the user's own font preferences. If a user has configured their operating system to use a larger default font size, or a specific typeface for readability reasons, `system-ui` inherits those preferences. A custom web font overrides them. For users who depend on those preferences, that override is a barrier.

The Inclusive Design Research Centre at OCAD University — whose work directly shapes our accessibility practice — uses this approach.

## Performance

Every custom font file is a network request that must complete before text renders correctly. A typical web font family with four weights and styles requires four separate files. With `system-ui`, text renders immediately using a font already present on the device. There is no flash of invisible text, no layout shift, and no dependency on any font delivery network.

## Sovereignty

Loading fonts from Google Fonts establishes a connection to Google's servers on every page load. That connection discloses the visitor's IP address to Google, regardless of whether the page itself has any relationship with Google. Even self-hosting eliminates only the third-party disclosure — it still requires maintaining font files and a conversion pipeline.

`system-ui` requires neither. It is the only web typography choice that introduces no external dependency of any kind and imposes no infrastructure maintenance burden.

## Trade-offs

The trade-off is visual consistency across platforms. A page renders in San Francisco on macOS and Segoe UI on Windows. These are different typefaces with different proportions. We accept this trade-off because the accessibility and sovereignty benefits outweigh the value of pixel-identical rendering across devices — particularly for a studio whose practice is built on inclusive design principles.
