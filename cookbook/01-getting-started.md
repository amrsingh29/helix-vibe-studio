# Getting Started with BMC Helix Innovation Studio Coded Applications

## Platform Overview

BMC Helix Innovation Studio allows developers to extend the platform with:
- **UI Components** (Angular 18.x, TypeScript 5.5.4, RxJS 7.8.1) — view components, view actions, Angular services
- **Java Backend** (OpenJDK 17, OSGi, JAX-RS, Spring 5.3.42) — process activities, REST APIs, commands, DataPageQuery
- **BPMN Process Definitions** — workflow orchestration connecting Java services
- **Record Definitions** — data schema stored as `.def` files

## Prerequisites

| Tool | Version | Verify |
|------|---------|--------|
| Node.js | 20.15.1 | `node --version` |
| Yarn | 1.22.22 | `yarn --version` |
| Java JDK | 17.0.x | `java -version` |
| BMC Helix IS SDK | 25.4.00+ | `ls $RX_SDK_HOME` |

### Environment Variables

```bash
export RX_SDK_HOME=/path/to/com.bmc.arsys.rx.sdk-25.4.00
export JAVA_HOME=/path/to/jdk-17
```

If the file `.cursor/_instructions/my-env-vars.env` exists, read environment variable values from it.

Set Node.js version if `nvm` is installed:
```bash
nvm use 20.15.1
```

## Application Name

The **application name** determines the path where Angular code lives. Find it in `/bundle/src/main/webapp/angular.json` under `projects`:

```json
"projects": {
    "<application-name>": {
        "projectType": "library",
        "root": "./libs/<application-name>",
        "sourceRoot": "./libs/<application-name>/src",
        "prefix": "<application-name>"
    }
}
```

## Bundle ID

The **bundleId** uniquely identifies the application package: `<groupId>.<artifactId>` from `/bundle/pom.xml`.

```xml
<groupId>com.mycompany</groupId>
<artifactId>my-app</artifactId>
<!-- bundleId = com.mycompany.my-app -->
```

Used for:
- Record definition names: `<bundleId>:<recordDefinitionName>`
- REST API URLs: `/api/<bundleId>/<your-path>`
- Component type strings: `<application-name>-<application-name>-<component-name>`

## Project Structure

All code lives under `workspace/<your-project>/`:

```
workspace/<your-project>/
├── pom.xml                                    # Root Maven config
├── bundle/
│   ├── pom.xml                                # Bundle Maven config (groupId, artifactId)
│   └── src/main/
│       ├── java/com/<group>/<app>/bundle/     # Java backend code
│       │   ├── MyApplication.java             # OSGi bundle activator — register services here
│       │   ├── *ProcessActivity.java          # Java process activities
│       │   ├── *ResponsePayload.java          # Response DTOs
│       │   └── *.java                         # REST APIs, Commands, DataPageQuery
│       ├── resources/
│       │   └── localized-strings.properties   # Server-side localized strings
│       └── webapp/
│           ├── angular.json                   # DO NOT MODIFY — belongs to BMC Helix SDK
│           ├── package.json                   # DO NOT MODIFY — belongs to BMC Helix SDK
│           └── libs/<application-name>/
│               ├── package.json               # YOUR third-party NPM dependencies go here
│               └── src/
│                   ├── index.ts               # Exports — all registration modules must be exported
│                   └── lib/
│                       ├── <application-name>.module.ts  # Main module — import all registration modules
│                       ├── view-components/              # View Components (standalone + record editor field)
│                       ├── actions/                      # View Actions
│                       ├── assets/                       # Static assets (images, fonts)
│                       ├── i18n/
│                       │   └── localized-strings.json    # UI localized strings
│                       └── styles/
│                           └── <application-name>.scss   # Global SCSS styles
├── package/
│   ├── pom.xml
│   └── src/main/definitions/db/
│       ├── record/                            # Record definitions (.def)
│       ├── process/                           # Process definitions (.def)
│       └── view/                              # View definitions (.def)
└── llms.txt                                   # This cookbook index
```

## Key Files — Do Not Modify Rules

| File | Rule |
|------|------|
| `/bundle/src/main/webapp/angular.json` | DO NOT MODIFY — BMC Helix SDK managed |
| `/bundle/src/main/webapp/package.json` | DO NOT MODIFY — BMC Helix SDK managed |
| `<application-name>.module.ts` | Do not remove existing imports or commented code |
| `MyApplication.java` | Do not remove existing imports or commented code |

## Component Type String Convention

All view components and actions use a fully qualified type string:

```
<application-name>-<application-name>-<component-name>
```

Example: `com-example-sample-application-com-example-sample-application-pizza-ordering`

This string MUST be identical in:
- Registration module `type`
- Runtime component `@RxViewComponent({ name })` decorator
- Runtime component `selector`

## Asset Paths at Runtime

Assets stored in `libs/<application-name>/src/lib/assets/` are served at:
```
/<bundleId>/scripts/assets/resources/<subfolder>/<filename>
```

Example:
```html
<img src="/com.example.sample-application/scripts/assets/resources/images/pizza.jpg"/>
```

## Localization

All UI strings must use localization. Never hardcode strings.

**File**: `libs/<application-name>/src/lib/i18n/localized-strings.json`

```json
{
  "<bundleId>.view-components.<component-name>.<string-id>": "English text"
}
```

**TypeScript usage**:
```typescript
import { TranslateService } from '@ngx-translate/core';
const msg = this.translateService.instant('com.example.sample-application.view-components.pizza-ordering.welcome');
```

**HTML usage**:
```html
<h1>{{ 'com.example.sample-application.view-components.pizza-ordering.welcome' | translate }}</h1>
```

## What Can You Build?

| Need | Build | Docs |
|------|-------|------|
| Reusable UI element | Standalone View Component | [02-ui-view-components.md](02-ui-view-components.md) |
| Custom record editor field | Record Editor Field View Component | [02-ui-view-components.md](02-ui-view-components.md) |
| Button click / event handler | View Action | [03-ui-view-actions.md](03-ui-view-actions.md) |
| Shared Angular logic | Angular Service | [04-ui-services-and-apis.md](04-ui-services-and-apis.md) |
| BPMN process step | Java Process Activity | [06-java-backend.md](06-java-backend.md) |
| Custom API endpoint | Java REST API | [06-java-backend.md](06-java-backend.md) |
| Fire-and-forget operation | Java Command | [06-java-backend.md](06-java-backend.md) |
| Custom data source | Java DataPageQuery | [06-java-backend.md](06-java-backend.md) |
| BPMN workflow | Process Definition (.def) | [07-process-definitions.md](07-process-definitions.md) |
| Innovation Studio view | View Definition (.def) | See `.cursor/_instructions/UI/Template/create-view-definition.md` |
