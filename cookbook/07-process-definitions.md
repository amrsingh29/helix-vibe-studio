# Process Definitions (.def Files)

## Overview

Process definitions are BPMN workflows stored as `.def` files in `/package/src/main/definitions/db/process/`. They wrap Java `@Action` services into callable processes that can be triggered from views, rules, or other processes.

## Two Patterns

| Pattern | Flow | When to Use |
|---------|------|-------------|
| **A — Stub** | Start → End | Mock/placeholder with hardcoded defaults |
| **B — Service-Invoking** | Start → ServiceTask → End | Production — calls a registered Java @Action |

Pattern B is recommended for production use.

## .def File Format

NOT pure JSON. Each line in the definition block is prefixed with `   definition     : `:

```
begin process definition
   name           : com.example.sample-application:myProcess
   definition     : {
   definition     :   "version": null,
   definition     :   "name": "com.example.sample-application:myProcess",
   definition     :   ...JSON content...
   definition     : }
end
```

## Step-by-Step: Service-Invoking Process

### Step 1 — Analyze the Java Service

From the `@Action` class, extract:
- `@Action(name = "...")` → `actionTypeName`
- `@ActionParameter(name = "...")` → input parameter names
- `@NotBlank @NotNull` → required vs optional
- Response payload `@JsonProperty` fields → output mappings

### Step 2 — Assign Field IDs

- Input params: start at `536870913`, increment
- Output params: start at `536870912`, increment
- Shift output IDs higher if overlap with inputs

### Step 3 — Map Java Types

| Java Type | resourceType | storageTypeClass |
|-----------|-------------|------------------|
| `String` | `CharacterFieldDefinition` | `CharacterFieldStorageType` |
| `Integer`/`int` | `IntegerFieldDefinition` | `IntegerFieldStorageType` |
| `Boolean` | `CharacterFieldDefinition` | `CharacterFieldStorageType` |

### Step 4 — Generate GUIDs

Every node needs `rx-<uuid-v4>`:
- Process itself
- StartEventDefinition
- EndEventDefinition
- ServiceTaskDefinition
- Each SequenceFlowDefinition (2 for Pattern B)

### Step 5 — Build ServiceTaskDefinition

```json
{
  "resourceType": "com.bmc.arsys.rx.services.process.domain.ServiceTaskDefinition",
  "name": "Execute My Action",
  "guid": "rx-<uuid>",
  "actionTypeName": "<bundleId>:<actionName>",
  "inputMap": [
    { "assignTarget": "<@ActionParameter name>", "expression": "${processContext.<inputFieldId>}" }
  ],
  "outputMap": [
    { "assignTarget": "<outputFieldId>", "expression": "${activityResults.<taskGuid>.output.<@JsonProperty name>}" }
  ]
}
```

Key rules:
- `actionTypeName` = `<bundleId>:<@Action name>`
- `inputMap[].assignTarget` = exact `@ActionParameter(name = "...")` value
- `outputMap[].expression` = `${activityResults.<taskGuid>.output.<fieldName>}`

### Step 6 — Layout JSON

Layout uses JointJS format with cell IDs that OMIT the `rx-` prefix:

- StartEvent: `{"x": 50, "y": 375}`, type `rx.StartEvent`
- ServiceTask: `{"x": 430, "y": 360}`, type `rx.ProcessAction`
- EndEvent: `{"x": 900, "y": 375}`, type `rx.EndEvent`

## Checklist

- [ ] File location: `db/process/<processName>.def`
- [ ] Process name: `<bundleId>:<processName>`
- [ ] All GUIDs unique `rx-<uuid>` format
- [ ] `actionTypeName` matches Java `@Action(name)`
- [ ] Every `@ActionParameter` has inputParam + inputMap entry
- [ ] `inputMap[].assignTarget` matches `@ActionParameter(name)` exactly
- [ ] `outputMap[].expression` references correct `@JsonProperty` field names
- [ ] Required params: `"fieldOption": "REQUIRED"`, optional: `"OPTIONAL"`
- [ ] Layout cell IDs match GUIDs without `rx-` prefix
- [ ] SequenceFlow chains: Start → ServiceTask → End
- [ ] `"synchronous": true` for immediate-return processes
- [ ] Every definition line prefixed with `   definition     : `

## Deployment Warning

Deploy the JAR first before .def files. If deployed together and the @Action isn't yet activated in OSGi, you'll get `ERROR 930: Action type does not exist on server`.

For the complete detailed guide with full JSON templates, see `.cursor/_instructions/Java/Template/create-process-definition.md` and `.cursor/rules/bmc-helix-process-definition.mdc`.
