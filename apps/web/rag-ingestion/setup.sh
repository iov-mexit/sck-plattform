#!/bin/bash

echo "🚀 SCK RAG Ingestion Package Setup"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the rag-ingestion directory"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18+ required, found version $NODE_VERSION"
    exit 1
fi
echo "✅ Node.js version: $(node --version)"

# Check if yarn is available
if ! command -v yarn &> /dev/null; then
    echo "⚠️  Yarn not found, installing dependencies with npm..."
    npm install
else
    echo "✅ Yarn found, installing dependencies..."
    yarn install
fi

# Create data directory
mkdir -p data
echo "📁 Created data directory"

# Check environment variables
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "⚠️  Warning: SUPABASE_SERVICE_ROLE_KEY not set"
    echo "   You'll need to set this before running the ingestion"
    echo "   export SUPABASE_SERVICE_ROLE_KEY='your-service-role-key'"
else
    echo "✅ SUPABASE_SERVICE_ROLE_KEY is set"
fi

if [ -z "$SUPABASE_URL" ]; then
    echo "ℹ️   SUPABASE_URL not set, will use default SCK URL"
else
    echo "✅ SUPABASE_URL is set: $SUPABASE_URL"
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo "1. Set your SUPABASE_SERVICE_ROLE_KEY:"
echo "   export SUPABASE_SERVICE_ROLE_KEY='your-service-role-key'"
echo ""
echo "2. Run the ingestion:"
echo "   yarn seed"
echo ""
echo "3. Test your RAG system at /rag/search"
