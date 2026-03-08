Demo: [Teams meeting link](https://teams.microsoft.com/l/meetingrecap?driveId=b%21HmNDC3Ow20-t9aWVcFO5ma0u6nOlrw9Aotmid0O7SQSd62S75EnKQI_Npev7V0gs&driveItemId=01MKMJPYXV4GWFVU7GVVAIP4L3WS7ODQUO&sitePath=https%3A%2F%2Fbmcsoftware-my.sharepoint.com%2F%3Av%3A%2Fg%2Fpersonal%2Fbsouche_bmc_com%2FIQD14axa0-atQIfxe7S-4cKOAWbn1pZYQfoHgvRc7NSkn0A&fileUrl=https%3A%2F%2Fbmcsoftware-my.sharepoint.com%2F%3Av%3A%2Fg%2Fpersonal%2Fbsouche_bmc_com%2FIQD14axa0-atQIfxe7S-4cKOAWbn1pZYQfoHgvRc7NSkn0A&iCalUid=040000008200E00074C5B7101A82E008000000007018D840319FDC01000000000000000010000000B69CC78419324E46879408AA1C6E2E60&threadId=19%3Ameeting_OTg4YzhkYTctNzE0Ny00M2U0LWEyYTYtNjc0NmYxYjc4YTQw%40thread.v2&organizerId=3ca07f33-91e9-43a9-8013-4d6a4c103f9b&tenantId=92b796c5-5839-40a6-8dd9-c1fad320c69b&callId=3d97dd15-2fa6-4dc8-b56f-fbe646bdf90e&threadType=Meeting&meetingType=Scheduled&subType=RecapSharingLink_RecapChiclet)
# BMC Helix Innovation Studio - Containerized Development Environment

A complete, containerized development environment for building BMC Helix Innovation Studio applications with AI-assisted development via Cursor. Supports both **Docker** and **Podman**.

## Prerequisites

1. **Container Engine** (one of the following):
   - **Docker Desktop** - [Mac](https://www.docker.com/products/docker-desktop) | [Windows](https://www.docker.com/products/docker-desktop) | [Linux](https://docs.docker.com/engine/install/)
   - **Podman** - [Mac/Linux](https://podman.io/getting-started/installation) | [Windows](https://github.com/containers/podman/blob/main/docs/tutorials/podman-for-windows.md) (+ `podman-compose`: `pip install podman-compose`)
2. **BMC Helix Innovation Studio SDK** (25.4.00+)
3. **BMC Helix Developer Instance** 
4. **Cursor IDE / Github copilot** - [Download](https://cursor.sh/) (recommended for AI-assisted development)

> **Windows users**: The setup scripts are provided in both Bash (`.sh` for macOS/Linux/WSL) and PowerShell (`.ps1` for Windows). See the platform-specific tabs in each step below.

## Configuration

The SDK version is defined in a single place — the `.env` file at the project root:

```env
SDK_VERSION=25.4.00
```

This value is automatically read by Docker Compose, Podman Compose, the Dockerfile/Containerfile (via build args), and all setup/create-project scripts. To use a different SDK version, edit `.env` and rebuild the container image.

## Setup (First Time)

### Step 1 — Clone and place the SDK

<details open>
<summary>macOS / Linux / WSL</summary>

```bash
git clone <this-repo-url>
cd Sample-IS-Vibe-Coded-App

mkdir -p sdk
# Extract or copy the SDK so you have: sdk/com.bmc.arsys.rx.sdk-<SDK_VERSION>/
# The SDK_VERSION is defined in .env (default: 25.4.00)
```
</details>

<details>
<summary>Windows (PowerShell)</summary>

```powershell
git clone <this-repo-url>
cd Sample-IS-Vibe-Coded-App

New-Item -ItemType Directory -Force -Path sdk
# Extract or copy the SDK so you have: sdk\com.bmc.arsys.rx.sdk-<SDK_VERSION>\
# The SDK_VERSION is defined in .env (default: 25.4.00)
```
</details>

### Step 2 — Build and start the container

The setup scripts auto-detect whether you have Docker or Podman installed. If both are available, you'll be prompted to choose interactively — or you can pass a flag to skip the prompt.

**Option 1 — Automated setup** (recommended):

<details open>
<summary>macOS / Linux / WSL</summary>

```bash
./setup.sh             # auto-detect / interactive prompt
./setup.sh --docker    # force Docker
./setup.sh --podman    # force Podman
```
</details>

<details>
<summary>Windows (PowerShell)</summary>

```powershell
.\setup.ps1             # auto-detect / interactive prompt
.\setup.ps1 -Docker     # force Docker
.\setup.ps1 -Podman     # force Podman
```

> If you get an execution policy error, run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` first.
</details>

**Option 2 — Manual commands**:

<details>
<summary>Docker</summary>

```bash
docker-compose build
docker-compose up -d
docker ps --filter name=bmc-helix-innovation-studio
```
</details>

<details>
<summary>Podman</summary>

```bash
podman-compose -f podman-compose.yml build
podman-compose -f podman-compose.yml up -d
podman ps --filter name=bmc-helix-innovation-studio
```
</details>

### Step 3 — Install the SDK into Maven (first time only)

Replace `docker` with `podman` in all commands below if you use Podman.

```bash
# Replace <SDK_VERSION> with the value from .env (default: 25.4.00)
docker exec bmc-helix-innovation-studio bash -c \
  "cd /opt/sdk/com.bmc.arsys.rx.sdk-<SDK_VERSION>/lib && mvn clean install"
```

This takes ~5 minutes. You only need to do this once (Maven repo is persisted in a Docker volume). The `setup.sh`/`setup.ps1` scripts handle this automatically.

### Step 4 — Choose your path

You have two options:

| Option | When to Use |
|--------|------------|
| **A. Create a new project** | Recommended. Start fresh with your own application name and credentials |
| **B. Use an existing project** | You already have a project in `workspace/` (e.g. from a teammate or a previous session) |

#### Option A — Create a new project (recommended)

Run the interactive setup script:

<details open>
<summary>macOS / Linux / WSL</summary>

```bash
./create-project.sh             # auto-detect / interactive prompt
./create-project.sh --docker    # force Docker
./create-project.sh --podman    # force Podman
```
</details>

<details>
<summary>Windows (PowerShell)</summary>

```powershell
.\create-project.ps1             # auto-detect / interactive prompt
.\create-project.ps1 -Docker     # force Docker
.\create-project.ps1 -Podman     # force Podman
```
</details>

It will prompt you for:

| Prompt | Example | Notes |
|--------|---------|-------|
| Project Name | `my-poc-app` | Lowercase, hyphens only. Becomes the folder under `workspace/` |
| Friendly Name | `My Poc App` | Human-readable name shown in Innovation Studio |
| Group ID | `com.mycompany` | Maven group ID |
| Version | `1.0.0-SNAPSHOT` | Maven artifact version |
| Developer Username | `Demo` | Your BMC Helix login |
| Developer Password | `P@ssw0rd` | Your BMC Helix password |
| Server URL | `https://your-instance.example.com` | Your BMC Helix instance URL |
| Is Application? | `true` | `true` for a full app, `false` for a library |
| Skip UI? | `false` | Set `true` for backend-only projects |

The script generates the full Maven project using the BMC archetype, configures `pom.xml` with your credentials, and creates a `.yarnrc` for Node.js compatibility.

Replace `<your-project>` with your project name in all subsequent commands.

Then continue to Step 5.

#### Option B — Use an existing project

If you already have a project in `workspace/` (e.g. `workspace/sample-app`), update the deployment credentials in its `pom.xml` to point to your BMC Helix instance:

```xml
<properties>
    <developerUserName>YourUsername</developerUserName>
    <developerPassword>YourPassword</developerPassword>
    <webUrl>https://your-helix-instance.example.com</webUrl>
</properties>
```

Then continue to Step 5.

### Step 5 — Install frontend dependencies (first time only)

```bash
docker exec bmc-helix-innovation-studio bash -c \
  "cd /workspace/<your-project>/bundle/src/main/webapp && yarn install"
```

### Step 6 — Build and deploy

```bash
docker exec bmc-helix-innovation-studio bash -c \
  "cd /workspace/<your-project> && mvn clean install -Pdeploy -DskipTests"
```

### Step 7 — Verify deployment

1. Maven output shows `Final Status:Deployed`
2. Open your BMC Helix instance in a browser
3. Hard-refresh the page (Cmd+Shift+R / Ctrl+Shift+R)
4. Log out and back in
5. Open View Designer — your components should appear in the configured group

## Getting Going — Day-to-Day Workflow

### Building a new view component

```
1. Read cookbook/02-ui-view-components.md for the 10-file pattern
2. Create the 10 files (types, registration, design, runtime)
3. Register in main module + export in index.ts
4. Build and deploy:
   docker exec bmc-helix-innovation-studio bash -c \
     "cd /workspace/<your-project> && mvn clean install -Pdeploy -DskipTests"
5. Hard-refresh browser, verify in View Designer
```

### Building a new Java process activity

```
1. Read cookbook/06-java-backend.md for the service pattern
2. Create YourActivity.java + YourResponsePayload.java
3. Register in MyApplication.java (before registerStaticWebResource)
4. Build and deploy:
   docker exec bmc-helix-innovation-studio bash -c \
     "cd /workspace/<your-project> && mvn clean install -Pdeploy -DskipTests"
5. Verify class is in the JAR:
   docker exec bmc-helix-innovation-studio bash -c \
     "jar tf /workspace/<your-project>/bundle/target/*.jar | grep YourActivity"
```

## Common Commands

All commands run inside the container. Replace `<your-project>` with your project folder name (e.g. `my-poc-app`).

> **Podman users**: Replace `docker` with `podman` in every command below. The container name (`bmc-helix-innovation-studio`) is the same for both engines.

```bash
# Build frontend only
docker exec bmc-helix-innovation-studio bash -c \
  "cd /workspace/<your-project>/bundle/src/main/webapp && npm run build"

# Full build (frontend + backend)
docker exec bmc-helix-innovation-studio bash -c \
  "cd /workspace/<your-project> && mvn clean install -DskipTests"

# Build and deploy to server
docker exec bmc-helix-innovation-studio bash -c \
  "cd /workspace/<your-project> && mvn clean install -Pdeploy -DskipTests"

# Backend-only build (skip frontend, saves ~2 min)
docker exec bmc-helix-innovation-studio bash -c \
  "cd /workspace/<your-project> && mvn clean install -DskipTests -PskipUICodeGeneration"

# Start Angular dev server (live reload on http://localhost:4200/helix)
docker exec bmc-helix-innovation-studio bash -c \
  "cd /workspace/<your-project>/bundle/src/main/webapp && npx nx serve shell --host 0.0.0.0 --port 4200 --disable-host-check"

# Interactive shell inside the container
docker exec -it bmc-helix-innovation-studio bash
```

## Project Structure

```
Sample-IS-Vibe-Coded-App/
├── .env                          # SDK_VERSION — single source of truth
├── Dockerfile                    # Ubuntu 22.04 dev container definition
├── Containerfile                 # Copy of Dockerfile (Podman convention)
├── docker-compose.yml            # Container orchestration (Docker)
├── podman-compose.yml            # Container orchestration (Podman)
├── setup.sh / setup.ps1          # Automated setup (Bash / PowerShell)
├── create-project.sh / .ps1      # Interactive project scaffold (Bash / PowerShell)
├── container-engine.sh / .ps1    # Auto-detects Docker vs Podman for scripts
├── AGENTS.md                     # Agent instructions (Copilot agent, Claude, Gemini)
├── llms.txt                      # Machine-readable index (llms.txt spec)
├── llms-full.md                  # Single-file expanded cookbook context
├── cookbook/                      # Development cookbook (13 sections)
├── .github/
│   ├── copilot-instructions.md   # GitHub Copilot repo-wide instructions
│   └── instructions/             # GitHub Copilot path-specific instructions
│       ├── ui-development.instructions.md
│       ├── java-development.instructions.md
│       └── process-definitions.instructions.md
├── .cursor/
│   ├── rules/                    # Cursor AI rules (auto-triggered)
│   │   ├── 00-cookbook-index.mdc  # Always-on: navigation index
│   │   ├── cookbook-ui-*.mdc      # Triggered on .ts/.html/.scss files
│   │   ├── cookbook-java-*.mdc    # Triggered on .java files
│   │   ├── cookbook-process-*.mdc # Triggered on .def files
│   │   ├── bmc-ux-adapt-*.md     # Adapt component deep-dive references
│   │   └── _archive/             # Superseded original rules (kept for ref)
│   └── _instructions/            # Detailed per-topic docs (deep-dive)
├── workspace/                    # ⚠ GITIGNORED — generated locally
│   └── <your-project>/           # Created by create-project.sh
│       ├── pom.xml               # Root Maven config (credentials, deploy URL)
│       ├── bundle/
│       │   ├── pom.xml           # Bundle dependencies
│       │   └── src/main/
│       │       ├── java/…/       # Java process activities & services
│       │       └── webapp/       # Angular/Nx frontend (view components)
│       └── package/
│           ├── pom.xml           # Deployment packaging
│           └── src/main/definitions/  # Record & process definitions
└── sdk/                          # ⚠ GITIGNORED — place SDK here manually
```

## AI-Assisted Development

This project includes a comprehensive **development cookbook** designed for AI-assisted coding, with native support for both **Cursor** and **GitHub Copilot**.

### Cookbook Quick Reference

| Section | What It Covers |
|---------|---------------|
| [01 Getting Started](cookbook/01-getting-started.md) | Project structure, naming conventions |
| [02 UI View Components](cookbook/02-ui-view-components.md) | 10-file pattern, templates, registration |
| [03 UI View Actions](cookbook/03-ui-view-actions.md) | Action services, parameter wiring |
| [04 UI Services & APIs](cookbook/04-ui-services-and-apis.md) | Platform services, REST API integration |
| [05 Adapt Components](cookbook/05-adapt-components.md) | 36 BMC-UX Adapt components |
| [06 Java Backend](cookbook/06-java-backend.md) | Process activities, REST APIs, DTOs |
| [07 Process Definitions](cookbook/07-process-definitions.md) | BPMN .def file creation |
| [08 Build & Deploy](cookbook/08-build-deploy.md) | Docker, Maven, verification |
| [09 Best Practices](cookbook/09-best-practices.md) | Angular 18 + Java coding standards |
| [10 Checklists](cookbook/10-checklists.md) | Pre-deploy review checklists |
| [11 Troubleshooting](cookbook/11-troubleshooting.md) | Common errors and fixes |
| [12 Glossary](cookbook/12-glossary.md) | Platform terminology |
| [13 Requirement Gathering](cookbook/13-requirement-gathering.md) | Scoping questions for new features |

### Cursor IDE

When you open the project in [Cursor](https://cursor.sh/), the `.cursor/rules/` directory provides auto-triggered context:

| File | Trigger | Purpose |
|------|---------|---------|
| `00-cookbook-index.mdc` | Always on | Navigation index — loads on every conversation |
| `cookbook-ui-development.mdc` | `**/webapp/libs/**/*.{ts,html,scss}` | Angular coding standards + checklist links |
| `cookbook-java-development.mdc` | `**/bundle/src/main/java/**/*.java` | Java platform quirks + service registration rules |
| `cookbook-process-definitions.mdc` | `**/db/process/**/*.def` | Process .def format rules |
| `bmc-ux-adapt-*.md` | On demand | Adapt component API deep-dive references |
| `bmc-helix-process-definition.mdc` | On demand | Full process .def JSON templates |

### GitHub Copilot

When you use [GitHub Copilot](https://github.com/features/copilot) (in VS Code, JetBrains, or on github.com), the `.github/` directory provides equivalent context:

| File | Scope | Purpose |
|------|-------|---------|
| `.github/copilot-instructions.md` | All conversations in this repo | Project overview, tech stack, cookbook navigation, workflow |
| `.github/instructions/ui-development.instructions.md` | `**/webapp/libs/**/*.{ts,html,scss}` | Angular coding standards (same rules as Cursor) |
| `.github/instructions/java-development.instructions.md` | `**/bundle/src/main/java/**/*.java` | Java platform quirks (same rules as Cursor) |
| `.github/instructions/process-definitions.instructions.md` | `**/db/process/**/*.def` | Process .def format rules (same rules as Cursor) |
| `AGENTS.md` | Copilot coding agent + Claude + Gemini | Agent-mode instructions with key constraints and build commands |

To enable custom instructions in your IDE, see [GitHub Copilot custom instructions docs](https://docs.github.com/en/copilot/concepts/prompting/response-customization).

**VS Code**: Instructions are enabled by default. Verify in Settings > search "instruction" > ensure `github.copilot.chat.codeGeneration.useInstructionFiles` is checked.

**JetBrains**: Only `.github/copilot-instructions.md` is supported (path-specific instructions require VS Code or github.com).

### For Other LLM Tools

The `llms.txt` file at the project root follows the [llms.txt specification](https://llmstxt.org/) for machine-readable documentation discovery. `llms-full.md` provides all 13 sections concatenated into a single file for tools that prefer a single-context approach.

### How the Layers Work Together

```
┌─────────────────────────────────────────────────────────┐
│  AI Tool                                                │
├──────────────────┬──────────────────────────────────────┤
│  Cursor IDE      │  .cursor/rules/*.mdc (auto-triggered)│
├──────────────────┼──────────────────────────────────────┤
│  GitHub Copilot  │  .github/copilot-instructions.md     │
│                  │  .github/instructions/*.instructions.md│
├──────────────────┼──────────────────────────────────────┤
│  Copilot Agent / │  AGENTS.md                           │
│  Claude / Gemini │                                      │
├──────────────────┼──────────────────────────────────────┤
│  Any LLM tool    │  llms.txt → llms-full.md             │
├──────────────────┴──────────────────────────────────────┤
│  Shared Knowledge Base                                  │
│  cookbook/ (13 sections) + .cursor/_instructions/ (deep) │
└─────────────────────────────────────────────────────────┘
```

## Container Environment

| Component | Version | Purpose |
|-----------|---------|---------|
| Ubuntu | 22.04 | Base OS |
| OpenJDK | 17.0.8.1 | Java runtime |
| Maven | 3.9.8 | Build system |
| Node.js | 20.15.1 | JavaScript runtime |
| Yarn | 1.22.22 | Package manager |
| Grunt CLI | 1.3.2 | Task runner |

### Exposed Ports

| Port | Purpose |
|------|---------|
| 4200 | Angular dev server (`nx serve`) |
| 3000 | Development server |
| 8080 | Application server |
| 5005 | Java remote debugging |

### Persistent Volumes

`maven-repo`, `npm-cache`, `yarn-cache` — cached between container restarts for faster builds.

## Troubleshooting

### Build Killed (Exit 137)
The Angular build needs several GB RAM. Two options:
- **Option A**: Increase container memory (Docker Desktop → Settings → Resources → **16 GB**; or `podman machine set --memory 16384`)
- **Option B**: Build UI on host: run `./build-ui-on-host.sh` then `mvn ... -PusePrebuiltUI` in the container (see [cookbook/11-troubleshooting.md](cookbook/11-troubleshooting.md))

### SDK Not Found
- Ensure SDK is extracted in `sdk/com.bmc.arsys.rx.sdk-<SDK_VERSION>/` (check `.env` for the version)
- Restart the container: `docker-compose restart` (or `podman-compose -f podman-compose.yml restart`)

### Permission Issues
```bash
sudo chown -R $(whoami) workspace sdk
docker-compose restart   # or: podman-compose -f podman-compose.yml restart
```

### Port Conflicts
Modify port mappings in `docker-compose.yml` (or `podman-compose.yml`):
```yaml
ports:
  - "8081:8080"  # Change the host port (left side)
```

### Windows-Specific Issues

**PowerShell execution policy error** (`cannot be loaded because running scripts is disabled`):
```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

**Line ending issues** — If scripts fail with `\r` errors in WSL/Git Bash, configure Git to keep Unix line endings:
```bash
git config core.autocrlf input
git checkout -- setup.sh create-project.sh container-engine.sh
```

**Docker Desktop WSL 2 backend** — Ensure WSL 2 is enabled in Docker Desktop settings (Settings > General > "Use the WSL 2 based engine"). This is required for bind mounts to work correctly.

**Podman on Windows** — Podman runs inside a WSL 2 machine. Initialize it first:
```powershell
podman machine init
podman machine start
```

### Podman-Specific Issues

**"Error: container not found"** — Podman may not be running the machine VM:
```bash
podman machine start
```

**SELinux denials on bind mounts** (Fedora/RHEL) — The `podman-compose.yml` already uses `:Z` labels. If you still get permission errors:
```bash
sudo setenforce 0   # temporary, for debugging only
```

**podman-compose not found**:
```bash
pip install podman-compose   # or: brew install podman-compose
```

### Component Not Showing After Deploy
1. Rebuild frontend (`npm run build`) before full build
2. Verify component is registered in the main module
3. Verify component is exported in `index.ts`
4. Clear browser cache and re-login
5. See [cookbook/11-troubleshooting.md](cookbook/11-troubleshooting.md) for more

### API 405 Method Not Allowed
Use `POST /api/rx/application/datapage` for queries, not `GET` on record instance endpoints.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Angular 18.2, Nx 20.8, TypeScript 5.5.4, RxJS 7.8.1, BMC UX Adapt 18.24.0 |
| **Backend** | Java 17 (OpenJDK), Maven, OSGi, JAX-RS, Jackson, Spring 5.3.42 |
| **Platform** | BMC Helix Innovation Studio 25.4.00 |

## Resources

- [BMC Helix Innovation Studio Docs](https://docs.bmc.com/xwiki/bin/view/Service-Management/Innovation-Suite/BMC-Helix-Innovation-Suite/)
- [BMC Developers Portal](https://developers.bmc.com/)
- [Creating a Project with Maven Archetype](https://docs.bmc.com/xwiki/bin/view/Service-Management/Innovation-Suite/BMC-Helix-Innovation-Suite/is254/Developing-applications-by-using-BMC-Helix-Innovation-Studio/Developing-and-deploying-code-based-applications/Creating-a-Project-using-Maven-and-the-Archetype/)
- [llms.txt Specification](https://llmstxt.org/)

---

**Last Updated**: February 24, 2026
**SDK Version**: 25.4.00
