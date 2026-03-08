---
applyTo: "**/db/process/**/*.def"
---

# BMC Helix Process Definition — Rules

## Mandatory Reading

Read `cookbook/07-process-definitions.md` for the complete guide.

For the full JSON template and detailed field definitions, see `.cursor/rules/bmc-helix-process-definition.mdc`.

## Critical Rules

- File location: `/package/src/main/definitions/db/process/<processName>.def`
- Every definition line prefixed with `   definition     : ` (3 spaces, "definition", 5 spaces, colon, space)
- All GUIDs: `rx-<uuid-v4>` format
- `actionTypeName` must exactly match `<bundleId>:<@Action name>` from Java
- Layout cell IDs omit `rx-` prefix
- Deploy JAR before .def files to avoid ERROR 930
- `"synchronous": true` for immediate-return processes
