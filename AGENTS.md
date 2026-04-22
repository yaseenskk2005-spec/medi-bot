# Project Guidance

## User Preferences

[No preferences yet]

## Verified Commands

**Frontend** (run from `src/frontend/`):

- **install**: `pnpm install --prefer-offline`
- **typecheck**: `pnpm typecheck`
- **lint fix**: `pnpm fix`
- **build**: `pnpm build`

**Backend** (run from project root `/app`):

- **install**: `mops install`
- **typecheck**: `mops check --fix`
- **build**: `mops build`

**Backend and frontend integration** (run from root):

- **generate bindings**: `pnpm bindgen` This step is necessary to ensure the frontend can call the backend methods.

## Learnings

- Motoko mops commands must run from the directory containing `mops.toml` (project root, not `src/backend/`).
- Double-quote char literals `'"'` cause M0002 syntax errors in Motoko — use `#text "\""` pattern or compare with `Char` obtained from a string iterator instead.
- `let dquote : Char = 0x22` does not work (M0050); extract the char from a string or use `#text "\""` pattern in `Text.split`/`Text.replace`.
- Char pattern in switch `case '"'` also causes M0002 — avoid double-quote in char literal context.
