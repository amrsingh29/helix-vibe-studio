# Dashboard bundle — source template

This folder mirrors the Angular library **`libs/com-amar-dashboard`** used by the **`com.amar.dashboard`** coded application bundle.

## Contents

- `com-amar-dashboard/` — Library source (`ComAmarDashboardModule`, **Configurable chart** view component).

## Palette and bundle

- **View Designer group:** `Dashboard`
- **Bundle id:** `com.amar.dashboard` only (`availableInBundles` does **not** include `com.amar.helix-vibe-studio`).

## Integrate into a coded app

1. Copy `com-amar-dashboard/` into your bundle’s webapp under `libs/com-amar-dashboard/` (same structure as in this repo’s workspace).
2. Add the TypeScript path alias `@com.amar.dashboard/com-amar-dashboard` → `./libs/com-amar-dashboard/src/index.ts`.
3. Import `ComAmarDashboardModule` in your shell `AppModule` (see [`workspace/helix-dashboard/README.md`](../../workspace/helix-dashboard/README.md)).

Do **not** add `ComAmarDashboardModule` to the Helix Vibe Studio shell if you want to keep dashboard components out of that deployment.

## Building the UI in this repo

From the repository root, use [`build-ui-on-host.sh`](../../build-ui-on-host.sh) so the Angular bundle for `workspace/helix-vibe-studio` (including `libs/com-amar-dashboard`) is built with the correct SDK env and webpack script. Then run Maven in the container with `-PusePrebuiltUI` as printed by that script.
