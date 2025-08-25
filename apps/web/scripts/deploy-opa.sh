#!/bin/bash

# Milestone 3: Deploy OPA Sidecar
echo "🔐 Deploying OPA Sidecar for Milestone 3..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Stop existing OPA container if running
echo "🛑 Stopping existing OPA container..."
docker stop opa-sck 2>/dev/null || true
docker rm opa-sck 2>/dev/null || true

# Create OPA configuration directory
echo "📁 Creating OPA configuration..."
mkdir -p opa-config

# Deploy OPA container
echo "🚀 Deploying OPA container..."
docker run -d \
  --name opa-sck \
  --restart unless-stopped \
  -p 8181:8181 \
  -v $(pwd)/opa-config:/opa-config \
  openpolicyagent/opa:latest \
  run --server --config-file=/opa-config/opa-config.yaml

# Wait for OPA to start
echo "⏳ Waiting for OPA to start..."
sleep 5

# Test OPA health
echo "🏥 Testing OPA health..."
if curl -s http://localhost:8181/health > /dev/null; then
    echo "✅ OPA is healthy and running on http://localhost:8181"
    echo "📊 OPA Dashboard: http://localhost:8181"
    echo "🔍 Test endpoint: http://localhost:8181/v1/data/mcp/access"
else
    echo "❌ OPA health check failed"
    exit 1
fi

echo ""
echo "🎯 OPA Sidecar deployed successfully!"
echo "📋 Next steps:"
echo "   1. Test policy evaluation"
echo "   2. Configure bundle storage"
echo "   3. Test enforcement integration"
echo ""
echo "🚀 Milestone 3 OPA integration complete!"
