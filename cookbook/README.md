# BMC Helix Innovation Studio — Development Cookbook

A comprehensive, LLM-optimized knowledge base for building coded applications on BMC Helix Innovation Studio. This cookbook merges all rules, instructions, examples, and checklists from `.cursor/rules/` and `.cursor/_instructions/` into a single navigable structure.

## Structure

| File | Contents |
|------|----------|
| `01-getting-started.md` | Project structure, prerequisites, environment, naming conventions |
| `02-ui-view-components.md` | Standalone + record editor field components — full lifecycle |
| `03-ui-view-actions.md` | Custom view actions — services, registration, wiring |
| `04-ui-services-and-apis.md` | Platform services + REST API integration + qualifications |
| `05-adapt-components.md` | BMC-UX Adapt library — 36 components with imports and links |
| `06-java-backend.md` | Process activities, REST APIs, commands, DataPageQuery |
| `07-process-definitions.md` | BPMN .def file creation and wiring |
| `08-build-deploy.md` | Docker, builds, deployment, verification |
| `09-best-practices.md` | Angular + Java coding standards |
| `10-checklists.md` | Review checklists for frontend and backend |
| `11-troubleshooting.md` | Common errors, platform quirks, solutions |
| `12-glossary.md` | Unified terminology |
| `13-requirement-gathering.md` | Questions to scope new features |

## How This Relates to Other Documentation

| Source | Role | Status |
|--------|------|--------|
| `cookbook/` (this folder) | **Primary reference** — merged, deduplicated, LLM-optimized | Active |
| `.cursor/rules/00-cookbook-index.mdc` | Always-on navigation index | Active (IDE integration) |
| `.cursor/rules/cookbook-*.mdc` | Glob-triggered rules for UI, Java, .def files | Active (IDE integration) |
| `.cursor/rules/bmc-ux-adapt-*.md` | Adapt component detailed API references | Active (deep-dive) |
| `.cursor/rules/bmc-helix-process-definition.mdc` | Process .def detailed guide | Active (deep-dive) |
| `.cursor/_instructions/` | Original detailed instructions with per-file docs | Active (deep-dive reference) |
| `.cursor/rules/_archive/` | Superseded original rules (kept for reference) | Archived |
| `llms.txt` | Machine-readable index following llms.txt spec | Active (discovery) |

## For AI Agents

Start with `llms.txt` at the project root for the full index, or read `01-getting-started.md` to understand the project, then navigate to the specific topic.

## Technology Stack

- BMC Helix Innovation Studio 25.4.00+
- Angular 18.x / TypeScript 5.5.4 / RxJS 7.8.1
- @bmc-ux/adapt-angular 18.24.0
- Java 17 (OpenJDK) / OSGi / JAX-RS / Spring 5.3.42
