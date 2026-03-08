# Runtime component
The design-time component is implemented in the folder `runtime/`.
```
<view-component-name>/
├── runtime/
│   ├── <view-component-name>.component.html
│   ├── <view-component-name>.component.scss
│   └── <view-component-name>.component.ts
```

## Angular Component (`<view-component-name>.component.html`, `<view-component-name>.component.scss`, `<view-component-name>.component.ts`)
The Design-time component is a regular Angular component that implements the runtime experience of the View Component in the View Designer, it is usually a very simple component as it only needs to provide a preview of the component in the View Designer canvas:
* `<view-component-name>.component.html`:
    * The HTML template for the runtime component,
    * It is recommended to leverage Adapt UI Components, which are UI elements provided by the Adapt framework that automatically adapt to the current theme and provide a consistent look and feel across different applications. For example, you can use the `adapt-button` component to create a button that adapts to the current theme,
* `<view-component-name>.component.scss`: The SCSS styles for the runtime component
* `<view-component-name>component.ts`: The TypeScript file for the design-time component,

## Component logic (`<view-component-name>.component.ts`)
The Angular component extends the `BaseViewComponent` from `@helix/platform/view/runtime`, allowing to tap into the out of the box methods to automatically receive updates when the component's properties change, or when an input parameter is set.  
The component can also implement custom logic to handle specific interactions or behaviors in the runtime experience. For example, you can implement a method to handle click events on a button and update the component's state accordingly.

### Subscribing to input parameters changes
The config object is an Observable containing the input parameters values. You can subscribe to it to receive updates when the input parameters change and update the component's state accordingly. For example, you can subscribe to the config object in the `ngOnInit` method and update the component's properties based on the input parameters values, for example:
```typescript
@Input()
config: Observable<IPizzaOrderingProperties>;
// ...
ngOnInit() {
    super.ngOnInit();

    // Subscribe to configuration property changes.
    this.config.pipe(distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe((config: IPizzaOrderingProperties) => {
        // Setting isHidden property to true will remove the component from the DOM.
        this.isHidden = Boolean(config.hidden);

        this.state = { ...config };
    });
}
```

### Reacting to set property calls for an input parameter
The component can also react to set property calls for an input parameter, for example, if the component has an input parameter called `title`, you can implement in a View a Button with a Set Property action that would change an input parameter value at runtime, and the component would react to that change and update the title in the runtime experience.  
This is done already out of the box by the `api` object definition and its registration in the `ngOnInit` method:
```typescript
api = {
    // This method will be called when a component property is set via the Set property view action.
    setProperty: this.setProperty.bind(this)
};

// ...
ngOnInit() {
    super.ngOnInit();

    // Make component API available to runtime view.
    this.notifyPropertyChanged('api', this.api);
}
```
The method `setProperty` itself catches the input parameter that has been changed, and can execute custom logic based on the parameter that has been changed, for example:
```typescript
  private setProperty(propertyPath: string, propertyValue: any): void | Observable<never> {
    switch (propertyPath) {
    case 'hidden': {
            this.state.hidden = propertyValue;
            this.notifyPropertyChanged(propertyPath, propertyValue);
            break;
        }
    case 'customerName': {
            this.state.customerName = propertyValue;
            this.notifyPropertyChanged(propertyPath, propertyValue);
            break;
        }
    default: {
            return throwError(`Pizza Ordering : property ${propertyPath} is not settable.`);
        }
    }
}
```

### Broadcasting output parameters values
In order to broadcast an output parameter value change to the runtime view, the component can use the `notifyPropertyChanged` method provided by the `BaseViewComponent` class. For example, if the component has an output parameter called `orderPlaced`, you can call the `notifyPropertyChanged` method when an order is placed to notify the runtime view of the change:
```typescript
this.notifyPropertyChanged('<outputPropertyName>', '<value to broadcast>');
```
  
For example:
```typescript
this.notifyPropertyChanged('customerName', 'John Doe');
```
