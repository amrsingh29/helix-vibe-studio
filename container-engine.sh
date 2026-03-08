#!/bin/bash

# Container Engine Abstraction Layer
# -----------------------------------
# Source this file from other scripts to get Docker/Podman-agnostic commands.
#
# Usage in calling scripts:
#
#   SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
#   source "${SCRIPT_DIR}/container-engine.sh" "$@"   # pass args through
#   shift $ENGINE_ARGS_CONSUMED                        # remove engine flags
#
# Supported flags (parsed from the caller's $@):
#
#   --docker   Force Docker
#   --podman   Force Podman
#
# If neither flag is given:
#   - When only one engine is installed, it is selected automatically.
#   - When both are available, the user is prompted interactively.
#
# After sourcing, the following variables are available:
#
#   CONTAINER_ENGINE       – "docker" or "podman"
#   COMPOSE_ENGINE         – "docker-compose", "docker compose", or "podman-compose"
#   COMPOSE_FILE           – absolute path to the compose YAML for the detected engine
#   ENGINE_LABEL           – human-readable label ("Docker" or "Podman")
#   ENGINE_ARGS_CONSUMED   – number of positional args consumed (0 or 1)
#   SDK_VERSION            – loaded from .env (e.g. "25.4.00")
#   SDK_DIR_NAME           – "com.bmc.arsys.rx.sdk-<SDK_VERSION>"
#   SDK_HOST_PATH          – relative host path "sdk/<SDK_DIR_NAME>"
#   SDK_CONTAINER_PATH     – container path "/opt/sdk/<SDK_DIR_NAME>"
#
# And the following wrapper functions:
#
#   engine_exec <args>     – runs $CONTAINER_ENGINE <args>
#   compose_exec <args>    – runs $COMPOSE_ENGINE -f $COMPOSE_FILE <args>

set -euo pipefail

# Colors (safe to redefine; callers may also set these)
_CE_RED='\033[0;31m'
_CE_GREEN='\033[0;32m'
_CE_CYAN='\033[0;36m'
_CE_BOLD='\033[1m'
_CE_NC='\033[0m'

ENGINE_ARGS_CONSUMED=0

# ── Availability helpers ─────────────────────────────────────────────

_has_docker() { command -v docker &>/dev/null && docker info &>/dev/null; }
_has_podman() { command -v podman &>/dev/null; }

# ── Parse explicit flag ──────────────────────────────────────────────

_REQUESTED_ENGINE=""

if [ "${1:-}" = "--docker" ]; then
    _REQUESTED_ENGINE="docker"
    ENGINE_ARGS_CONSUMED=1
elif [ "${1:-}" = "--podman" ]; then
    _REQUESTED_ENGINE="podman"
    ENGINE_ARGS_CONSUMED=1
fi

# ── Select container engine ──────────────────────────────────────────

_select_container_engine() {
    local has_docker=false
    local has_podman=false
    _has_docker && has_docker=true
    _has_podman && has_podman=true

    # Explicit flag
    if [ "$_REQUESTED_ENGINE" = "docker" ]; then
        if [ "$has_docker" = false ]; then
            echo -e "${_CE_RED}Error: --docker was specified but Docker is not installed or not running.${_CE_NC}" >&2
            exit 1
        fi
        CONTAINER_ENGINE="docker"; ENGINE_LABEL="Docker"; return
    fi
    if [ "$_REQUESTED_ENGINE" = "podman" ]; then
        if [ "$has_podman" = false ]; then
            echo -e "${_CE_RED}Error: --podman was specified but Podman is not installed.${_CE_NC}" >&2
            exit 1
        fi
        CONTAINER_ENGINE="podman"; ENGINE_LABEL="Podman"; return
    fi

    # Auto-detect
    if [ "$has_docker" = true ] && [ "$has_podman" = true ]; then
        _prompt_engine_choice
    elif [ "$has_docker" = true ]; then
        CONTAINER_ENGINE="docker"; ENGINE_LABEL="Docker"
    elif [ "$has_podman" = true ]; then
        CONTAINER_ENGINE="podman"; ENGINE_LABEL="Podman"
    else
        echo -e "${_CE_RED}Error: Neither Docker nor Podman is installed.${_CE_NC}" >&2
        echo "Install one of:" >&2
        echo "  Docker Desktop : https://www.docker.com/products/docker-desktop" >&2
        echo "  Podman         : https://podman.io/getting-started/installation" >&2
        exit 1
    fi
}

_prompt_engine_choice() {
    echo ""
    echo -e "${_CE_BOLD}Both Docker and Podman are available.${_CE_NC}"
    echo ""
    echo "  1) Docker"
    echo "  2) Podman"
    echo ""
    while true; do
        read -rp "$(echo -e "${_CE_CYAN}Select container engine [1]:${_CE_NC} ")" _choice
        _choice="${_choice:-1}"
        case "$_choice" in
            1) CONTAINER_ENGINE="docker"; ENGINE_LABEL="Docker"; break ;;
            2) CONTAINER_ENGINE="podman"; ENGINE_LABEL="Podman"; break ;;
            *) echo "  Please enter 1 or 2." ;;
        esac
    done
    echo ""
}

# ── Select compose engine ────────────────────────────────────────────

_select_compose_engine() {
    local script_dir
    script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

    if [ "$CONTAINER_ENGINE" = "docker" ]; then
        if docker compose version &>/dev/null; then
            COMPOSE_ENGINE="docker compose"
        elif command -v docker-compose &>/dev/null; then
            COMPOSE_ENGINE="docker-compose"
        else
            echo -e "${_CE_RED}Error: Docker Compose is not installed.${_CE_NC}" >&2
            echo "Install Docker Desktop (includes Compose) or install the plugin separately." >&2
            exit 1
        fi
        COMPOSE_FILE="${script_dir}/docker-compose.yml"
    else
        if command -v podman-compose &>/dev/null; then
            COMPOSE_ENGINE="podman-compose"
        else
            echo -e "${_CE_RED}Error: podman-compose is not installed.${_CE_NC}" >&2
            echo "Install it with:  pip install podman-compose" >&2
            echo "Or:               brew install podman-compose" >&2
            exit 1
        fi
        COMPOSE_FILE="${script_dir}/podman-compose.yml"
    fi
}

_select_container_engine
_select_compose_engine

# ── Load .env ────────────────────────────────────────────────────────

_load_env() {
    local env_file
    env_file="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/.env"
    if [ -f "$env_file" ]; then
        # Source only KEY=VALUE lines (skip comments and blanks)
        set -a
        # shellcheck disable=SC1090
        . "$env_file"
        set +a
    fi
}

_load_env

# Derived paths used by setup and create-project scripts
SDK_DIR_NAME="com.bmc.arsys.rx.sdk-${SDK_VERSION}"
SDK_HOST_PATH="sdk/${SDK_DIR_NAME}"
SDK_CONTAINER_PATH="/opt/sdk/${SDK_DIR_NAME}"

# ── Wrapper functions ────────────────────────────────────────────────

engine_exec() {
    "$CONTAINER_ENGINE" "$@"
}

compose_exec() {
    $COMPOSE_ENGINE -f "$COMPOSE_FILE" "$@"
}
