#!/bin/bash

# SCK Database Setup Script
# This script sets up the database and environment for local development

set -e

echo "🚀 Setting up SCK Database and Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << 'EOF'
# SCK Web App - Local Development Environment

# =============================================================================
# CORE CONFIGURATION
# =============================================================================

NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_API_VERSION=v1

# =============================================================================
# DATABASE CONFIGURATION
# =============================================================================

DATABASE_URL="postgresql://postgres:password@localhost:5432/sck_database"

# =============================================================================
# WEB3 & BLOCKCHAIN CONFIGURATION
# =============================================================================

NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=abc123xyz789
NEXT_PUBLIC_ETHEREUM_MAINNET_RPC=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
NEXT_PUBLIC_POLYGON_MAINNET_RPC=https://polygon-rpc.com
NEXT_PUBLIC_POLYGON_MUMBAI_RPC=https://rpc-mumbai.maticvigil.com
NEXT_PUBLIC_FLARE_MAINNET_RPC=https://flare-api.flare.network/ext/C/rpc
NEXT_PUBLIC_FLARE_COSTON_RPC=https://coston-api.flare.network/ext/C/rpc

# Contract Addresses (Deploy these first)
NEXT_PUBLIC_DIGITAL_TWIN_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_DID_REGISTRY_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_DAO_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890

# =============================================================================
# AUTHENTICATION & IDENTITY
# =============================================================================

NEXT_PUBLIC_DID_RESOLVER_URL=https://dev.uniresolver.io
NEXT_PUBLIC_DID_METHOD=did:ethr

# =============================================================================
# PAYMENT & MONETIZATION
# =============================================================================

NEXT_PUBLIC_PAYMENT_STRATEGY=crypto
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_1234567890abcdef
NEXT_PUBLIC_CRYPTO_PAYMENT_ENABLED=true
NEXT_PUBLIC_ILP_ENABLED=true

# =============================================================================
# MONITORING & ANALYTICS
# =============================================================================

NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
NEXT_PUBLIC_SENTRY_ENVIRONMENT=development
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_vercel_analytics_id
NEXT_PUBLIC_ANALYTICS_ID=UA-XXXXX-Y
NEXT_PUBLIC_APM_URL=https://your-apm-url.com
NEXT_PUBLIC_UNLEASH_URL=https://your-unleash-instance.com
NEXT_PUBLIC_UNLEASH_CLIENT_KEY=your_unleash_client_key

# =============================================================================
# INTERNATIONALIZATION
# =============================================================================

NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_SUPPORTED_LOCALES=en,de,es,fr
NEXT_PUBLIC_FALLBACK_LOCALE=en

# =============================================================================
# API CONFIGURATION
# =============================================================================

NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1

# =============================================================================
# CACHING CONFIGURATION
# =============================================================================

NEXT_PUBLIC_REACT_QUERY_STALE_TIME=60000
NEXT_PUBLIC_REACT_QUERY_CACHE_TIME=300000
NEXT_PUBLIC_CDN_URL=http://localhost:3000

# =============================================================================
# LOGGING & DEBUGGING
# =============================================================================

NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_LOG_LEVEL=debug

# =============================================================================
# COMPLIANCE & LEGAL
# =============================================================================

NEXT_PUBLIC_COOKIE_CONSENT_ENABLED=true
NEXT_PUBLIC_COOKIE_CONSENT_BANNER_TEXT="We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies."
NEXT_PUBLIC_PRIVACY_POLICY_URL=http://localhost:3000/privacy
NEXT_PUBLIC_TERMS_OF_SERVICE_URL=http://localhost:3000/terms
NEXT_PUBLIC_GDPR_ENABLED=false
NEXT_PUBLIC_EU_COMPLIANCE=false
NEXT_PUBLIC_SUBDOMAIN=
NEXT_PUBLIC_VALIDATE_ENVIRONMENT=false
EOF
    echo "✅ .env.local created"
else
    echo "✅ .env.local already exists"
fi

# Start PostgreSQL with Docker
echo "🐘 Starting PostgreSQL database..."
docker run --name sck-postgres \
    -e POSTGRES_PASSWORD=password \
    -e POSTGRES_DB=sck_database \
    -p 5432:5432 \
    -d postgres:15

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Check if database is ready
until docker exec sck-postgres pg_isready -U postgres; do
    echo "⏳ Still waiting for database..."
    sleep 2
done

echo "✅ Database is ready!"

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma

# Seed the database
echo "🌱 Seeding database..."
npx prisma db seed --schema=./prisma/schema.prisma

echo "🎉 Setup complete! You can now run:"
echo "  npm run dev"
echo ""
echo "Database is running on:"
echo "  Host: localhost"
echo "  Port: 5432"
echo "  Database: sck_database"
echo "  Username: postgres"
echo "  Password: password" 