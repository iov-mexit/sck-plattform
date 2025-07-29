#!/bin/bash

# SCK Development Startup Script
# This script ensures all components are properly initialized before starting the dev server

set -e

echo "🚀 Starting SCK Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "This script must be run from the apps/web directory"
    exit 1
fi

print_status "Checking prerequisites..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if PostgreSQL container is running
if ! docker ps | grep -q sck-postgres; then
    print_warning "PostgreSQL container not found. Starting database..."
    cd ../../ && docker-compose up -d postgres
    cd apps/web
    
    # Wait for database to be ready
    print_status "Waiting for database to be ready..."
    sleep 10
fi

print_status "Checking database connection..."
# Test database connection
if ! docker exec sck-postgres pg_isready -U postgres > /dev/null 2>&1; then
    print_error "Database is not ready. Please check Docker setup."
    exit 1
fi

print_success "Database is ready"

# Generate Prisma client
print_status "Generating Prisma client..."
npm run prisma:generate

# Check if database schema is up to date
print_status "Checking database schema..."
if ! npm run check:db; then
    print_warning "Database schema needs updating. Running migrations..."
    cd ../../ && npm run db:push
    cd apps/web
fi

# Seed the database if needed
print_status "Checking if database needs seeding..."
ROLE_COUNT=$(docker exec sck-postgres psql -U postgres -d sck_database -t -c "SELECT COUNT(*) FROM role_templates;" | tr -d ' ')
if [ "$ROLE_COUNT" -eq "0" ]; then
    print_status "Database is empty. Running seed script..."
    npx tsx seed-data.ts
    print_success "Database seeded successfully"
else
    print_success "Database already has data ($ROLE_COUNT role templates found)"
fi

# Kill any existing processes on port 3000
print_status "Checking for existing processes on port 3000..."
if lsof -ti:3000 > /dev/null 2>&1; then
    print_warning "Found existing process on port 3000. Killing it..."
    lsof -ti:3000 | xargs kill -9
    sleep 2
fi

# Start the development server
print_status "Starting Next.js development server..."
print_success "Development environment is ready!"
print_status "Access the application at: http://localhost:3000"
print_status "API endpoints available at: http://localhost:3000/api/v1/*"
print_status "Prisma Studio available at: http://localhost:5555 (run 'npx prisma studio' in another terminal)"

# Start the dev server
npm run dev 