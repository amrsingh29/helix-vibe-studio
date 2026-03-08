#!/bin/bash

# BMC Helix Innovation Studio - Docker/Podman Setup Script
# This script helps you set up the containerized development environment
#
# Usage:
#   ./setup.sh              # auto-detect or prompt if both engines are available
#   ./setup.sh --docker     # force Docker
#   ./setup.sh --podman     # force Podman

set -e

# Source the container engine abstraction layer (pass args for --docker/--podman)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "${SCRIPT_DIR}/container-engine.sh" "$@"
shift $ENGINE_ARGS_CONSUMED

cd "$SCRIPT_DIR"

echo "=========================================="
echo "BMC Helix Innovation Studio Setup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "Checking prerequisites..."
echo -e "${GREEN}✓ ${ENGINE_LABEL} is installed${NC}"
echo -e "${GREEN}✓ Compose (${COMPOSE_ENGINE}) is available${NC}"
echo ""

# Create necessary directories
echo "Creating workspace directories..."
mkdir -p workspace
mkdir -p sdk

echo -e "${GREEN}✓ Directories created${NC}"
echo ""

# Check if SDK exists
if [ ! -d "${SDK_HOST_PATH}" ]; then
    echo -e "${YELLOW}⚠ Warning: BMC Helix Innovation Studio SDK not found${NC}"
    echo ""
    echo "Please download the SDK and extract it to:"
    echo "  $(pwd)/${SDK_HOST_PATH}/"
    echo ""
    echo "You can download the SDK from BMC after logging in with your BMC account."
    echo ""
    read -p "Do you want to continue without the SDK? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✓ SDK found${NC}"
fi
echo ""

# Build container image
echo "Building container image (${ENGINE_LABEL})..."
echo "This may take several minutes on first run..."
if ! compose_exec build; then
    echo -e "${RED}✗ Failed to build container image${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Container image built successfully${NC}"
echo ""

# Start container
echo "Starting container..."
if ! compose_exec up -d; then
    echo -e "${RED}✗ Failed to start container${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Container started successfully${NC}"
echo ""

# Install SDK if it exists
if [ -d "${SDK_HOST_PATH}" ]; then
    echo "Installing SDK dependencies..."
    if compose_exec exec -T bmc-helix-dev bash -c "cd ${SDK_CONTAINER_PATH}/lib && mvn clean install"; then
        echo -e "${GREEN}✓ SDK dependencies installed${NC}"
    else
        echo -e "${YELLOW}⚠ Warning: Failed to install SDK dependencies${NC}"
        echo "You can manually install them later by running:"
        echo "  ${CONTAINER_ENGINE} exec bmc-helix-innovation-studio bash"
        echo "  cd ${SDK_CONTAINER_PATH}/lib"
        echo "  mvn clean install"
    fi
    echo ""
fi

# Verify installation
echo "Verifying installation..."
echo ""
echo "Java version:"
compose_exec exec -T bmc-helix-dev java -version
echo ""
echo "Maven version:"
compose_exec exec -T bmc-helix-dev mvn -version | head -n 1
echo ""
echo "Node.js version:"
compose_exec exec -T bmc-helix-dev node --version
echo ""
echo "Yarn version:"
compose_exec exec -T bmc-helix-dev yarn --version
echo ""
echo "Grunt version:"
compose_exec exec -T bmc-helix-dev grunt --version
echo ""

echo "=========================================="
echo -e "${GREEN}Setup completed successfully! (${ENGINE_LABEL})${NC}"
echo "=========================================="
echo ""
echo "To access the development environment:"
echo "  ${CONTAINER_ENGINE} exec -it bmc-helix-innovation-studio bash"
echo ""
echo "To stop the environment:"
echo "  ${COMPOSE_ENGINE} -f ${COMPOSE_FILE} down"
echo ""
echo "Your workspace is located at:"
echo "  $(pwd)/workspace"
echo ""
echo "For more information, see README.md"
echo ""
