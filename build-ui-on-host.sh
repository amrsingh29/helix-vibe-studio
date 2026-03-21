#!/bin/bash
#
# Build the Angular UI on the host machine (avoids OOM in low-memory Docker/Podman).
# Requires: Node.js 20+, Yarn
#
# After this succeeds, run the full Maven build in the container with -PusePrebuiltUI:
#   docker exec bmc-helix-innovation-studio bash -c \
#     "cd /workspace/helix-vibe-studio && mvn clean install -Pdeploy -DskipTests -PusePrebuiltUI"
#

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Default: workspace/helix-vibe-studio (create-project.sh). Override with WEBAPP_DIR or HELIX_PROJECT_DIR.
HELIX_PROJECT_DIR="${HELIX_PROJECT_DIR:-${SCRIPT_DIR}/workspace/helix-vibe-studio}"
WEBAPP_DIR="${WEBAPP_DIR:-${HELIX_PROJECT_DIR}/bundle/src/main/webapp}"

if [ ! -d "$WEBAPP_DIR" ] && [ -d "${SCRIPT_DIR}/workspace" ]; then
  # First coded app under workspace/ (any folder name)
  for candidate in "${SCRIPT_DIR}/workspace"/*/bundle/src/main/webapp; do
    if [ -d "$candidate" ]; then
      WEBAPP_DIR="$candidate"
      HELIX_PROJECT_DIR="$(cd "$(dirname "$WEBAPP_DIR")/../../.." && pwd)"
      echo "Using detected project: $HELIX_PROJECT_DIR"
      break
    fi
  done
fi

# preinstall.js requires RX_SDK_HOME (loads config from SDK)
SDK_VERSION="${SDK_VERSION:-25.4.00}"
if [ -f "${SCRIPT_DIR}/.env" ]; then
  source "${SCRIPT_DIR}/.env" 2>/dev/null || true
fi
export RX_SDK_HOME="${SCRIPT_DIR}/sdk/com.bmc.arsys.rx.sdk-${SDK_VERSION}"

if [ ! -d "$RX_SDK_HOME" ]; then
  echo "Error: SDK not found at $RX_SDK_HOME"
  echo "Extract the SDK to sdk/com.bmc.arsys.rx.sdk-${SDK_VERSION}/"
  exit 1
fi

if [ ! -d "$WEBAPP_DIR" ]; then
  echo "Error: Webapp directory not found: $WEBAPP_DIR"
  echo "Set WEBAPP_DIR to bundle/src/main/webapp, or run ./create-project.sh, or:"
  echo "  export HELIX_PROJECT_DIR=/path/to/your/coded-app"
  exit 1
fi

# webapp is .../bundle/src/main/webapp → project root is 3 levels up from .../main
MAVEN_PROJECT_DIR="$(cd "$(dirname "$WEBAPP_DIR")/../../.." && pwd)"
export MAVEN_PROJECT_DIR

echo "Building Angular UI on host..."
cd "$WEBAPP_DIR"
yarn install
yarn run build:webpack

echo ""
echo "UI build complete. Maven project root: $MAVEN_PROJECT_DIR"
echo "Run in container (path must match container mount, often /workspace/<project-name>):"
REL_NAME="$(basename "$MAVEN_PROJECT_DIR")"
echo '  docker exec bmc-helix-innovation-studio bash -c \'
echo "    \"cd /workspace/${REL_NAME} && mvn clean install -Pdeploy -DskipTests -PusePrebuiltUI\""
echo ""
echo "If your project is not at /workspace/${REL_NAME} in the container, cd to the same path as on the host."
echo "(Replace docker with podman if using Podman)"
