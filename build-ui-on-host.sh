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
WEBAPP_DIR="${SCRIPT_DIR}/workspace/helix-vibe-studio/bundle/src/main/webapp"

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
  echo "Ensure workspace/helix-vibe-studio exists (run create-project.sh first)."
  exit 1
fi

echo "Building Angular UI on host..."
cd "$WEBAPP_DIR"
yarn install
yarn run build:webpack

echo ""
echo "UI build complete. Now run Maven in the container with -PusePrebuiltUI:"
echo '  docker exec bmc-helix-innovation-studio bash -c \'
echo '    "cd /workspace/helix-vibe-studio && mvn clean install -Pdeploy -DskipTests -PusePrebuiltUI"'
echo ""
echo "(Replace docker with podman if using Podman)"
