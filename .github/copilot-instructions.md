# BMC Helix Innovation Studio — Repository Instructions

This is a containerized development environment for building coded applications on BMC Helix Innovation Studio 25.4.00+.

## Technology Stack

- **Frontend**: Angular 18.x, TypeScript 5.5.4, RxJS 7.8.1, @bmc-ux/adapt-angular 18.24.0
- **Backend**: Java 17 (OpenJDK), OSGi, JAX-RS, Spring 5.3.42, Jackson
- **Platform**: BMC Helix Innovation Studio 25.4.00+
- **Build**: Maven, Docker/Podman, Nx 20.8

## Documentation Structure

This project has a comprehensive development cookbook. Before writing or modifying code, consult the relevant section:

| Task | Read First |
|------|-----------|
| Understand the project | `cookbook/01-getting-started.md` |
| Create a view component | `cookbook/02-ui-view-components.md` |
| Create a view action | `cookbook/03-ui-view-actions.md` |
| Use platform services or REST APIs | `cookbook/04-ui-services-and-apis.md` |
| Use Adapt UI components | `cookbook/05-adapt-components.md` |
| Create Java backend services | `cookbook/06-java-backend.md` |
| Create BPMN process definitions | `cookbook/07-process-definitions.md` |
| Build and deploy | `cookbook/08-build-deploy.md` |
| Check coding standards | `cookbook/09-best-practices.md` |
| Review completed work | `cookbook/10-checklists.md` |
| Debug an issue | `cookbook/11-troubleshooting.md` |
| Look up a term | `cookbook/12-glossary.md` |
| Scope a new feature | `cookbook/13-requirement-gathering.md` |

For detailed per-topic docs beyond the cookbook, see `.cursor/_instructions/`.

## Workflow

1. Read `cookbook/01-getting-started.md` to understand project structure
2. Assess the requirement — use `cookbook/13-requirement-gathering.md` if scope is unclear
3. Check `cookbook/09-best-practices.md` before writing code
4. Read the specific cookbook section for the artifact type
5. After implementation, run through `cookbook/10-checklists.md`
6. Build and deploy using `cookbook/08-build-deploy.md`
7. If issues arise, consult `cookbook/11-troubleshooting.md`
