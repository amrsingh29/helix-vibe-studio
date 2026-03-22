# Record Grid Modern Styles — Troubleshooting

## Solution: Record Grid Style Injector Component

When the helix-vibe-studio CSS does not load (e.g. view in ITSM or another app shell), use the **Record Grid modern styles** injector component:

1. Open View Designer and edit the view that contains your Record Grid.
2. From the palette, add **Record Grid modern styles** (in the Helix Vibe Studio group).
3. Place it anywhere on the view (it is hidden at runtime and takes no space).
4. In the inspector, set **Hidden** to `true` (default) so it does not affect layout.
5. Save the view.

The injector runs when the view loads and injects the `record-grid-modern` CSS into the page. Your Record Grid (with CSS class `record-grid-modern`) will then use the modern styling.

After deploying, rebuild and deploy, then add the injector to views where the Record Grid styles were not applying.

---

## Why You Might Not See `com-amar-helix-vibe-studio.css` in Network

### 1. Different URL on deployed Helix

On a deployed Helix server, CSS is often served from a path like:

- `https://<your-helix-server>/<bundleId>/scripts/<filename>.css`
- Or bundled into a single `styles.css` or similar

**What to try in Network tab:**
- Clear filter, show **All** or **CSS**
- Sort by **Name** and look for anything with `helix-vibe-studio`, `com-amar`, or `vibe`
- Search (Ctrl+F / Cmd+F) for `record-grid-modern` across all loaded resources

### 2. View might not be in the helix-vibe-studio app

The Record Grid is a **platform OOB component**. If the view is in another application (e.g. ITSM, Service Request Management), that app’s shell is used and **the helix-vibe-studio CSS is not loaded**.

**Check the URL:** Are you on a path that loads the helix-vibe-studio app?  
Example: `.../com.amar.helix-vibe-studio/...` or similar.

If the view is in another app’s context, your custom CSS will not apply. To fix that you would need a different approach (e.g. platform-level customization), which is outside the scope of the coded app.

### 3. CSS bundled into another file

Your styles may be merged into `styles.css` or another shared stylesheet.

**What to try:**
1. In Network, find `styles.css` (or similar)
2. Open it and use Find (Ctrl+F) for `record-grid-modern`
3. If it’s there, the CSS is loading; the issue is likely selector or class usage

---

## Quick DevTools Checks

### A. Is the CSS loaded anywhere?

Run in the **Console**:

```javascript
const sheets = [...document.styleSheets];
const found = sheets.filter(s => {
  try {
    return [...s.cssRules || []].some(r => r.cssText && r.cssText.includes('record-grid-modern'));
  } catch (e) { return false; }
});
console.log('Sheets containing record-grid-modern:', found.length);
found.forEach(s => console.log(s.href || '(inline)'));
```

- **0 results:** CSS with `record-grid-modern` is not loaded → app/context or deploy issue.
- **≥ 1 result:** CSS is loaded → next check is whether the class is on the grid and selectors match.

### B. Is `record-grid-modern` on the grid?

```javascript
const grid = document.querySelector('.record-grid-modern');
console.log('record-grid-modern found:', !!grid, grid);
```

- **`false`:** Add `record-grid-modern` to the Record Grid’s **CSS classes** in View Designer.

### C. What does the grid’s DOM look like?

```javascript
const row = document.querySelector('tbody tr') || document.querySelector('[role="row"]');
const table = row?.closest('table') || row?.closest('[role="grid"]');
const wrapper = table?.closest('div[class]');
console.log('Table wrapper classes:', wrapper?.className);
console.log('Table classes:', table?.className);
```

Use the printed classes to confirm our selectors match the actual DOM.

---

## Still not working? Run the full diagnostic

Paste this in the browser Console while viewing the page with the Record Grid:

```javascript
(function() {
  const styleEl = document.getElementById('record-grid-modern-injected');
  const sheets = [...document.styleSheets];
  const hasCSS = sheets.some(s => {
    try {
      return [...(s.cssRules || [])].some(r => r.cssText && r.cssText.includes('record-grid-modern'));
    } catch (e) { return false; }
  });
  const grid = document.querySelector('.record-grid-modern') || document.querySelector('[class*="record-grid-modern"]');
  const table = document.querySelector('table') || document.querySelector('.p-datatable');
  const wrapper = table?.closest('[class*="record-grid"]') || table?.closest('div[class]');
  console.log('1. Style injector present:', !!styleEl);
  console.log('2. record-grid-modern CSS loaded:', hasCSS);
  console.log('3. Grid with record-grid-modern:', !!grid, grid?.className);
  console.log('4. Table wrapper classes:', wrapper?.className);
})();
```

Use the output to see where the class is applied. Share the results when asking for help.

---

## Summary

| Symptom | Likely cause | Next step |
|---------|--------------|-----------|
| No CSS file with “vibe” or “helix-vibe-studio” | Wrong app context or URL | Confirm you’re in the helix-vibe-studio app |
| CSS loads but no styling | Missing `record-grid-modern` or wrong selectors | Add class in View Designer; run full diagnostic above |
| `record-grid-modern` not in any stylesheet | Coded app CSS not deployed/loaded | Rebuild, redeploy, clear cache, hard refresh |
| Style injector present: false | Injector not in view or not deployed | Add "Record Grid modern styles" to the view, redeploy |
