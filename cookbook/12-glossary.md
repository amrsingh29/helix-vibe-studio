# Glossary

## Application Name
The project identifier found in `/bundle/src/main/webapp/angular.json` under `projects`. Determines the path where Angular code lives: `/bundle/src/main/webapp/libs/<application-name>/`.

## Bundle
An Innovation Studio application package containing custom Java code, configurations, and resources. Each bundle is an OSGi module.

## Bundle ID (bundleId)
Unique identifier: `<groupId>.<artifactId>` from `/bundle/pom.xml`. Example: `com.example.sample-application`. Used for record definition names, REST API URLs, and component type strings.

## Component Type String
Fully qualified identifier for a view component: `<application-name>-<application-name>-<component-name>`. Must be identical in registration `type`, runtime `@RxViewComponent({ name })`, and runtime `selector`.

## Data Dictionary
In View Designer, the treeview showing inputs/outputs of all components and actions on a view. Used by the expression builder to wire components together. Set via `setSettablePropertiesDataDictionary` and `setCommonDataDictionary` in the design model.

## DataPageQuery
A Java component that queries data from various sources and returns paginated results as a DataPage object. Can be custom-built for non-standard data sources.

## Field ID (fieldId)
Integer identifier for a field within a Record Definition. Standard fields: 1 (Request ID), 7 (Status), 8 (Description), 379 (GUID). Custom fields start at 536870913.

## Process Activity
A reusable Java component callable from BPMN processes. Implemented as a Service with methods decorated with `@Action`. Registered in `MyApplication.java`.

## Process Definition
A BPMN workflow stored as a `.def` file in `/package/src/main/definitions/db/process/`. Orchestrates process activities and other tasks.

## Qualification
A string-based filter expression (similar to SQL WHERE clause) using field IDs and operators. Used in both Java backend and Angular frontend for data filtering.

## Record Definition
Data schema in Innovation Studio (like a database table). Stored as `.def` files in `/package/src/main/definitions/db/record/`. Identified by `<bundleId>:<recordDefinitionName>`.

## Record Instance
Individual data entry (row) within a Record Definition. Each has a unique GUID and field values.

## Record Grid
Built-in (out-of-the-box) view component in View Designer. Displays record instances in a tabular grid for a chosen record definition. Features: DataPage-based loading, field pickers (field IDs), sorting, row actions, multi-record edit, runtime filters, predefined filter options, card layout fallback when width is below a threshold, per-field/cell styling, attachment column downloads. Exposes `selectedRow` / `firstSelectedRow` with field IDs (e.g. `RecordGrid.selectedRow.536870913`) for expression builder — use when wiring Set Property or Launch process inputs to the selected row.

## Registration Module
An `@NgModule` class that registers a view component or action with the platform via `RxViewComponentRegistryService` or `RxViewActionRegistryService`.

## Settable Properties
View component properties that can be set at runtime via the "Set Property" view action. Declared in the design model's `setSettablePropertiesDataDictionary`.

## ServiceLocator
Utility class (`com.bmc.arsys.rx.application.common.ServiceLocator`) for accessing Innovation Studio services (RecordService, CacheService, Logger) in Java code.

## Standalone View Component
An Angular component registered with the platform that can be used independently in any view. Not tied to a specific record definition field.

## Record Editor Field View Component
An Angular component designed to be used within a record editor, mapped to a specific record definition field.

## View Action
An Angular service that executes logic in response to UI events. Implements `execute()` returning an Observable. Registered via `RxViewActionRegistryService`.

## View Definition
A `.def` file describing a complete Innovation Studio view (UI layout combining components, actions, and data bindings). Stored in `/package/src/main/definitions/db/view/`.
