#!/bin/bash

# BMC Helix Innovation Studio - New Project Setup Script
# Creates a new BMC Helix coded application project using the Maven archetype
#
# Usage:
#   ./create-project.sh              # auto-detect or prompt if both engines are available
#   ./create-project.sh --docker     # force Docker
#   ./create-project.sh --podman     # force Podman

set -e

# Source the container engine abstraction layer (pass args for --docker/--podman)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "${SCRIPT_DIR}/container-engine.sh" "$@"
shift $ENGINE_ARGS_CONSUMED

cd "$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

CONTAINER_NAME="bmc-helix-innovation-studio"
ARCHETYPE_VERSION="${SDK_VERSION}-SNAPSHOT"
DEFAULT_GROUP_ID="com.mycompany"
DEFAULT_VERSION="1.0.0-SNAPSHOT"

echo ""
echo -e "${BOLD}==========================================${NC}"
echo -e "${BOLD} BMC Helix Innovation Studio${NC}"
echo -e "${BOLD} New Project Setup (${ENGINE_LABEL})${NC}"
echo -e "${BOLD}==========================================${NC}"
echo ""

# -------------------------------------------------------------------
# Pre-flight checks
# -------------------------------------------------------------------

echo -e "${CYAN}Checking prerequisites...${NC}"
echo ""

echo -e "${GREEN}  ✓ ${ENGINE_LABEL} is installed${NC}"

# Check container is running
if ! engine_exec ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${RED}Error: Container '${CONTAINER_NAME}' is not running.${NC}"
    echo "  Start it first with: ${COMPOSE_ENGINE} -f ${COMPOSE_FILE} up -d"
    exit 1
fi
echo -e "${GREEN}  ✓ Container '${CONTAINER_NAME}' is running${NC}"

# Check archetype is available
if ! engine_exec exec "$CONTAINER_NAME" bash -c "ls /root/.m2/repository/com/bmc/arsys/rx-sdk-archetype-application/${ARCHETYPE_VERSION}/ &>/dev/null"; then
    echo -e "${RED}Error: BMC archetype (rx-sdk-archetype-application:${ARCHETYPE_VERSION}) not found in Maven local repo.${NC}"
    echo "  Make sure the SDK has been installed with: mvn clean install"
    exit 1
fi
echo -e "${GREEN}  ✓ BMC archetype available (${ARCHETYPE_VERSION})${NC}"
echo ""

# -------------------------------------------------------------------
# Collect project information
# -------------------------------------------------------------------

echo -e "${BOLD}--- Project Configuration ---${NC}"
echo ""

# Project Name (required)
while true; do
    read -rp "$(echo -e "${CYAN}Project Name${NC} (e.g. my-poc-app): ")" PROJECT_NAME

    # Trim whitespace
    PROJECT_NAME=$(echo "$PROJECT_NAME" | xargs)

    if [ -z "$PROJECT_NAME" ]; then
        echo -e "${RED}  Project name is required.${NC}"
        continue
    fi

    # Validate: lowercase, alphanumeric, hyphens only
    if ! echo "$PROJECT_NAME" | grep -qE '^[a-z][a-z0-9-]*$'; then
        echo -e "${RED}  Invalid name. Use lowercase letters, numbers, and hyphens only (must start with a letter).${NC}"
        continue
    fi

    # Check if project already exists
    if [ -d "workspace/${PROJECT_NAME}" ]; then
        echo -e "${RED}  Project 'workspace/${PROJECT_NAME}' already exists. Choose a different name.${NC}"
        continue
    fi

    break
done

# Friendly Name
DEFAULT_FRIENDLY=$(echo "$PROJECT_NAME" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2)}1')
read -rp "$(echo -e "${CYAN}Friendly Name${NC} [${DEFAULT_FRIENDLY}]: ")" FRIENDLY_NAME
FRIENDLY_NAME=${FRIENDLY_NAME:-$DEFAULT_FRIENDLY}

# Group ID
read -rp "$(echo -e "${CYAN}Group ID${NC} [${DEFAULT_GROUP_ID}]: ")" GROUP_ID
GROUP_ID=${GROUP_ID:-$DEFAULT_GROUP_ID}

# Version
read -rp "$(echo -e "${CYAN}Version${NC} [${DEFAULT_VERSION}]: ")" VERSION
VERSION=${VERSION:-$DEFAULT_VERSION}

# Java package (derived from groupId + artifactId, dots instead of hyphens)
PACKAGE_NAME="${GROUP_ID}.$(echo "${PROJECT_NAME}" | tr -d '-')"

# Developer credentials
read -rp "$(echo -e "${CYAN}Developer Username${NC} [Demo]: ")" DEV_USER
DEV_USER=${DEV_USER:-Demo}

read -rsp "$(echo -e "${CYAN}Developer Password${NC} [P@ssw0rd]: ")" DEV_PASS
echo ""
DEV_PASS=${DEV_PASS:-P@ssw0rd}

# Server URL
read -rp "$(echo -e "${CYAN}Server URL${NC} [https://srini-pv-is.pun-itrnch-01.bmc.com]: ")" SERVER_URL
SERVER_URL=${SERVER_URL:-https://srini-pv-is.pun-itrnch-01.bmc.com}

# Bundle type
read -rp "$(echo -e "${CYAN}Is Application?${NC} (true/false) [true]: ")" IS_APP
IS_APP=${IS_APP:-true}

# Skip UI
read -rp "$(echo -e "${CYAN}Skip UI Code Generation?${NC} (true/false) [false]: ")" SKIP_UI
SKIP_UI=${SKIP_UI:-false}

# -------------------------------------------------------------------
# Confirm
# -------------------------------------------------------------------

echo ""
echo -e "${BOLD}--- Review Configuration ---${NC}"
echo ""
echo -e "  Container Engine  : ${GREEN}${ENGINE_LABEL}${NC}"
echo -e "  Project Name      : ${GREEN}${PROJECT_NAME}${NC}"
echo -e "  Friendly Name     : ${GREEN}${FRIENDLY_NAME}${NC}"
echo -e "  Group ID          : ${GREEN}${GROUP_ID}${NC}"
echo -e "  Artifact ID       : ${GREEN}${PROJECT_NAME}${NC}"
echo -e "  Version           : ${GREEN}${VERSION}${NC}"
echo -e "  Java Package      : ${GREEN}${PACKAGE_NAME}${NC}"
echo -e "  Bundle ID         : ${GREEN}${GROUP_ID}.${PROJECT_NAME}${NC}"
echo -e "  Is Application    : ${GREEN}${IS_APP}${NC}"
echo -e "  Skip UI           : ${GREEN}${SKIP_UI}${NC}"
echo -e "  Developer User    : ${GREEN}${DEV_USER}${NC}"
echo -e "  Server URL        : ${GREEN}${SERVER_URL}${NC}"
echo -e "  Location          : ${GREEN}workspace/${PROJECT_NAME}/${NC}"
echo ""

read -rp "Proceed? (y/n) " -n 1 CONFIRM
echo ""

if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Aborted.${NC}"
    exit 0
fi

echo ""

# -------------------------------------------------------------------
# Generate project with Maven archetype
# -------------------------------------------------------------------

echo -e "${CYAN}Generating project with Maven archetype...${NC}"

SAFE_FRIENDLY_NAME="${FRIENDLY_NAME//\'/\'\\\'\'}"
engine_exec exec "$CONTAINER_NAME" bash -c \
    "cd /workspace && mvn archetype:generate -B \
        -DarchetypeGroupId=com.bmc.arsys \
        -DarchetypeArtifactId=rx-sdk-archetype-application \
        -DarchetypeCatalog=local \
        -DarchetypeVersion=${ARCHETYPE_VERSION} \
        -DgroupId=${GROUP_ID} \
        -DartifactId=${PROJECT_NAME} \
        -Dversion=${VERSION} \
        -Dpackage=${PACKAGE_NAME} \
        -Dname='${SAFE_FRIENDLY_NAME}' \
        -DisApplication=${IS_APP} \
        -DskipUICodeGeneration=${SKIP_UI}"

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to generate project.${NC}"
    exit 1
fi

echo -e "${GREEN}  ✓ Project generated${NC}"
echo ""

# -------------------------------------------------------------------
# Configure environment properties in pom.xml
# -------------------------------------------------------------------

echo -e "${CYAN}Configuring environment properties...${NC}"

POM_FILE="workspace/${PROJECT_NAME}/pom.xml"

if [ ! -f "$POM_FILE" ]; then
    echo -e "${YELLOW}  Warning: pom.xml not visible on host yet (bind mount delay).${NC}"
    echo "  Extracting from container..."
    engine_exec cp "${CONTAINER_NAME}:/workspace/${PROJECT_NAME}/pom.xml" "$POM_FILE"
fi

# Replace developer credentials and server URL in pom.xml
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|<developerUserName>developer</developerUserName>|<developerUserName>${DEV_USER}</developerUserName>|" "$POM_FILE"
    sed -i '' "s|<developerPassword>developer</developerPassword>|<developerPassword>${DEV_PASS}</developerPassword>|" "$POM_FILE"
    sed -i '' "s|<webUrl>http://localhost:8008</webUrl>|<webUrl>${SERVER_URL}</webUrl>|" "$POM_FILE"
else
    sed -i "s|<developerUserName>developer</developerUserName>|<developerUserName>${DEV_USER}</developerUserName>|" "$POM_FILE"
    sed -i "s|<developerPassword>developer</developerPassword>|<developerPassword>${DEV_PASS}</developerPassword>|" "$POM_FILE"
    sed -i "s|<webUrl>http://localhost:8008</webUrl>|<webUrl>${SERVER_URL}</webUrl>|" "$POM_FILE"
fi

# Sync updated pom.xml back to container in case bind mount is stale
engine_exec cp "$POM_FILE" "${CONTAINER_NAME}:/workspace/${PROJECT_NAME}/pom.xml"

echo -e "${GREEN}  ✓ Environment properties configured${NC}"
echo ""

# -------------------------------------------------------------------
# Configure yarn to ignore engine compatibility checks
# -------------------------------------------------------------------

echo -e "${CYAN}Configuring yarn engine compatibility workaround...${NC}"

YARNRC_FILE="workspace/${PROJECT_NAME}/bundle/src/main/webapp/.yarnrc"
echo "--ignore-engines true" > "$YARNRC_FILE"
engine_exec cp "$YARNRC_FILE" "${CONTAINER_NAME}:/workspace/${PROJECT_NAME}/bundle/src/main/webapp/.yarnrc"

echo -e "${GREEN}  ✓ Created .yarnrc with --ignore-engines (Node.js compatibility fix)${NC}"
echo ""

# -------------------------------------------------------------------
# Summary
# -------------------------------------------------------------------

echo -e "${BOLD}==========================================${NC}"
echo -e "${GREEN} Project '${PROJECT_NAME}' created successfully!${NC}"
echo -e "${BOLD}==========================================${NC}"
echo ""
echo -e "  ${BOLD}Container Engine:${NC}  ${ENGINE_LABEL}"
echo -e "  ${BOLD}Project location:${NC}  workspace/${PROJECT_NAME}/"
echo -e "  ${BOLD}Bundle ID:${NC}         ${GROUP_ID}.${PROJECT_NAME}"
echo -e "  ${BOLD}Friendly Name:${NC}     ${FRIENDLY_NAME}"
echo ""
echo -e "${BOLD}--- Project Structure ---${NC}"
echo ""
echo "  workspace/${PROJECT_NAME}/"
echo "  ├── pom.xml                            # Parent POM"
echo "  ├── bundle/"
echo "  │   ├── pom.xml                        # Bundle POM (dependencies)"
echo "  │   └── src/main/"
echo "  │       ├── java/.../MyApplication.java  # Bundle Activator"
echo "  │       ├── resources/"
echo "  │       └── webapp/                    # Angular/Nx frontend"
echo "  └── package/"
echo "      ├── pom.xml                        # Packaging POM"
echo "      └── src/"
echo ""
echo -e "${BOLD}--- Next Steps ---${NC}"
echo ""
echo "  1. Install frontend dependencies:"
echo -e "     ${CYAN}${CONTAINER_ENGINE} exec ${CONTAINER_NAME} bash -c \"cd /workspace/${PROJECT_NAME}/bundle/src/main/webapp && yarn install\"${NC}"
echo ""
echo "  2. Build the project:"
echo -e "     ${CYAN}${CONTAINER_ENGINE} exec ${CONTAINER_NAME} bash -c \"cd /workspace/${PROJECT_NAME} && mvn clean install -DskipTests\"${NC}"
echo ""
echo "  3. Build and deploy to server:"
echo -e "     ${CYAN}${CONTAINER_ENGINE} exec ${CONTAINER_NAME} bash -c \"cd /workspace/${PROJECT_NAME} && mvn clean install -Pdeploy -DskipTests\"${NC}"
echo ""
echo "  4. Start dev server (optional):"
echo -e "     ${CYAN}${CONTAINER_ENGINE} exec ${CONTAINER_NAME} bash -c \"cd /workspace/${PROJECT_NAME}/bundle/src/main/webapp && npx nx serve shell --host 0.0.0.0 --port 4200 --disable-host-check\"${NC}"
echo ""
