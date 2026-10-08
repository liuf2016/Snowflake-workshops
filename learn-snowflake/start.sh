#!/bin/bash
set -e

cd "$(dirname "$0")/web"

if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Starting course docs viewer at http://localhost:3070"
npm run dev
