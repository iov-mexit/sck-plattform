#!/bin/bash

# Milestone 3: Generate Secure Secrets
# Run this script to generate the required environment variables

echo "🔐 Generating Milestone 3 Security Secrets..."
echo "=============================================="
echo ""

# Generate JWT Secret
JWT_SECRET="sck-jwt-$(openssl rand -hex 32)"
echo "JWT_SECRET=$JWT_SECRET"
echo ""

# Generate Bundle Signing Secret
BUNDLE_SIGNING_SECRET="sck-bundle-$(openssl rand -hex 32)"
echo "BUNDLE_SIGNING_SECRET=$BUNDLE_SIGNING_SECRET"
echo ""

# Generate HMAC Shared Secret
HMAC_SHARED_SECRET="sck-hmac-$(openssl rand -hex 32)"
echo "HMAC_SHARED_SECRET=$HMAC_SHARED_SECRET"
echo ""

echo "=============================================="
echo "✅ Secrets generated successfully!"
echo ""
echo "📋 Copy these to your Vercel environment variables:"
echo "   1. Go to Vercel Dashboard → sck-plattform → Settings → Environment Variables"
echo "   2. Add each variable with the values above"
echo "   3. Redeploy your application"
echo ""
echo "🔒 Keep these secrets secure and never commit them to git!"
echo ""
echo "🚀 Ready for Phase B (Database Deployment) when you're done!"
