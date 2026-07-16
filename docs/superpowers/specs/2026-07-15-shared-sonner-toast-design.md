# Shared Sonner Toast Design

## Goal

Add one reusable Sonner toast interface to `@bx/shared` and mount its toaster once in both PC and mobile applications.

## Architecture

- `packages/shared` owns the `sonner` dependency.
- `packages/shared/src/shared/ui/toast` exposes a thin `Toaster` wrapper and the `toast` function.
- `pc-web`, `mobile-web`, and `admin-portal` each render one `Toaster` next to their router provider.
- The toast surface reads shared theme tokens (`--surface-elevated`, `--foreground`, `--border`, `--muted`, and the status tokens `--success` / `--info` / `--warning` / `--danger`). The wrapper does not pin Sonner's `theme` prop, so a light host theme yields a light toast.
- Existing `alert(...)` calls remain unchanged in this change so infrastructure and UX migration stay independently reviewable.

## Public Interface

```tsx
import { Toaster, toast } from '@bx/shared';

toast.success('Saved');
toast.error('Save failed');

<Toaster />;
```

The shared wrapper defaults to a neutral surface at `bottom-center` that follows the host app's
theme. Status colors stay on the icons, while compact action and close controls remain inside the
toast. Callers can still override Sonner props when a screen needs different behavior.

Theme tokens are set inline on the toaster as `var(--token)` indirection rather than resolved in
JS. Sonner defines `--normal-*` on `[data-sonner-toaster][data-sonner-theme='...']`, which outranks
a CSS module class, so inline is what wins; `var()` then re-resolves on theme change.

The three host apps switch themes differently, and the wrapper stays agnostic to all of them
because each resolves the same tokens:

| App | Mechanism | Toggle? |
| --- | --- | --- |
| `pc-web` | `.dark` class via `useTheme` | Yes — account menu and settings panel |
| `admin-portal` | `:root[data-admin-theme]` | Yes — admin sidebar |
| `mobile-web` | none; shared tokens stay at their `:root` (light) values | No — light only |

Note that `theme.css`'s `.dark` block does not apply in `admin-portal`, which never sets that
class. Any token added to `theme.css` must therefore also be mapped in `admin-theme.css`'s two
blocks, or admin's dark mode will silently fall back to the light value.

## Error Handling

Sonner owns toast lifecycle and rendering. Application code chooses the status method (`success`, `error`, `warning`, or plain `toast`) at each call site.

## Verification

- A shared UI test confirms the wrapper renders Sonner's toaster region and wires the surface to
  theme tokens. Visual ordering (the close button sitting at the right edge via flex `order`) is not
  asserted in jsdom, which does not compute it — that is verified in a browser.
- Type checks run for `@bx/shared`, `pc-web`, `mobile-web`, and `admin-portal`.
- Production builds run for PC and mobile applications.

## Scope

This change does not replace existing alerts or add app-specific toast styling.
