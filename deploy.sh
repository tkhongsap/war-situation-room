#!/bin/bash
# Deploy Situation Room to VPS
# Run from the host machine (not sandbox)

set -e

REPO_DIR="/data/.openclaw/workspace-builder/war-situation-room"
CONTAINER_NAME="situation-room"
PORT=3200

echo "🏗️  Building Docker image..."
cd "$REPO_DIR"
docker build -t situation-room:latest .

echo "🛑 Stopping existing container (if any)..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

echo "🚀 Starting container..."
docker run -d \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  -p $PORT:3000 \
  --env-file "$REPO_DIR/.env.local" \
  situation-room:latest

echo "✅ Running on port $PORT"
echo "📍 Add Caddy config for sitrep.tkhongsap.io → localhost:$PORT"

# Caddy config to add:
# sitrep.tkhongsap.io {
#     reverse_proxy localhost:3200
# }
