# Code Row Action Visibility Design

## Goal

Make the code-list add and row-delete actions immediately recognizable in the admin code-group drawer without competing with the drawer's primary save action.

## Visual Hierarchy

- Keep the footer `저장` button as the only solid accent action in the drawer.
- Render `코드 추가` as a compact soft-accent button: accent-colored border, icon, and label with a lightly tinted accent background.
- Render each row delete control as a compact soft-danger icon button: danger-colored border and trash icon with a lightly tinted danger background.
- Show the danger treatment in the default state, not only on hover, so the destructive meaning remains visible on touch devices and before pointer interaction.
- Increase the tint and border contrast on hover while preserving readable foreground contrast in both admin light and dark themes.
- Use an accent focus ring for add and a danger focus ring for delete. Keep the existing disabled treatment where applicable.

## Components

- `CodeGroupFormDrawer` continues to use the shared `Button` for `코드 추가`, adding only an app-specific class for the soft-accent presentation.
- The row delete control remains local to the editable grid because its 32–36 px layout and row-removal behavior are specific to this form. Replace the ambiguous multiplication sign with Lucide's `Trash2` icon.
- Keep the existing accessible row-specific label (`N번째 코드 삭제`) on each icon-only delete button.
- No shared button variant is added: this is currently a single admin-specific treatment, so promoting it to shared UI would be premature.

## Interaction and Data Flow

The change is visual only. `코드 추가` still appends an empty code row, and row delete still removes the matching field-array index immediately. Group deletion, save behavior, validation, API calls, and confirmation behavior remain unchanged.

## Verification

- Extend the drawer component test to confirm the add action keeps its icon and receives the local soft-accent class.
- Render at least one code row and verify its delete button has the row-specific accessible name and a trash SVG icon.
- Verify the remove action still deletes only the selected row.
- Run the focused component test, admin type check, and the repository CSS-token check if available.
- Visually check light and dark admin themes to confirm the controls are more visible than input borders while remaining less prominent than `저장`.

## Scope

This change affects only the code-list add and row-delete controls in the code-group drawer. It does not redesign footer actions, introduce delete confirmation for unsaved code rows, widen the editable grid, or change shared button APIs.
