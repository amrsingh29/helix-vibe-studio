# Date/Time Formatter View Component

Standalone view component that displays a date/time value in a configurable format. Bind an ISO date-time string or epoch milliseconds via expression, choose the display format, typography, and optionally show it in a badge/pill style.

**Palette:** Appears in **Helix Vibe Studio** alongside Active cart (grouped), Catalog view, and Runtime actions demo.

## Features

- **Expression binding** — Bind **Date/time value** to a field, variable, or expression (ISO string or epoch ms)
- **Format presets** — Mar 29 2024, March 29 2024, 29 Mar 2024, 03/29/2024, 29/03/2024, 2024-03-29, with time, or relative (e.g. "2 days ago")
- **Typography** — Free-form font size (px), text color picker
- **Badge mode** — Toggle pill style with background color picker
- **Live preview** — Design component shows real-time preview as you configure

## Copy into your bundle library

1. Copy `my-components/date-time-formatter/` into your app library, e.g. `libs/<application-name>/src/lib/view-components/date-time-formatter/`.
2. Align selectors and registration `type` / `@RxViewComponent({ name })` with your bundle prefix (this repo uses `com-amar-helix-vibe-studio-date-time-formatter`; all three must match).
3. Import `DateTimeFormatterRegistrationModule` in your view-components registration module:

   ```typescript
   import { DateTimeFormatterRegistrationModule } from './view-components/date-time-formatter/date-time-formatter-registration.module';

   @NgModule({
     imports: [
       // ... other modules
       DateTimeFormatterRegistrationModule
     ]
   })
   export class ComAmarHelixVibeStudioModule {}
   ```

4. Export from your library `index.ts`:

   ```typescript
   export * from './lib/view-components/date-time-formatter/date-time-formatter-registration.module';
   ```

5. Deploy and add **Date/Time Formatter** from the palette in View Designer.

## Inspector configuration

| Property | Control | Purpose |
|----------|---------|---------|
| Name | Text | Instance name in the view outline |
| Date/time value | Expression | ISO string (e.g. 2026-03-22T03:38:09.000Z) or epoch ms |
| Format | Select | Display format preset |
| Font size (px) | Text | Free-form pixel value, e.g. 10, 14, 30 |
| Text color | Color picker | Color of the formatted text |
| Badge mode | Switch | Show as pill/badge |
| Badge background color | Color picker | Badge fill (when badge mode is on) |

## Settable properties

- `hidden` — Show/hide the component
- `dateTimeValue` — Update the bound value at runtime (e.g. from a view action)
