# AI Agent Card Configuration — Record Definition Spec

The Generic Agent Card component reads layout configuration from this record definition.

**Fully qualified name:** `com.amar.helix-vibe-studio:AI Agent Card Configuration`

## Field Mapping (by field name — IDs resolved at runtime)

Field IDs are system-generated (e.g. 536870915, 536870916) and vary per environment. The component looks up fields **by name** from the record definition. Use these exact field names (or supported variants):

| Field Name | Variants Accepted | Field Type | Required | Description |
|------------|-------------------|------------|----------|-------------|
| configName | Config Name | Character (100) | Yes | Unique name (e.g., "Planning Agent Card") |
| themeColor | Theme Color, theme_color | Selection | Yes | Primary accent: orange, blue, green, red, purple, cyan |
| headerConfig | Header Config, header_config | Character (2000) | Yes | JSON string for header layout |
| sectionsConfig | Sections Config, sections_config | Character (10000) | Yes | JSON string for sections array |

Other fields (e.g. description, isActive) are ignored by the component.

## Theme Color Selection Values

| Value | Display Label |
|-------|---------------|
| orange | Orange |
| blue | Blue |
| green | Green |
| red | Red |
| purple | Purple |
| cyan | Cyan |

## Creating the Record Definition

1. **Via Innovation Studio Admin**: Create record definition with the fields above.
2. **Or** add a `.def` file under `workspace/helix-vibe-studio/package/src/main/definitions/db/record/`.

The Generic Agent Card component expects `configRecordInstanceId` as input — the GUID of a record instance in this definition.
