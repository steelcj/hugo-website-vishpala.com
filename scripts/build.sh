#!/usr/bin/env bash
# build.sh — build the site and generate the Pagefind search index
#
# Usage: bash scripts/build.sh
#
# Requirements:
#   - Hugo extended v0.162.0+
#   - Pagefind: npm install -g pagefind   OR   npx pagefind (no install)
#
# Pagefind runs after hugo builds the site, indexing the output directory.
# The index is written to site/pagefind/ and served as static files.

set -euo pipefail

PUBLISH_DIR="site"

echo "Building Hugo site..."
hugo --minify

echo "Running Pagefind indexer..."
if command -v pagefind &>/dev/null; then
  pagefind --site "$PUBLISH_DIR"
else
  npx pagefind --site "$PUBLISH_DIR"
fi

echo ""
echo "Done. Site built to $PUBLISH_DIR/ with search index at $PUBLISH_DIR/pagefind/"
