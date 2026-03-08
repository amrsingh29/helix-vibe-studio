# Requirement Gathering

Use this guide to systematically gather requirements before building a View Component or Java Service. Ask questions conversationally — do not dump the entire list at once.

**For view components that use record definition picker:** Use the dedicated request template: [Request View Component with Record Definition](../docs/request-view-component-with-record-definition.md). It has all required details (record picker, field selection, expression flags) in one place.

## Section 1: What Are You Building?

| # | Question | Options |
|---|----------|---------|
| 1.1 | Artifact type? | **View Component** / **Java Service** / **Both** |
| 1.2 | One-sentence description? | _e.g., "Kanban board of tickets grouped by status"_ |
| 1.3 | Name (kebab-case)? | _e.g., `ticket-kanban-board`_ |

## Section 2: View Component Questions

### Category & Layout
| # | Question | Options |
|---|----------|---------|
| 2A.1 | Category? | Data Table / Create Form / Detail View / Kanban Board / Dashboard/Chart / Interactive Utility / Display Only / Custom Widget |
| 2A.2 | Title bar/header? | Yes / No |
| 2A.3 | Conditionally visible? | Yes / No |
| 2A.4 | View Designer group? | _e.g., `Sample App`_ |
| 2A.5 | Palette icon? | `table` / `edit` / `plus-circle` / `calculator` / `bar-chart` / other |

### Data Source
| # | Question | Options |
|---|----------|---------|
| 2B.1 | Uses record data? | Yes / No |
| 2B.2 | Which record definition(s)? | _e.g., `com.example:Contacts`_ |
| 2B.3 | Record def configurable? | Inspector property / Hardcoded |
| 2B.4 | Fields to display (ID=Name)? | _e.g., `536870913=Name, 536870914=Phone`_ |
| 2B.5 | Include standard fields? | Yes (1,2,3,5,6,7,8,16,379) / Specific / No |

### CRUD
| # | Question | Options |
|---|----------|---------|
| 2C.1 | Operations? | Read / Create / Update / Delete / Multiple |
| 2C.2 | Create form fields? | _List field IDs, names, types_ |
| 2C.3 | Required fields? | _List field IDs_ |
| 2C.4 | Validation rules? | _e.g., max length, regex, range_ |
| 2C.5 | Edit mode? | Inline / Modal / Separate view |
| 2C.6 | Delete confirmation? | Yes / No |
| 2C.7 | After success? | Refresh list / Toast / Navigate / Emit event |

### Filtering, Sorting, Pagination
| # | Question | Options |
|---|----------|---------|
| 2D.1 | Filtering? | Yes / No |
| 2D.2 | Sortable columns? | Yes (which) / No |
| 2D.3 | Pagination? | Yes / No |
| 2D.4 | Default page size? | 10 / 25 / 50 / 100 |

### UI & Styling
| # | Question | Options |
|---|----------|---------|
| 2G.1 | Adapt components? | Yes (which: table, charts, buttons, etc.) / Plain HTML |
| 2G.2 | Loading indicator? | Yes / No |
| 2G.3 | Empty state message? | Yes / No |
| 2G.4 | Error state display? | Yes / No |

### Property Inspector
| # | Question | Options |
|---|----------|---------|
| 2H.1 | Configurable properties? | _List with types_ |
| 2H.2 | Form controls per property? | TextFormControl / SwitchFormControl / NumberFormControl / SelectFormControl |
| 2H.3 | Expression evaluation support? | Yes (which properties) / No |
| 2H.4 | Expose Set Property action? | Yes (which properties) / No |
| 2H.5 | Default values? | _e.g., title="My Component", pageSize="25"_ |

## Section 3: Java Service Questions

### Service Type
| # | Question | Options |
|---|----------|---------|
| 3A.1 | Type? | Process Activity / REST API / Command / DataPageQuery |
| 3A.2 | Description? | _One sentence_ |
| 3A.3 | Class name? | _PascalCase, e.g., `IncidentFetcherProcessActivity`_ |
| 3A.4 | Scope.PUBLIC? | Yes / No |

### Inputs & Outputs
| # | Question | Options |
|---|----------|---------|
| 3B.1 | Input parameters? | _Name, type, required/optional_ |
| 3B.2 | Validation rules? | @NotNull / @NotBlank / custom |
| 3C.1 | Record operations? | Query / Read / Create / Update / Delete / Multi-step |
| 3D.1 | Return type? | Simple value / Response DTO / Markdown table / JSON |
| 3D.2 | DTO fields? | _Name, type, description_ |

### Process Definition
| # | Question | Options |
|---|----------|---------|
| 3G.1 | Needs .def file? | Yes / No (REST API doesn't need one) |
| 3G.2 | Process name? | _e.g., `com.example:fetchIncident`_ |

## Section 4: Both (UI + Backend)

| # | Question | Options |
|---|----------|---------|
| 4.1 | How does UI call backend? | Direct REST / Via Process / Via DataPage |
| 4.2 | Data flow? | Component → REST → Java → Response → Component renders |
| 4.3 | Reusable backend? | Yes (generic, Scope.PUBLIC) / No (tightly coupled) |

## Reference Examples (in `.cursor/_instructions/`)

| Example | Type | Location |
|---------|------|----------|
| pizza-ordering | View Component | `.cursor/_instructions/UI/ObjectTypes/Examples/StandaloneViewComponent/pizza-ordering/` |
| calculate-vat | View Action | `.cursor/_instructions/UI/ObjectTypes/Examples/ViewAction/calculate-vat/` |
| SimpleRest | REST API | `.cursor/_instructions/Java/ObjectTypes/Examples/RestApi/SimpleRest.java` |
| SimpleCommand | Command | `.cursor/_instructions/Java/ObjectTypes/Examples/Command/SimpleCommand.java` |
| SimpleDataPageQuery | DataPageQuery | `.cursor/_instructions/Java/ObjectTypes/Examples/DataPageQuery/SimpleDataPageQuery.java` |
