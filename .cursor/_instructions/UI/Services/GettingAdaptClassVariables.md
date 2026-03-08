# Definition
Innovation Studio is a production from BMC Helix.  
Adapt is a BMC Helix Graphical library, similar to Google Material, that contains elements like buttons, cards, forms, etc....  
It also provides a list of CSS variables that should be used to ensure a unified look and feel across the application instead of hardcoding colors, font sizes, margins, paddings, etc...  
Those CSS variables are called Adapt CSS Variables.

## How to get the list of available Adapt CSS Variables?
There is no official documentation listing all the available Adapt CSS Variables, however, you can access them directly from the Innovation Studio SDK source code, specifically in the file `/bundle/src/main/webapp/node_modules/@bmc-ux/adapt-css/src/scss/adapt-theme.scss`.  
Do not focus on the variable values, just on the names. You can get the list of available Adapt CSS Variables by searching for the `--` prefix in this file, for example for the "light" theme since there are multiple themes defined in this file:
```scss
[data-theme="light"] {
  --border-radius: 4px;
  --font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

  --color-primary-disabled: rgba(64, 64, 217, .5);
  --color-primary: #4040d9;
  --color-primary-hover: #3006c2;
  --color-primary-pressed: #4300d5;
}
```

## How to use Adapt CSS Variables?
In your component SCSS files, reference the CSS variables using the `var()` function:

```scss
.my-component {
  background-color: var(--color-background);
  color: var(--color-text-primary);
  border-radius: var(--border-radius);
  font-family: var(--font-family);
}

.my-button {
  background-color: var(--color-primary);
  
  &:hover {
    background-color: var(--color-primary-hover);
  }
}
```

This ensures your components automatically adapt to the current theme and maintain consistency across the application.
