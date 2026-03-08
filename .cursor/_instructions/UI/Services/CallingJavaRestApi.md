# Definition
Innovation Studio is a production from BMC Helix.  
When Developers want a third party system to interact with Innovation Studio Business Processes, they can use the Innovation Studio REST API, however those are very generic, and might expose more than anticipated, or might be harder to use.
The Innovation Studio SDK allows Developers to create custom REST API endpoints, in Java.  
You can also create a Rest Api that would be called internally by Angular code in an Innovation Studio coded UI element (View component or View action).  
  

# Calling a custom Innovation Studio REST API endpoint from Angular code
You can use the regular `HttpClient` Angular service to call your custom REST API endpoint. HttpClient needs to be declared in the constructor of your Angular component.  
The url is relative to the Innovation Studio base url, and is composed of `/api/` followed by the `bundleId` and the name of your REST API as defined in Java:
`/api/<bundleId>/<restapiname>`  
For example:
`/api/com.example.pizza/orders`
  
Innovation Studio only supports Json as payload.  
  
**Important:**  
Make sure to set the `x-requested-by` request header in the request to a value, for example `X` for rest methods that can alter data (aka `POST`, `PUT`, `DELETE`), else Innovation Studio backend will return a `400 Bad Request` response.    
For example:
```typescript
import { HttpClient } from '@angular/common/http';
// ...
constructor( private httpClient: HttpClient ) {
    super();
}
// ...
const URL = '/api/com.example.pizza/orders';

const payload = {
    pizzaType: 'Pepperoni',
    size: 'Large'
};

this.httpClient.post(URL, payload, { headers: { 'x-requested-by': 'X' } }).subscribe((response) => {
    // handle response
});
```
