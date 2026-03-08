# Definition
Innovation Studio is a production from BMC Helix.  
It is possible to get information about the current user (username, userId etc...), this could be helpful since sometimes data are saved using the user login name, and not its full name.


# Getting user information
To get the current user information, you can use the `RxCurrentUserService` service from import `@helix/platform/shared/api` provided by the Innovation Studio SDK.  
The service needs to be injected in the constructor of your Angular component.  
You can retrieve those information by calling the adequate method of the service:
* preferred locale: `getPreferredLocale()`,
* full name: `getName()`,
* is the user a business analyst: `isBusinessAnalyst()`,
* is the user an Administrator: `isAdministrator()`,
* server version: `getServerVersion()`,
  
Some other used properties are available as return from the method `get()`, which returns an object of type `IUser`, the most used are:
* user id: `.get().userId`,
* login name: `.get().loginName`,
Here is the full list of properties available in the `IUser` interface:
```typescript
export interface IUser {
    editableBundles?: string[];
    preferredLocale: string;
    preferredUserLocale: string;
    fullName: string;
    loginName: string;
    password: string;
    userId: string;
    emailAddress: string;
    groups: string[];
    defaultNotifyMechanism: string;
    forcePasswordChangeOnLogin: boolean;
    createdBy: string;
    permittedGroupsBySecurityLabels: {};
    permittedUsersBySecurityLabels: {};
    disablePasswordManagementForUser: boolean;
    lastPasswordChange: Date;
    defaultOverlayGroupId: string;
    userOverlayGroupDescriptors: IUserOverlayGroupDescriptor[];
    personInstanceId: string;
    ssoProviderType: string;
    computedGroups: string[];
    assignmentAvailable?: boolean;
    supportStaff?: boolean;
    licenseType: string;
    isAdministrator: boolean;
    isBusinessAnalyst: boolean;
    functionalRoles: string[];
    modifiedDate: Date;
    serverVersion: string;
}
```
For example:
```typescript
import { RxCurrentUserService } from '@helix/platform/shared/api';
import { RxLogService } from '@helix/platform/shared/api';
// ...
constructor(private rxCurrentUserService: RxCurrentUserService, private rxLogService: RxLogService) {
    super();
}
// ...
this.rxLogService.log('Current user id is: ' + this.rxCurrentUserService.get().userId + ', and its login name is: ' + this.rxCurrentUserService.get().loginName);
```
