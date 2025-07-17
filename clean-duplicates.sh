#!/bin/bash

echo "🧹 Cleaning up duplicate files..."

# Remove compiled JavaScript files from dist directories
find . -path "*/dist/*" -name "*.js" -delete
find . -path "*/dist/*" -name "*.js.map" -delete

# Remove any remaining .js files that have .ts counterparts
find . -name "*.js" -not -path "./node_modules/*" -not -path "./.next/*" | while read -r jsfile; do
    tsfile="${jsfile%.js}.ts"
    tsxfile="${jsfile%.js}.tsx"
    
    if [ -f "$tsfile" ] || [ -f "$tsxfile" ]; then
        echo "🗑️  Removing duplicate: $jsfile"
        rm "$jsfile"
    fi
done

# Remove any remaining .jsx files that have .tsx counterparts
find . -name "*.jsx" -not -path "./node_modules/*" -not -path "./.next/*" | while read -r jsxfile; do
    tsxfile="${jsxfile%.jsx}.tsx"
    
    if [ -f "$tsxfile" ]; then
        echo "🗑️  Removing duplicate: $jsxfile"
        rm "$jsxfile"
    fi
done

echo "✅ Cleanup complete!"
echo ""
echo "💡 To prevent future duplicates:"
echo "   1. Use 'noEmit: true' in tsconfig.json"
echo "   2. Avoid manual compilation of .ts files"
echo "   3. Use Next.js build process instead"
echo "   4. Run this script regularly: ./clean-duplicates.sh" 