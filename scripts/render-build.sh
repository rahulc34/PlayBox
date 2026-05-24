#!/usr/bin/env bash
set -euo pipefail

# Used by Render when build command is: bash scripts/render-build.sh
# Installs Frontend build tooling even when NODE_ENV=production.

export NPM_CONFIG_PRODUCTION=false

npm ci --prefix Frontend
npm run build --prefix Frontend
npm ci --prefix Backend --omit=dev
