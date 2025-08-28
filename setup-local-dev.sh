#!/bin/bash

echo "🚀 SCK Platform Local Development Setup"
echo "========================================"

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18+ required, found version $NODE_VERSION"
    echo "Please install Node.js 20.x from https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js version: $(node --version)"

# Enable Corepack and set Yarn 4.0.2
echo "⚙️  Enabling Corepack and setting Yarn 4.0.2..."
corepack enable
corepack prepare yarn@4.0.2 --activate
echo "✅ Yarn version: $(yarn --version)"

# Install dependencies
echo "📦 Installing dependencies..."
yarn install --immutable

# Generate Prisma client
echo "🔧 Generating Prisma client..."
yarn workspace @sck/web prisma generate

echo ""
echo "🎉 Setup complete! Your local dev environment is ready."
echo ""
echo "🚀 Start development:"
echo "   yarn dev"
echo ""
echo "🔨 Build for production:"
echo "   yarn build"
echo ""
echo "🧪 Run tests:"
echo "   yarn test"
