# Record grid styles for **com.amar.hssb**

This folder mirrors the Record Grid themes from **helix-vibe-studio** so you can wire them into the **hssb** Angular library.

## 1. Copy files into your hssb project

Copy this entire `record-grid-styles/` folder into your hssb bundle’s lib styles area, for example:

`bundle/src/main/webapp/libs/com-amar-hssb/src/lib/styles/record-grid-styles/`

(Adjust the path to match your repo — often `libs/<library-name>/src/lib/styles/`.)

## 2. Import once in the hssb app stylesheet

In `com-amar-hssb.scss` (or whatever your main bundle SCSS entry is), add:

```scss
@import './record-grid-styles/hssb-record-grid-styles';
```

Or import the two files separately:

```scss
@import './record-grid-styles/record-grid-modern-styles';
@import './record-grid-styles/modern-grid-styles';
```

## 3. Build and deploy **com.amar.hssb**

Run your normal Maven deploy for the hssb application so the CSS is emitted into `com-amar-hssb.css` (or the platform’s equivalent).

## 4. View Designer

On the Record Grid → **CSS classes**, use e.g. `record-grid-modern` or `modern-grid grid-rounded` (same as helix-vibe-studio).

## Style injector component

The **Record Grid modern styles** injector lives only in **helix-vibe-studio**. For hssb-only shells, either:

- Rely on the imported SCSS above (preferred), or  
- Copy the `record-grid-style-injector` view component from helix-vibe-studio into hssb and register it there (advanced).

## Source of truth

Canonical copies are maintained under:

`workspace/helix-vibe-studio/bundle/src/main/webapp/libs/com-amar-helix-vibe-studio/src/lib/styles/`

Refresh this portable folder when those files change.
