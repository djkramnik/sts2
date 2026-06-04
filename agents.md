# Agent Rules

- All Zod schema values must be PascalCased and end with `Z`.
- Examples: `SerializableCardZ`, `SerializablePlayerZ`, `PlayerStateZ`.
- `packages/shared` is a dependency of both `packages/ui` and `packages/server`.
  Keep shared code environment-agnostic: do not add server-only or Node-only APIs
  such as `node:crypto`, filesystem access, or other runtime-specific dependencies
  unless they are isolated from the UI bundle.
